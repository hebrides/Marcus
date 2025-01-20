self.addEventListener('message', function(event) {
    const { action, works } = event.data;

    if (action === 'loadData') {
        checkForUpdates()
            .then(updatesAvailable => {
                if (updatesAvailable) {
                    loadDataFromInternet();
                } else {
                    loadDataFromIndexedDB();
                }
            })
            .catch(error => {
                console.error('Error checking for updates:', error);
            });
    }
});

function checkForUpdates() {
    return fetch('data-meta.json')
        .then(response => response.json())
        .then(metaData => {
            console.log('Fetched metadata:', metaData);
            return compareVersions(metaData);
        });
}

function compareVersions(metaData) {
    return new Promise((resolve, reject) => {
        const request = indexedDB.open('StoicWorksDB', 1);

        request.onsuccess = function(event) {
            const db = event.target.result;
            const transaction = db.transaction('works', 'readonly');
            const store = transaction.objectStore('works');
            const getRequest = store.get('stoicData');

            getRequest.onsuccess = function() {
                const storedData = getRequest.result;
                if (!storedData || storedData.version !== metaData.version) {
                    resolve(true); // Updates available
                } else {
                    resolve(false); // No updates needed
                }
            };

            getRequest.onerror = function() {
                reject(getRequest.error);
            };
        };

        request.onerror = function(event) {
            reject(event.target.errorCode);
        };
    });
}

function loadDataFromInternet() {
    fetch('data-meta.json')
        .then(response => response.json())
        .then(data => {
            console.log('Fetched data-meta.json:', data);
            // Store stoic-data in IndexedDB
            storeInIndexedDB('stoicData', data);

            // Fetch and store biographies
            data.authors.forEach(author => {
                console.log(`Fetching biography for author ${author.id}: ${author.name} from ${author.biography}`);
                fetch(author.biography)
                    .then(response => {
                        if (!response.ok) {
                            throw new Error(`Network response was not ok for ${author.biography}`);
                        }
                        return response.text();
                    })
                    .then(bio => {
                        console.log(`Fetched biography for author ${author.id}: ${author.name}`);
                        storeInIndexedDB(`bio_${author.id}`, bio);
                    })
                    .catch(error => {
                        console.error(`Error loading biography for author ${author.id}:`, error);
                    });
            });

            // Fetch and store works
            data.works.forEach(work => {
                fetch(work.textUri)
                    .then(response => response.json())
                    .then(json => {
                        console.log(`Fetched work ${work.id}`);
                        // Parse JSON into HTML-marked chapters and verses
                        const parsedContent = parseWork(json);
                        // Store each chapter separately in IndexedDB
                        parsedContent.forEach((chapter, index) => {
                            storeInIndexedDB(`stoicWork_${work.id}_chapter_${index + 1}`, chapter);
                        });
                    })
                    .catch(error => {
                        console.error(`Error loading work ${work.id}:`, error);
                    });
            });

            self.postMessage({ status: 'stoicDataLoaded' });
        })
        .catch(error => {
            console.error('Error loading stoic-data:', error);
            self.postMessage({ status: 'error', error: error.message });
        });
}

function loadDataFromIndexedDB() {
    const request = indexedDB.open('StoicWorksDB', 1);

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('works', 'readonly');
        const store = transaction.objectStore('works');
        const getRequest = store.get('stoicData');

        getRequest.onsuccess = function() {
            const data = getRequest.result;
            console.log('Loaded data from IndexedDB:', data);
            self.postMessage({ status: 'stoicDataLoaded', data: data });
        };

        getRequest.onerror = function() {
            console.error('Error loading data from IndexedDB:', getRequest.error);
        };
    };

    request.onerror = function(event) {
        console.error('IndexedDB error:', event.target.errorCode);
    };
}

function parseWork(json) {
    return json.chapters.map((chapter, chapterIndex) => {
        let htmlContent = `<h2>Chapter ${chapterIndex + 1}</h2>`;
        chapter.verses.forEach((verse, verseIndex) => {
            htmlContent += `<p id="chapter-${chapterIndex + 1}-verse-${verseIndex + 1}">${verse}</p>`;
        });
        return htmlContent;
    });
}

function storeInIndexedDB(key, value) {
    const request = indexedDB.open('StoicWorksDB', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('works')) {
            db.createObjectStore('works');
            console.log('Created object store: works');
        }
        if (!db.objectStoreNames.contains('bios')) {
            db.createObjectStore('bios');
            console.log('Created object store: bios');
        }
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        try {
            const transaction = db.transaction(key.startsWith('bio_') ? 'bios' : 'works', 'readwrite');
            console.log(`Opened transaction on ${key.startsWith('bio_') ? 'bios' : 'works'} object store`);
            const store = transaction.objectStore(key.startsWith('bio_') ? 'bios' : 'works');
            const putRequest = store.put(value, key);

            putRequest.onsuccess = function() {
                console.log(`Stored ${key} in IndexedDB`);
            };

            putRequest.onerror = function(event) {
                console.error(`Error storing ${key} in IndexedDB:`, event.target.errorCode);
            };
        } catch (error) {
            console.error('Transaction error:', error);
        }
    };

    request.onerror = function(event) {
        console.error('IndexedDB error:', event.target.errorCode);
    };
}