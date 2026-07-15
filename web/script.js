// State and data globals are declared at the top of the script.js file.
let appState = {
        currentQuote: null,
        currentAuthor: null,
        currentWork: null,
        currentView: 'quote',
        showExtendedLibrary: false,
        chatScope: 'strict-stoic'
    };

// Stores app data in memory for quick access
let appData = {
};

function getCuration() {
    return appData.curation || {};
}

function getVisibleWorks() {
    if (!appData.works) return [];
    return appData.works.filter(work => {
        if (!appState.showExtendedLibrary && work.tier === 'extended') return false;
        return true;
    });
}

function getQuoteEligibleWorkIds() {
    const works = getVisibleWorks();
    return works
        .filter(work => appState.chatScope === 'broader-classical-ethics' || work.scope !== 'related')
        .map(work => work.id);
}

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
            const curation = getCuration();
            appState.showExtendedLibrary = !!curation.allowExtendedLibrary;
            appState.chatScope = curation.defaultChatScope || 'strict-stoic';
            buildMenu();
            updateScopeLabels();
            console.log('Fetched metadata:', metaData);

            // Check whether the cached version matches the current metadata version.
            // If it does, serve quotes and bio data from IndexedDB (fast, works offline).
            // Work data is loaded lazily on demand and cached per-work in IndexedDB.
            // If IDB is unavailable or the cache is corrupt/outdated, fall back to network fetch.
            return idbGet('version')
                .then(cachedVersion => {
                    if (cachedVersion && cachedVersion === metaData.version) {
                        console.log('Cache hit – loading data from IndexedDB.');
                        return loadFromCache();
                    }
                    console.log('Cache miss or version changed – fetching from network.');
                    return fetchFromNetwork().then(() => persistToCache(metaData.version));
                })
                .catch(err => {
                    // IndexedDB unavailable (e.g. private mode, quota exceeded) or cache
                    // corruption detected – degrade gracefully to a plain network fetch.
                    console.warn('IndexedDB unavailable or cache error, falling back to network:', err);
                    return fetchFromNetwork();
                });
        })
        .catch(error => {
            console.error('Error initializing app data:', error);
        });
});

// Fetch quotes and author bios from the network, then display a quote.
// Work data is NOT loaded here – it is fetched lazily the first time each work is opened.
function fetchFromNetwork() {
    return loadQuotes().then(() => {
        showNewQuote('random');
        return loadAuthorBios();
    });
}

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

// Fetch all author bios in parallel and store them on each author object.
// Bios are small HTML snippets, so prefetching all of them at startup is cheap.
function loadAuthorBios() {
    const { authors } = appData || {};
    if (!authors) return Promise.resolve();
    return Promise.all(
        authors.map(author =>
            fetch(author.bioUri)
                .then(r => r.text())
                .then(bio => {
                    author.bio = bio;
                    console.log(`Loaded author ${author.id} bio.`);
                })
                .catch(err => console.error(`Error loading author ${author.id} bio:`, err))
        )
    );
}

// Return the [indexList, partitions] data for a work, loading it lazily if needed.
// On first access the data is fetched from IDB (if cached) or the network, then
// stored on work.data and written to IDB for future visits.
function getWorkData(work) {
    if (work.data) return Promise.resolve(work.data);

    return idbGet(`work-${work.id}`)
        .catch(() => null)
        .then(cached => {
            if (cached) {
                work.data = cached;
                console.log(`Loaded work ${work.id} from IndexedDB cache.`);
                return cached;
            }
            return fetch(work.dataUri)
                .then(r => r.json())
                .then(data => {
                    work.data = data;
                    idbPut(`work-${work.id}`, data)
                        .catch(err => console.warn(`Failed to cache work ${work.id}:`, err));
                    console.log(`Fetched and cached work ${work.id} from network.`);
                    return data;
                });
        });
}

