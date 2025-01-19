self.addEventListener('message', function(event) {
    const { action, works } = event.data;

    if (action === 'loadData') {
        fetch('stoic-data.json')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched stoic-data.json:', data);
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

                self.postMessage({ status: 'stoicDataLoaded' });
            })
            .catch(error => {
                console.error('Error loading stoic-data:', error);
                self.postMessage({ status: 'error', error: error.message });
            });
    } else if (action === 'loadWorks') {
        works.forEach(work => {
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
                    self.postMessage({ id: work.id, status: 'stored' });
                })
                .catch(error => {
                    console.error(`Error loading work ${work.id}:`, error);
                    self.postMessage({ id: work.id, status: 'error', error: error.message });
                });
        });
    }
});

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