// State and data globals are declared at the top of the script.js file.
let appState = {
        currentQuote: null,
        currentAuthor: null,
        currentWork: null,
        currentView: 'quote'
    };

// Stores app data in memory for quick access
let appData = {
};

// ── IndexedDB helpers ────────────────────────────────────────────────────────
const IDB_NAME    = 'StoicReaderDB';
const IDB_VERSION = 1;
const IDB_STORE   = 'cache';

// Singleton DB connection promise – opened once and reused for all operations.
let _dbPromise = null;

function openDB() {
    if (_dbPromise) return _dbPromise;
    _dbPromise = new Promise((resolve, reject) => {
        const req = indexedDB.open(IDB_NAME, IDB_VERSION);
        req.onupgradeneeded = function(e) {
            e.target.result.createObjectStore(IDB_STORE);
        };
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e.target.error);
    });
    return _dbPromise;
}

function idbGet(key) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const req = db.transaction(IDB_STORE, 'readonly')
                      .objectStore(IDB_STORE).get(key);
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e.target.error);
    }));
}

function idbPut(key, value) {
    return openDB().then(db => new Promise((resolve, reject) => {
        const req = db.transaction(IDB_STORE, 'readwrite')
                      .objectStore(IDB_STORE).put(value, key);
        req.onsuccess = e => resolve(e.target.result);
        req.onerror   = e => reject(e.target.error);
    }));
}
// ────────────────────────────────────────────────────────────────────────────

// Global modal vars
const modalLoading = document.getElementById('modal-data-loading');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    attachEventListeners();

    fetch('data-meta.json')
        .then(response => response.json())
        .then(metaData => {
            appData = metaData;
            console.log('Fetched metadata:', metaData);

            // Check whether the cached version matches the current metadata version.
            // If it does, serve quotes and work/bio data from IndexedDB (fast, works offline).
            // If IDB is unavailable or the cache is corrupt/outdated, fall back to network fetch.
            return idbGet('version')
                .then(cachedVersion => {
                    if (cachedVersion && cachedVersion === metaData.version) {
                        console.log('Cache hit – loading data from IndexedDB.');
                        return loadFromCache();
                    }
                    console.log('Cache miss or version changed – fetching from network.');
                    return loadQuotes().then(() => {
                        showNewQuote('random');
                        loadApplicationData();
                        persistToCache(metaData.version);
                    });
                })
                .catch(err => {
                    // IndexedDB unavailable (e.g. private mode, quota exceeded) or cache
                    // corruption detected – degrade gracefully to a plain network fetch.
                    console.warn('IndexedDB unavailable or cache error, falling back to network:', err);
                    return loadQuotes().then(() => {
                        showNewQuote('random');
                        loadApplicationData();
                    });
                });
        })
        .catch(error => {
            console.error('Error initializing app data:', error);
        });
});

function loadQuotes() {
    return fetch(appData.quotes.allQuotesUri)
        .then(response => response.json())
        .then(quotesData => {
            appData.quotes.allQuotes = quotesData;
            console.log('Fetched quotes:', quotesData);
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
        });
}

function loadApplicationData() {
    // Start with the current quote's author and work
    // Catch errors here to prevent the app from crashing if the data is not available
    const { currentAuthor, currentWork } = appState || {};
    if (!currentAuthor || !currentWork) {
        console.error('Error: Current author or work is not defined in appState.');
        return;
    }

    // Fetch current author bio as text HTML and store it 
    fetch(currentAuthor.bioUri)
        .then(response => response.text())
        .then(bio => {
            currentAuthor.bio = bio;
            console.log('Loaded author bio:', bio);
        })
        .catch(error => {
            console.error('Error loading author bio:', error);
        });

    // Fetch current work indexed JSON data and store it 
    fetch(currentWork.dataUri)
        .then(response => response.json())
        .then(workData => {
            currentWork.data = workData;
            console.log('Loaded work text:', workData);
            // Additional parsing can be done here if needed
        })
        .catch(error => {
            console.error('Error loading work text:', error);
        });
    
    // Load remaining author bio text and indexed work data asynchronously
    // Catch errors here to prevent the app from crashing if the data is not available
    const { authors, works } = appData || {};
    if (!authors || !works) {
        console.error('Error: Authors or works data is not defined in appData.');
        return;
    }

    const authorPromises = authors
        .filter(author => author.id !== currentAuthor.id)
        .map(author => {
            return fetch(author.bioUri)
                .then(response => response.text())
                .then(bio => {
                    author.bio = bio;
                    console.log(`Loaded author ${author.id} bio:`, bio);
                })
                .catch(error => {
                    console.error(`Error loading author ${author.id} bio:`, error);
                });
        });

    const workPromises = works
        .filter(work => work.id !== currentWork.id)
        .map(work => {
            return fetch(work.dataUri)
                .then(response => response.json()) // Changed to response.json() to handle JSON response
                .then(workData => {
                    work.data = workData;
                    console.log(`Loaded work ${work.id} data:`, workData);
                })
                .catch(error => {
                    console.error(`Error loading work ${work.id} data:`, error);
                });
        });
}