// Load quotes and author bios from IndexedDB cache.
// Work data is not pre-loaded here; getWorkData() handles that lazily.
// Rejects if the cache is incomplete so the caller can fall back to network fetch.
function loadFromCache() {
    return idbGet('quotes').then(cachedQuotes => {
        if (!cachedQuotes) {
            // Quotes are missing despite a version match – treat as cache corruption.
            throw new Error('Cache integrity error: quotes missing from IndexedDB.');
        }

        appData.quotes.allQuotes = cachedQuotes;
        showNewQuote('random');

        // Populate author bios from cache.
        // Partial cache misses for individual bios are acceptable: the app
        // will show an error message when the user opens a bio that failed to cache.
        const { authors } = appData;
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

        return Promise.all(promises).then(() => {
            console.log('Quotes and bios loaded from IndexedDB cache.');
        });
    });
}

// Persist the current version, quotes, and author bios to IndexedDB.
// Works are persisted lazily by getWorkData() when first opened.
function persistToCache(version) {
    const { authors, quotes } = appData;

    function safePut(key, value) {
        return idbPut(key, value)
            .catch(err => console.error(`Error persisting '${key}' to IndexedDB:`, err));
    }

    const promises = [safePut('version', version)];

    if (quotes && quotes.allQuotes) {
        promises.push(safePut('quotes', quotes.allQuotes));
    }

    if (authors) {
        authors.forEach(author => {
            if (author.bio) {
                promises.push(safePut(`bio-${author.id}`, author.bio));
            }
        });
    }

    return Promise.all(promises)
        .then(() => console.log('Quotes and bios persisted to IndexedDB cache.'));
}

function showNewQuote(selectionMethod) {
    if (!appData.quotes.allQuotes) {
        console.error(`Ummm... ¯\\_(ツ)_/¯ No quote data available!`);
        document.getElementById('quote').innerHTML = 'DERP! ERROR LOADING QUOTE. ¯\\_(ツ)_/¯';
        return;
    }
    const { authors, works, quotes: { allQuotes } } = appData;
    const eligibleWorkIds = new Set(getQuoteEligibleWorkIds());
    const filteredQuotes = allQuotes.filter(q => eligibleWorkIds.has(q.workId));
    const quotePool = filteredQuotes.length > 0 ? filteredQuotes : allQuotes;
    let myQuote;
    if (selectionMethod === 'random') { 
        myQuote = quotePool[Math.floor(Math.random() * quotePool.length)];
    } else { 
      // days since 1970 modulo # quotes rotates through all the quotes, gives new one each day       
        myQuote = quotePool[(Math.ceil((new Date().getTime()) / (1000 * 3600 * 24)) % quotePool.length)];
    }
    const myWork = works.find(work => work.id === myQuote.workId);
    const myAuthor = authors.find(author => author.id === myWork.authorId);

    // update app state
    appState.currentQuote = myQuote;
    appState.currentAuthor = myAuthor;
    appState.currentWork = myWork;
    appState.currentView = 'quote';

    // Display quote
    document.getElementById('quote').innerHTML =
    `<a href="#" id="quoteLink" onclick="showWork('${myQuote.location}')"><label for='modal-toggle'>${myQuote.quote}</label></a>`;

    // Display author, work
    let citationHTML = `~<a href="#" id="authorLink" onclick="showBiography()"><label for="modal-toggle">${myAuthor.name}</label></a>, 
    <a href="#" id="workLink" onclick="showWork()"><label for="modal-toggle">${myWork.title}</label></a>`;

    // get quote location for citation
    const myQuoteLocation = myQuote.location.split(".");
    
    // Compute and display citation chain
    let cumulativeLocation = '';
    for (let i = 0; i < myQuoteLocation.length; i++) {
        cumulativeLocation += (i > 0 ? '.' : '') + myQuoteLocation[i];
        citationHTML += `, <a href="#" id="loc${i}Link" onclick="showWork('${cumulativeLocation}')"><label for="modal-toggle">${myWork.locationSyntax[i]} ${myQuoteLocation[i]}</label></a>`;
    }   
    document.getElementById('citation').innerHTML = citationHTML;
    
    console.log(`New quote: "${myQuote.quote}" ~${myAuthor.name}, ${myWork.title}, ${myQuote.location}`);
}

