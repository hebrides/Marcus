self.addEventListener('message', function(event) {
    const { action, works } = event.data;

    if (action === 'loadData') {
        fetch('stoic-data.json')
            .then(response => response.json())
            .then(data => {
                console.log('Fetched stoic-data.json:', data);
                // Store stoic-data in IndexedDB
                storeInIndexedDB('stoicData', data);
                self.postMessage({ status: 'stoicDataLoaded' });
            })
            .catch(error => {
                console.error('Error loading stoic-data:', error);
                self.postMessage({ status: 'error', error: error.message });
            });
    } else if (action === 'loadWorks') {
        works.forEach(work => {
            fetch(work.textUri)
                .then(response => response.text())
                .then(text => {
                    console.log(`Fetched work ${work.id}:`, text);
                    // Store the work in IndexedDB
                    storeInIndexedDB(`stoicWork_${work.id}`, text);
                    self.postMessage({ id: work.id, status: 'stored' });
                })
                .catch(error => {
                    console.error('Error loading work:', error);
                    self.postMessage({ id: work.id, status: 'error', error: error.message });
                });
        });
    }
});

function storeInIndexedDB(key, value) {
    const request = indexedDB.open('StoicWorksDB', 1);

    request.onupgradeneeded = function(event) {
        const db = event.target.result;
        if (!db.objectStoreNames.contains('works')) {
            db.createObjectStore('works');
        }
        console.log('IndexedDB upgrade needed, created object store');
    };

    request.onsuccess = function(event) {
        const db = event.target.result;
        const transaction = db.transaction('works', 'readwrite');
        const store = transaction.objectStore('works');
        store.put(value, key);
        console.log(`Stored ${key} in IndexedDB`);
    };

    request.onerror = function(event) {
        console.error('IndexedDB error:', event.target.errorCode);
    };
}