// Load all app data from IndexedDB (quotes, work text, author bios).
// Rejects if the cache is incomplete so the caller can fall back to network fetch.
function loadFromCache() {
    return idbGet('quotes').then(cachedQuotes => {
        if (!cachedQuotes) {
            // Quotes are missing despite a version match – treat as cache corruption.
            throw new Error('Cache integrity error: quotes missing from IndexedDB.');
        }

        appData.quotes.allQuotes = cachedQuotes;
        showNewQuote('random');

        // Populate author bios and work data from cache.
        const { authors, works } = appData;
        const promises = [];

        if (authors) {
            authors.forEach(author => {
                promises.push(
                    idbGet(`bio-${author.id}`).then(bio => {
                        if (bio) {
                            author.bio = bio;
                        } else {
                            console.warn(`Cache integrity warning: bio missing for author ${author.id}.`);
                        }
                    })
                );
            });
        }

        if (works) {
            works.forEach(work => {
                promises.push(
                    idbGet(`work-${work.id}`).then(data => {
                        if (data) {
                            work.data = data;
                        } else {
                            console.warn(`Cache integrity warning: data missing for work ${work.id}.`);
                        }
                    })
                );
            });
        }

        return Promise.all(promises).then(() => {
            console.log('All data loaded from IndexedDB cache.');
        });
    });
}

// Persist the current version, quotes, work text, and author bios to IndexedDB.
function persistToCache(version) {
    const { authors, works, quotes } = appData;
    const promises = [];

    promises.push(idbPut('version', version));

    if (quotes && quotes.allQuotes) {
        promises.push(idbPut('quotes', quotes.allQuotes));
    }

    if (authors) {
        authors.forEach(author => {
            if (author.bio) {
                promises.push(idbPut(`bio-${author.id}`, author.bio));
            }
        });
    }

    if (works) {
        works.forEach(work => {
            if (work.data) {
                promises.push(idbPut(`work-${work.id}`, work.data));
            }
        });
    }

    return Promise.all(promises)
        .then(() => console.log('App data persisted to IndexedDB cache.'))
        .catch(err => console.error('Error persisting data to IndexedDB:', err));
}

function showNewQuote(selectionMethod) {
    if (!appData.quotes.allQuotes) {
        console.error(`Ummm... ¯\\_(ツ)_/¯ No quote data available!`);
        document.getElementById('quote').innerHTML = 'DERP! ERROR LOADING QUOTE. ¯\\_(ツ)_/¯';
        return;
    }
    const { authors, works, quotes: { allQuotes } } = appData;
    let myQuote;
    if (selectionMethod === 'random') { 
        myQuote = allQuotes[ Math.floor( Math.random() * allQuotes.length )];
    } else { 
      // days since 1970 modulo # quotes rotates through all the quotes, gives new one each day       
        myQuote = allQuotes[( Math.ceil((new Date().getTime()) / (1000 * 3600 * 24)) % allQuotes.length )];
    }
    const myWork = works.find(work => work.id === myQuote.workId);
    const myAuthor = authors.find(author => author.id === myWork.authorId);

    // update app state
    appState.currentQuote = myQuote;
    appState.currentAuthor = myAuthor;
    appState.currentWork = myWork;
    appState.currentView = 'quote';

    // Display quote
    document.getElementById('quote').innerHTML =  // quote
    `<a href="#" id="quoteLink" onclick="showWork('${myQuote.location}')"><label for='modal-toggle'>${myQuote.quote}</label></a>`;

    // Display author, work
    let citationHTML = `~<a href="#" id="authorLink" onclick="showBiography()"><label for="modal-toggle">${myAuthor.name}</label></a>, 
    <a href="#" id="workLink" onclick="showWork()"><label for="modal-toggle">${myWork.title}</label></a>`;         

    // get quote location for citation
    const  myQuoteLocation = myQuote.location.split(".");
    
    // Compute and display citation chain
    let cumulativeLocation = '';
    for (let i = 0; i < myQuoteLocation.length; i++) {
        cumulativeLocation += (i > 0 ? '.' : '') + myQuoteLocation[i];
        citationHTML += `, <a href="#" id="loc${i}Link" onclick="showWork('${cumulativeLocation}')"><label for="modal-toggle">${myWork.locationSyntax[i]} ${myQuoteLocation[i]}</label></a>`;
    }   
    document.getElementById('citation').innerHTML =  citationHTML;// citation
    
    console.log(`New quote: "${myQuote.quote}" ~${myAuthor.name}, ${myWork.title}, Book ${myQuote.location[0]}, Verse ${myQuote.location[1]}`);
    console.log(`At location: ${myQuote.location}`); 
}