function dismissMenu() {
  document.getElementById("toggle-menu").checked = false;
  document.querySelectorAll('#menu input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
}

// Build the navigation menu dynamically from appData so all works are always wired up.
// Called once after metadata loads. The static items (Random Quote, etc.) remain in HTML.
function buildMenu() {
    const { authors } = appData;
    if (!authors || !appData.works) return;

    const menuList = document.getElementById('menu-list');
    if (!menuList) return;

    // Remove any previously generated author items
    menuList.querySelectorAll('.menu-author-item').forEach(el => el.remove());
    menuList.querySelectorAll('.menu-tier-header').forEach(el => el.remove());

    const fragment = document.createDocumentFragment();
    const worksByTier = {
        core: getVisibleWorks().filter(work => work.tier !== 'extended'),
        extended: getVisibleWorks().filter(work => work.tier === 'extended')
    };

    function appendTier(tierKey, tierLabel) {
        const tierWorks = worksByTier[tierKey];
        if (!tierWorks || tierWorks.length === 0) return;

        const tierLi = document.createElement('li');
        tierLi.className = 'menu-tier-header';
        tierLi.textContent = tierLabel;
        fragment.appendChild(tierLi);

        const worksByAuthor = {};
        authors.forEach(a => { worksByAuthor[a.id] = []; });
        tierWorks.forEach(w => {
            if (worksByAuthor[w.authorId]) worksByAuthor[w.authorId].push(w);
        });

        authors.forEach(author => {
            const authorWorks = worksByAuthor[author.id] || [];
            if (authorWorks.length === 0) return;

            const li = document.createElement('li');
            li.className = 'menu-author-item';

            const toggleId = tierKey === 'core'
                ? `author-${author.id}-toggle`
                : `author-${tierKey}-${author.id}-toggle`;
            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.id = toggleId;
            checkbox.hidden = true;

            const label = document.createElement('label');
            label.htmlFor = toggleId;
            label.textContent = author.name;

            const worksUl = document.createElement('ul');
            authorWorks.forEach(work => {
                const workLi = document.createElement('li');
                const workA = document.createElement('a');
                workA.href = '#';
                workA.textContent = work.title;
                workA.addEventListener('click', function(e) {
                    e.preventDefault();
                    openWork(work.id);
                });

                workLi.appendChild(workA);
                worksUl.appendChild(workLi);
            });

            li.appendChild(checkbox);
            li.appendChild(label);
            li.appendChild(worksUl);
            fragment.appendChild(li);
        });
    }

    appendTier('core', 'Core Stoic Canon');
    appendTier('extended', 'Extended Library');

    // Insert author items before the first static menu item
    const firstStatic = menuList.querySelector('.menu-static');
    if (firstStatic) {
        menuList.insertBefore(fragment, firstStatic);
    } else {
        menuList.prepend(fragment);
    }

    // Attach dismissMenu to all newly created work links
    menuList.querySelectorAll('.menu-author-item a').forEach(link => {
        link.addEventListener('click', dismissMenu);
    });

    renderStarterPaths();
}

function renderStarterPaths() {
    const starterPaths = appData.starterPaths || [];
    const starterList = document.getElementById('starter-paths-list');
    if (!starterList) return;

    starterList.innerHTML = '';
    starterPaths.forEach(path => {
        const li = document.createElement('li');
        const a = document.createElement('a');
        a.href = '#';
        a.textContent = path.title;
        a.title = path.description || path.title;
        a.addEventListener('click', function(e) {
            e.preventDefault();
            const firstWorkId = (path.workIds || []).find(workId => {
                const work = appData.works.find(w => w.id === workId);
                return work && (appState.showExtendedLibrary || work.tier !== 'extended');
            });
            if (firstWorkId) openWork(firstWorkId);
        });
        li.appendChild(a);
        starterList.appendChild(li);
    });
}

function updateScopeLabels() {
    const toggleExtended = document.getElementById('menu-toggle-extended');
    if (toggleExtended) {
        toggleExtended.textContent = appState.showExtendedLibrary
            ? 'Disable Extended Library'
            : 'Enable Extended Library';
    }
    const toggleScope = document.getElementById('menu-toggle-chat-scope');
    if (toggleScope) {
        toggleScope.textContent = appState.chatScope === 'strict-stoic'
            ? 'Chat Scope: Strict Stoic'
            : 'Chat Scope: Broader Classical Ethics';
    }
}

function toggleExtendedLibrary() {
    appState.showExtendedLibrary = !appState.showExtendedLibrary;
    buildMenu();
    updateScopeLabels();
    showNewQuote('random');
}

function toggleChatScope() {
    appState.chatScope = appState.chatScope === 'strict-stoic'
        ? 'broader-classical-ethics'
        : 'strict-stoic';
    updateScopeLabels();
    showNewQuote('random');
}

// Set the current work (and its author) then open it in the reader modal.
// Used by menu items and any link that navigates to a specific work.
function openWork(workId, location) {
    const work = appData.works && appData.works.find(w => w.id === workId);
    if (!work) {
        console.error('Work not found:', workId);
        return;
    }
    const author = appData.authors && appData.authors.find(a => a.id === work.authorId);
    appState.currentWork = work;
    if (author) appState.currentAuthor = author;
    // Ensure the modal is visible regardless of how this function was called
    document.getElementById('modal-toggle').checked = true;
    showWork(location || '1');
}

function showBiography() {
    appState.currentView = 'bio';
    console.log('Current view:', appState.currentView);

    const myAuthor = appState.currentAuthor;

    modalTitle.innerHTML = myAuthor.name;
    modalBody.innerHTML = '';
    modalLoading.style.display = 'block';

    // Lazily fetch the bio if it wasn't loaded during startup (e.g. race condition or
    // network error), then render it.  Using <div> for the text container because the
    // bio files themselves contain <p> tags and nesting <p> inside <p> is invalid HTML.
    const getBio = myAuthor.bio
        ? Promise.resolve(myAuthor.bio)
        : fetch(myAuthor.bioUri)
              .then(r => r.text())
              .then(bio => { myAuthor.bio = bio; return bio; });

    getBio
        .then(bio => {
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modalBody.innerHTML =
                        `<img id="modal-image" src="${myAuthor.imgUri}" alt="${myAuthor.name} Image" />` +
                        `<div id="modal-text">${bio}</div>`;
                    modalLoading.style.display = 'none';
                });
            });
        })
        .catch(err => {
            console.error('Error loading author bio:', err);
            modalBody.innerHTML = `ERROR LOADING BIO. ¯\\_(ツ)_/¯`;
            modalLoading.style.display = 'none';
        });
}