function dismissMenu() {
  document.getElementById("toggle-menu").checked = false;
  document.querySelectorAll('#menu input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
}

function showBiography() {
    appState.currentView = 'bio';
    console.log('Current view:', appState.currentView);

    const myAuthor = appState.currentAuthor;
    
    if (!myAuthor.bio) {
        console.error('No author biography data available!');
        modalTitle.innerHTML = myAuthor.name;
        modalBody.innerHTML = `ERROR LOADING BIO. ¯\\_(ツ)_/¯`;
        return;
    }

    modalLoading.style.display = 'block';
    modalTitle.innerHTML = myAuthor.name;
    modalBody.innerHTML = 
    `<img id="modal-image" src="${myAuthor.imgUri}" alt="${myAuthor.name} Image" />
    <p id="modal-text" >${myAuthor.bio}</p>`;
    modalLoading.style.display = 'none';

}

// We use version compare to find which partition has our quote / index location
function versionCompare(v1, v2) {
    for (let i = 0, j = 0, n1 = 0, n2 = 0; (i < v1.length || j < v2.length); n1 = n2 = 0, i++, j++) {
        while (i < v1.length && v1[i] !== '.') n1 = n1 * 10 + (v1[i++] - '0');
        while (j < v2.length && v2[j] !== '.') n2 = n2 * 10 + (v2[j++] - '0');
        if (n1 !== n2) return n1 > n2 ? 1 : -1;
    }
    return 0;
}

function showWork(location = 0) {   
    appState.currentView = 'work';
    console.log('Current view:', appState.currentView);
    console.log(`Showing work ${appState.currentWork.title}, at location ${location}`);
    

    // update modal title and display loading activity indicator    
    modalTitle.innerHTML = appState.currentWork.title;
    modalBody.innerHTML = '';
    modalLoading.style.display = 'block';

    // Computer data chunks to display
    const indexList = appState.currentWork.data[0];
    const partitions = appState.currentWork.data[1];
    let partitionIndex = indexList.findIndex((id, idx) => {
        const nextId = indexList[idx + 1];
        return versionCompare(location, id) >= 0 && (!nextId || versionCompare(location, nextId) < 0);
    });

    if (partitionIndex === -1) {
        console.error('Location not found in index list!');
        modalBody.innerHTML = 'ERROR LOADING WORK. ¯\\_(ツ)_/¯';
        modalLoading.style.display = 'none';
        return;
    }

     // Display the partition and n partitions forward and back
     const n = 1; // Number of partitions to show before and after
     let content = '';
     for (let i = Math.max(0, partitionIndex - n); i <= Math.min(partitions.length - 1, partitionIndex + n); i++) {
         content += partitions[i];
     }
     modalBody.innerHTML = content;
     modalLoading.style.display = 'none';
 

    // Load the work text asynchronously - hack necessary to make sure the 
    // modal displays instantly and the loading indicator is shown, otherwise
    // webkit will wait until all the text is ready to display before showing
    // the modal, which is weird, non-intuitive, and not user-friendly.   
    // setTimeout(() => {
    //     if (!appState.currentWork.data) {
    //         console.error('No work text data available!');
    //         modalBody.innerHTML = 'ERROR LOADING WORK. ¯\\_(ツ)_/¯';
    //     } else {
    //         modalBody.innerHTML = `<p>${appState.currentWork.data[1]}</p>`;
    //     }
    //     modalLoading.style.display = 'none';
    // }, 100);
}

function showChat(myAuthor) {    
    return; 
}
function showDataProtectionPolicy() {
    document.getElementById('modal-title').innerHTML = 
    `<div style="text-align:center; letter-spacing: 8px; margin-left: 30px;">Data Protection Policy</div>`;
    document.getElementById('modal-body').innerHTML = 
    `<div id="modal-text" style="text-align:center" >
    <img src="img/brand.svg" style="width: 50%; opacity: 60%;" />
    <br />
    <p style="font-size:18px;">The Stoic Reader will never sell your data. </p>
    <br />
    <p style="font-size:15px; line-height: 24px; letter-spacing: 1.3px;">&#8220;Let us try to persuade them. But act even against their will, when the principles of justice lead that way.&#8221;</p>
    <p>~Marcus Aurelius, Medidations, Book 6, Verse 50</p>
    </div>`;
    return; 
}

function restoreState() {
    return;
}

function attachEventListeners() {
    // attach dismissMenu() to all a href links in menu
    document.querySelectorAll('#menu a').forEach(link => {
        link.addEventListener('click', dismissMenu);
    });
    // make sure when modal toggle is unchecked, currentView is set to 'quote'
    document.getElementById('modal-toggle').addEventListener('change', function() {
        if (!this.checked) {
            appState.currentView = 'quote';
            console.log('Modal closed. Current view:', appState.currentView);
        }
    });
    // modal content fullscreen toggle
    document.getElementById('modal-fullscreen').addEventListener('click', function() {
        document.getElementById('modal-content').classList.toggle('fullscreen');
    });
    
    return;
}