// Compare two dot-separated numeric version strings, e.g. "4.7" vs "5.1".
// Returns 1 if v1 > v2, -1 if v1 < v2, 0 if equal.
// Used to locate the correct partition for a given work location.
function versionCompare(v1, v2) {
    for (let i = 0, j = 0, n1 = 0, n2 = 0; (i < v1.length || j < v2.length); n1 = n2 = 0, i++, j++) {
        while (i < v1.length && v1[i] !== '.') n1 = n1 * 10 + (v1[i++] - '0');
        while (j < v2.length && v2[j] !== '.') n2 = n2 * 10 + (v2[j++] - '0');
        if (n1 !== n2) return n1 > n2 ? 1 : -1;
    }
    return 0;
}

// Display the current work in the modal, scrolling to the given location.
// Data is loaded lazily via getWorkData(); the loading indicator is shown while
// the fetch is in flight, then a double requestAnimationFrame ensures the browser
// paints that indicator before the (potentially large) HTML is injected.
function showWork(location = '1') {
    appState.currentView = 'work';
    console.log('Current view:', appState.currentView);
    console.log(`Showing work ${appState.currentWork.title}, at location ${location}`);

    modalTitle.innerHTML = appState.currentWork.title;
    modalBody.innerHTML = '';
    modalLoading.style.display = 'block';

    const loc = String(location);

    getWorkData(appState.currentWork)
        .then(data => {
            const indexList = data[0];
            const partitions = data[1];

            if (!Array.isArray(indexList) || !Array.isArray(partitions)) {
                throw new Error('Unsupported work data format.');
            }

            let partitionIndex = indexList.findIndex((id, idx) => {
                const nextId = indexList[idx + 1];
                return versionCompare(loc, id) >= 0 &&
                       (!nextId || versionCompare(loc, nextId) < 0);
            });

            // Fall back to the first partition if the location wasn't matched
            if (partitionIndex === -1) {
                console.warn(`Location "${loc}" not found in index; showing first partition.`);
                partitionIndex = 0;
            }

            // Show the target partition plus one on each side for context
            const n = 1;
            let content = '';
            for (let i = Math.max(0, partitionIndex - n); i <= Math.min(partitions.length - 1, partitionIndex + n); i++) {
                content += partitions[i];
            }

            // Yield to browser so loading indicator paints, then inject content
            requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                    modalBody.innerHTML = content;
                    modalLoading.style.display = 'none';
                    // Scroll the target element into view if it exists in this partition
                    const target = modalBody.querySelector(`[id="${CSS.escape(loc)}"]`);
                    if (target) target.scrollIntoView({ block: 'start', behavior: 'instant' });
                });
            });
        })
        .catch(err => {
            console.error('Error loading work:', err);
            modalBody.innerHTML = 'ERROR LOADING WORK. ¯\\_(ツ)_/¯';
            modalLoading.style.display = 'none';
        });
}

function showChat(myAuthor) {    
    return; 
}

function showSettings() {
    const extendedLabel = appState.showExtendedLibrary ? 'Enabled' : 'Disabled';
    const scopeLabel = appState.chatScope === 'strict-stoic'
        ? 'Strict Stoic'
        : 'Broader Classical Ethics';

    modalTitle.innerHTML = 'Settings';
    modalBody.innerHTML = `
        <div id="modal-text">
            <p><strong>Library Tier:</strong> Core Stoic Canon by default.</p>
            <p><strong>Extended Library:</strong> ${extendedLabel}</p>
            <p><strong>AI Stoic Chat Scope:</strong> ${scopeLabel}</p>
            <p><strong>Inclusion checks:</strong> Public-domain, clean structure, translation quality.</p>
            <p>Use the “Library Scope” menu section to toggle Extended Library and chat scope.</p>
        </div>`;
    modalLoading.style.display = 'none';
    document.getElementById('modal-toggle').checked = true;
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
    <p>~Marcus Aurelius, Meditationes, Book 6, Verse 50</p>
    </div>`;
    return; 
}

function restoreState() {
    return;
}

function attachEventListeners() {
    // attach dismissMenu() to all static a href links in menu
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
    const extendedToggleLink = document.getElementById('menu-toggle-extended');
    if (extendedToggleLink) {
        extendedToggleLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleExtendedLibrary();
            dismissMenu();
        });
    }
    const chatScopeToggleLink = document.getElementById('menu-toggle-chat-scope');
    if (chatScopeToggleLink) {
        chatScopeToggleLink.addEventListener('click', function(e) {
            e.preventDefault();
            toggleChatScope();
            dismissMenu();
        });
    }
    const settingsLink = document.getElementById('settings-link');
    if (settingsLink) {
        settingsLink.addEventListener('click', function(e) {
            e.preventDefault();
            dismissMenu();
            showSettings();
        });
    }
    
    return;
}
