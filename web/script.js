// State and data globals are declared at the top of the script.js file.
let appState = {
        currentQuote: null,
        currentAuthor: null,
        currentWork: null,
        currentView: 'quote',
        showExtendedLibrary: false,
        chatScope: 'strict-stoic',
        openBooks: [],
        lastLocations: {},
        activeBookId: null,
        closeAction: 'minimize',
        readerSettings: null,
        bookmarks: []
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
const READER_STATE_KEY = 'stoic-reader-state';
const READER_SETTINGS_KEY = 'stoic-reader-settings';
const BOOKMARKS_KEY = 'stoic-reader-bookmarks';
const MINIMUM_LOADING_TIME = 350;
const DEFAULT_READER_SETTINGS = {
    theme: 'night',
    largeText: false,
    font: 'goudy',
    spacing: 'normal'
};

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    restoreReaderSettings();
    restoreBookmarks();
    attachEventListeners();

    fetch('data-meta.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`Metadata request failed with HTTP ${response.status}.`);
            }
            return response.json();
        })
        .then(metaData => {
            appData = metaData;
            const curation = getCuration();
            appState.showExtendedLibrary = !!curation.allowExtendedLibrary;
            appState.chatScope = curation.defaultChatScope || 'strict-stoic';
            buildMenu();
            updateScopeLabels();
            restoreReaderState();
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
            showStartupError(error);
        });
});

function restoreReaderSettings() {
    try {
        const saved = JSON.parse(localStorage.getItem(READER_SETTINGS_KEY));
        appState.readerSettings = {
            ...DEFAULT_READER_SETTINGS,
            ...(saved || {})
        };
    } catch (error) {
        console.error('Unable to restore reader settings:', error);
        appState.readerSettings = { ...DEFAULT_READER_SETTINGS };
    }
    applyReaderSettings();
}

function saveReaderSettings() {
    localStorage.setItem(READER_SETTINGS_KEY, JSON.stringify(appState.readerSettings));
}

function applyReaderSettings() {
    const settings = appState.readerSettings || DEFAULT_READER_SETTINGS;
    const body = document.body;
    body.classList.toggle('theme-day', settings.theme === 'day');
    body.classList.toggle('reader-large', settings.largeText);
    body.classList.remove('reader-font-goudy', 'reader-font-georgia', 'reader-font-system');
    body.classList.add(`reader-font-${settings.font}`);
    body.classList.remove('reader-spacing-normal', 'reader-spacing-relaxed');
    body.classList.add(`reader-spacing-${settings.spacing}`);
}

function setReaderModalControls(mode) {
    const isReader = mode === 'reader';
    const fullscreen = document.getElementById('modal-fullscreen');
    const bookmark = document.getElementById('modal-bookmark');
    const readerSettings = document.getElementById('modal-reader-settings');
    const minimize = document.getElementById('modal-minimize');
    fullscreen.hidden = !isReader;
    bookmark.hidden = !isReader;
    readerSettings.hidden = !isReader;
    minimize.hidden = !isReader;
    document.getElementById('reader-page-previous').hidden = !isReader;
    document.getElementById('reader-page-next').hidden = !isReader;
    if (!isReader) document.getElementById('modal-content').classList.remove('fullscreen');
}

function restoreBookmarks() {
    try {
        const saved = JSON.parse(localStorage.getItem(BOOKMARKS_KEY));
        appState.bookmarks = Array.isArray(saved) ? saved : [];
    } catch (error) {
        console.error('Unable to restore bookmarks:', error);
        appState.bookmarks = [];
    }
}

function saveBookmarks() {
    localStorage.setItem(BOOKMARKS_KEY, JSON.stringify(appState.bookmarks));
}

function bookmarkKey(workId, location) {
    return `${workId}:${location}`;
}

function updateBookmarkControl() {
    const button = document.getElementById('modal-bookmark');
    if (!appState.currentWork || !button) return;
    const location = getBookTab(appState.currentWork.id)?.location || '1';
    const saved = appState.bookmarks.some(bookmark =>
        bookmark.key === bookmarkKey(appState.currentWork.id, location)
    );
    button.classList.toggle('is-bookmarked', saved);
    button.setAttribute('aria-label', saved ? 'Remove bookmark' : 'Bookmark this location');
}

function toggleBookmark() {
    if (!appState.currentWork) return;
    const location = getBookTab(appState.currentWork.id)?.location || '1';
    const key = bookmarkKey(appState.currentWork.id, location);
    const existing = appState.bookmarks.findIndex(bookmark => bookmark.key === key);
    if (existing === -1) {
        appState.bookmarks.push({
            key,
            workId: appState.currentWork.id,
            location,
            createdAt: Date.now()
        });
    } else {
        appState.bookmarks.splice(existing, 1);
    }
    saveBookmarks();
    updateBookmarkControl();
}

function showStartupError(error) {
    const openedFromFile = window.location.protocol === 'file:';
    const instructions = openedFromFile
        ? 'This page was opened directly from your computer, so the browser blocked its library data. In the web folder, run "python3 -m http.server 8000", then visit http://localhost:8000.'
        : 'The library data could not be loaded. Please refresh the page or try again shortly.';
    const message = `Stoic Reader could not load its library data. ${instructions}`;

    console.error(message, error);
    document.getElementById('quote').textContent =
        'The impediment to action advances action. What stands in the way becomes the way.';
    document.getElementById('citation').textContent =
        `Marcus Aurelius, Meditations 5.20. ${instructions}`;
    document.getElementById('app-load-error').hidden = false;
}

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
                .then(r => {
                    if (!r.ok) throw new Error(`Work request failed with HTTP ${r.status}.`);
                    return r.json();
                })
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
    `<a href="#" id="quoteLink" onclick="openWork('${myWork.id}', '${myQuote.location}', true)"><label for='modal-toggle'>${myQuote.quote}</label></a>`;

    // Display author, work
    let citationHTML = `~<a href="#" id="authorLink" onclick="showBiography()"><label for="modal-toggle">${myAuthor.name}</label></a>, 
    <a href="#" id="workLink" onclick="openWork('${myWork.id}')"><label for="modal-toggle">${myWork.title}</label></a>`;

    // get quote location for citation
    const myQuoteLocation = myQuote.location.split(".");
    
    // Compute and display citation chain
    let cumulativeLocation = '';
    for (let i = 0; i < myQuoteLocation.length; i++) {
        cumulativeLocation += (i > 0 ? '.' : '') + myQuoteLocation[i];
        citationHTML += `, <a href="#" id="loc${i}Link" onclick="openWork('${myWork.id}', '${cumulativeLocation}')"><label for="modal-toggle">${myWork.locationSyntax[i]} ${myQuoteLocation[i]}</label></a>`;
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
function getBookTab(workId) {
    return appState.openBooks.find(book => book.workId === workId);
}

function saveReaderState() {
    localStorage.setItem(READER_STATE_KEY, JSON.stringify({
        openBooks: appState.openBooks,
        lastLocations: appState.lastLocations
    }));
}

function restoreReaderState() {
    try {
        const saved = JSON.parse(localStorage.getItem(READER_STATE_KEY));
        const validWorkIds = new Set((appData.works || []).map(work => work.id));
        appState.openBooks = Array.isArray(saved && saved.openBooks)
            ? saved.openBooks.filter(book => validWorkIds.has(book.workId))
            : [];
        appState.lastLocations = saved && typeof saved.lastLocations === 'object' && saved.lastLocations
            ? saved.lastLocations
            : {};
        renderBookTabs();
    } catch (error) {
        console.error('Unable to restore saved reader state:', error);
        appState.openBooks = [];
    }
}

function renderBookTabs() {
    const dock = document.getElementById('book-tab-dock');
    const tabs = document.getElementById('book-tabs');
    if (!dock || !tabs) return;

    const count = appState.openBooks.length;
    dock.hidden = count === 0;
    tabs.innerHTML = '';

    appState.openBooks.forEach(book => {
        const work = appData.works.find(item => item.id === book.workId);
        if (!work) return;
        const button = document.createElement('button');
        button.type = 'button';
        button.className = `book-tab${book.error ? ' has-error' : ''}`;
        button.title = book.error ? `${work.title}: failed to load; click to retry.` : work.title;
        button.textContent = `${work.title} - ${formatBookLocation(work, book.location)}`;
        button.addEventListener('click', () => openWork(work.id, book.location));
        tabs.appendChild(button);
    });
}

function formatBookLocation(work, location) {
    return String(location).split('.')
        .map((part, index) => `${work.locationSyntax[index] || 'Section'} ${part}`)
        .join(', ');
}

function setBookLoadError(workId, failed) {
    const book = getBookTab(workId);
    if (book) {
        book.error = failed;
        saveReaderState();
        renderBookTabs();
    }
}

function rememberBookLocation(workId, location) {
    const book = getBookTab(workId);
    if (book) {
        book.location = String(location);
        book.error = false;
        appState.lastLocations[workId] = String(location);
        saveReaderState();
        renderBookTabs();
        updateBookmarkControl();
    }
}

function minimizeBook() {
    if (appState.activeBookId) {
        const book = getBookTab(appState.activeBookId);
        if (book) book.minimized = true;
        saveReaderState();
        renderBookTabs();
    }
    document.getElementById('modal-toggle').checked = false;
}

function closeBook() {
    appState.openBooks = appState.openBooks.filter(book => book.workId !== appState.activeBookId);
    appState.activeBookId = null;
    saveReaderState();
    renderBookTabs();
    document.getElementById('modal-toggle').checked = false;
}

function openWork(workId, location, highlightQuote = false) {
    const work = appData.works && appData.works.find(w => w.id === workId);
    if (!work) {
        console.error('Work not found:', workId);
        return;
    }
    const author = appData.authors && appData.authors.find(a => a.id === work.authorId);
    appState.currentWork = work;
    if (author) appState.currentAuthor = author;
    appState.activeBookId = workId;
    let book = getBookTab(workId);
    if (!book) {
        book = {
            workId,
            location: String(location || appState.lastLocations[workId] || '1'),
            minimized: false,
            error: false
        };
        appState.openBooks.push(book);
    } else {
        book.minimized = false;
        if (location) book.location = String(location);
    }
    saveReaderState();
    renderBookTabs();
    // Ensure the modal is visible regardless of how this function was called
    document.getElementById('modal-toggle').checked = true;
    // Quote and citation labels toggle the checkbox after their click handlers run.
    // Reassert the reader state after that default action completes.
    window.setTimeout(() => {
        document.getElementById('modal-toggle').checked = true;
    }, 0);
    showWork(location || book.location || appState.lastLocations[workId] || '1', highlightQuote);
}

function showBiography() {
    appState.currentView = 'bio';
    setReaderModalControls('standard');
    modalBody.classList.remove('settings-mode');
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

function beginModalLoading() {
    modalBody.classList.remove('is-visible');
    modalBody.classList.remove('settings-mode');
    modalBody.innerHTML = '';
    modalLoading.style.display = 'block';
    return Date.now();
}

function showModalContent(content, startedAt) {
    const wait = Math.max(0, MINIMUM_LOADING_TIME - (Date.now() - startedAt));
    window.setTimeout(() => {
        modalBody.innerHTML = content;
        modalLoading.style.display = 'none';
        requestAnimationFrame(() => modalBody.classList.add('is-visible'));
    }, wait);
}

// Display the current work as discrete, snapped pages around the requested location.
function showWork(location = '1', highlightQuote = false) {
    appState.currentView = 'work';
    setReaderModalControls('reader');
    console.log('Current view:', appState.currentView);
    console.log(`Showing work ${appState.currentWork.title}, at location ${location}`);

    modalTitle.innerHTML = appState.currentWork.title;
    const loadingStartedAt = beginModalLoading();

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

            // Show the target partition plus one on each side for context.
            const n = 1;
            const pages = [];
            for (let i = Math.max(0, partitionIndex - n); i <= Math.min(partitions.length - 1, partitionIndex + n); i++) {
                pages.push(`<section class="reader-page" data-location="${indexList[i]}">${partitions[i]}</section>`);
            }

            showModalContent(pages.join(''), loadingStartedAt);
            window.setTimeout(() => {
                const target = modalBody.querySelector(`[id="${CSS.escape(loc)}"]`);
                if (target) {
                    target.scrollIntoView({ block: 'start', inline: 'start', behavior: 'instant' });
                    if (highlightQuote) {
                        target.classList.add('quote-highlight');
                        window.setTimeout(() => target.classList.remove('quote-highlight'), 3500);
                    }
                }
                rememberBookLocation(appState.currentWork.id, loc);
                updateBookmarkControl();
            }, Math.max(0, MINIMUM_LOADING_TIME - (Date.now() - loadingStartedAt)) + 20);
        })
        .catch(err => {
            const workId = appState.currentWork.id;
            const message = `Unable to load "${appState.currentWork.title}".`;
            console.error(message, err);
            setBookLoadError(workId, true);
            showModalContent(
                `<div class="reader-error" role="alert"><p>${message}</p><button type="button" id="retry-work-load">Try again</button></div>`,
                loadingStartedAt
            );
            window.setTimeout(() => {
                const retry = document.getElementById('retry-work-load');
                if (retry) retry.addEventListener('click', () => showWork(loc, highlightQuote));
            }, MINIMUM_LOADING_TIME);
        });
}

function moveReaderPage(direction) {
    if (appState.currentView !== 'work') return;
    const pageWidth = document.getElementById('modal-content').classList.contains('fullscreen')
        ? modalBody.clientWidth / 2
        : modalBody.clientWidth;
    modalBody.scrollBy({ left: direction * pageWidth, behavior: 'smooth' });
}

function rememberVisibleReaderPage() {
    if (appState.currentView !== 'work' || !appState.currentWork) return;
    const pageWidth = document.getElementById('modal-content').classList.contains('fullscreen')
        ? modalBody.clientWidth / 2
        : modalBody.clientWidth;
    const pageIndex = Math.round(modalBody.scrollLeft / pageWidth);
    const page = modalBody.querySelectorAll('.reader-page')[pageIndex];
    if (page?.dataset.location) rememberBookLocation(appState.currentWork.id, page.dataset.location);
}

function showChat(myAuthor) {    
    return; 
}

function showSettings() {
    appState.currentView = 'settings';
    setReaderModalControls('settings');
    const extendedLabel = appState.showExtendedLibrary ? 'Enabled' : 'Disabled';
    const scopeLabel = appState.chatScope === 'strict-stoic'
        ? 'Strict Stoic'
        : 'Broader Classical Ethics';
    const settings = appState.readerSettings;
    const bookmarkList = appState.bookmarks.length === 0
        ? '<p class="setting-note">No saved bookmarks yet.</p>'
        : `<ul class="bookmark-list">${appState.bookmarks.map(bookmark => {
            const work = appData.works.find(item => item.id === bookmark.workId);
            return work
                ? `<li><button type="button" class="bookmark-link" data-work-id="${work.id}" data-location="${bookmark.location}">${work.title} - ${formatBookLocation(work, bookmark.location)}</button></li>`
                : '';
        }).join('')}</ul>`;

    modalTitle.innerHTML = 'Settings';
    modalBody.innerHTML = `
        <div id="modal-text" class="settings-view">
            <h3>Reading</h3>
            <label class="setting-toggle">
                <span>Day mode</span>
                <input id="setting-day-mode" type="checkbox" ${settings.theme === 'day' ? 'checked' : ''} />
                <span class="setting-switch" aria-hidden="true"></span>
            </label>
            <label class="setting-toggle">
                <span>Large text</span>
                <input id="setting-large-text" type="checkbox" ${settings.largeText ? 'checked' : ''} />
                <span class="setting-switch" aria-hidden="true"></span>
            </label>
            <label class="setting-choice" for="setting-font">
                <span>Reading font</span>
                <select id="setting-font">
                    <option value="goudy" ${settings.font === 'goudy' ? 'selected' : ''}>Sorts Mill Goudy</option>
                    <option value="georgia" ${settings.font === 'georgia' ? 'selected' : ''}>Georgia</option>
                    <option value="system" ${settings.font === 'system' ? 'selected' : ''}>System serif</option>
                </select>
            </label>
            <p class="setting-note">Default: Sorts Mill Goudy at 19px.</p>
            <label class="setting-choice" for="setting-spacing">
                <span>Letter spacing</span>
                <select id="setting-spacing">
                    <option value="normal" ${settings.spacing === 'normal' ? 'selected' : ''}>Standard</option>
                    <option value="relaxed" ${settings.spacing === 'relaxed' ? 'selected' : ''}>Relaxed</option>
                </select>
            </label>
            <p class="setting-note">Default: standard spacing.</p>
            <hr>
            <h3>Bookmarks</h3>
            ${bookmarkList}
            <hr>
            <h3>Library</h3>
            <p><strong>Library Tier:</strong> Core Stoic Canon by default.</p>
            <p><strong>Extended Library:</strong> ${extendedLabel}</p>
            <p><strong>AI Stoic Chat Scope:</strong> ${scopeLabel}</p>
            <p><strong>Inclusion checks:</strong> Public-domain, clean structure, translation quality.</p>
            <p>Use the “Library Scope” menu section to toggle Extended Library and chat scope.</p>
            <hr />
            <p><strong>Saved reader state:</strong> Open books and reading positions are stored only in this browser.</p>
            <button type="button" id="clear-reader-state">Clear saved reader state</button>
            <hr>
            <h3>App data</h3>
            <p class="setting-note">Reset clears this app's books, bookmarks, reading settings, and offline cache. Your browser's other site data is unaffected.</p>
            <button type="button" id="reset-app">Reset app</button>
        </div>`;
    modalLoading.style.display = 'none';
    modalBody.classList.add('settings-mode');
    modalBody.classList.add('is-visible');
    document.getElementById('modal-toggle').checked = true;
}

function resetApp() {
    if (!window.confirm('Reset The Stoic Reader on this browser? This clears saved books, bookmarks, settings, and offline data.')) {
        return;
    }

    localStorage.removeItem(READER_STATE_KEY);
    localStorage.removeItem(READER_SETTINGS_KEY);
    localStorage.removeItem(BOOKMARKS_KEY);
    const reload = () => {
        const url = new URL(window.location.href);
        url.searchParams.set('refresh', Date.now().toString());
        window.location.replace(url.toString());
    };
    const clearOfflineCache = () => {
        const deleteRequest = indexedDB.deleteDatabase(IDB_NAME);
        deleteRequest.onsuccess = reload;
        deleteRequest.onblocked = () => {
            console.warn('Offline cache deletion is blocked; reloading without the cached app data.');
            reload();
        };
        deleteRequest.onerror = () => {
            console.error('Unable to clear the offline cache:', deleteRequest.error);
            reload();
        };
    };
    if (_dbPromise) {
        _dbPromise.then(db => {
            db.close();
            clearOfflineCache();
        }).catch(error => {
            console.error('Unable to close the offline cache before reset:', error);
            clearOfflineCache();
        });
    } else {
        clearOfflineCache();
    }
}

function showDataProtectionPolicy() {
    setReaderModalControls('standard');
    modalBody.classList.remove('settings-mode');
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
            if (appState.currentView === 'work' && appState.activeBookId) {
                if (appState.closeAction === 'close') {
                    appState.openBooks = appState.openBooks.filter(book => book.workId !== appState.activeBookId);
                    appState.activeBookId = null;
                    saveReaderState();
                    renderBookTabs();
                } else {
                    const book = getBookTab(appState.activeBookId);
                    if (book) {
                        book.minimized = true;
                        saveReaderState();
                        renderBookTabs();
                    }
                }
            }
            appState.closeAction = 'minimize';
            appState.currentView = 'quote';
            console.log('Modal closed. Current view:', appState.currentView);
        }
    });
    // modal content fullscreen toggle
    document.getElementById('modal-fullscreen').addEventListener('click', function() {
        document.getElementById('modal-content').classList.toggle('fullscreen');
        window.requestAnimationFrame(rememberVisibleReaderPage);
    });
    document.getElementById('modal-bookmark').addEventListener('click', toggleBookmark);
    document.getElementById('modal-reader-settings').addEventListener('click', showSettings);
    document.getElementById('modal-minimize').addEventListener('click', minimizeBook);
    document.getElementById('modal-close').addEventListener('click', closeBook);
    document.getElementById('reader-page-previous').addEventListener('click', () => moveReaderPage(-1));
    document.getElementById('reader-page-next').addEventListener('click', () => moveReaderPage(1));
    document.getElementById('modal-body').addEventListener('click', event => {
        if (appState.currentView !== 'work' || !event.target.closest('.reader-page')) return;
        const bounds = event.currentTarget.getBoundingClientRect();
        const x = event.clientX - bounds.left;
        const pageWidth = document.getElementById('modal-content').classList.contains('fullscreen')
            ? event.currentTarget.clientWidth / 2
            : event.currentTarget.clientWidth;
        if (x < pageWidth * 0.12) {
            moveReaderPage(-1);
        } else if (x > event.currentTarget.clientWidth - pageWidth * 0.12) {
            moveReaderPage(1);
        }
    });
    let readerScrollTimer;
    modalBody.addEventListener('scroll', () => {
        window.clearTimeout(readerScrollTimer);
        readerScrollTimer = window.setTimeout(rememberVisibleReaderPage, 120);
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

    modalBody.addEventListener('click', event => {
        if (event.target.id === 'clear-reader-state') {
            localStorage.removeItem(READER_STATE_KEY);
            appState.openBooks = [];
            appState.lastLocations = {};
            appState.activeBookId = null;
            renderBookTabs();
            event.target.disabled = true;
            event.target.textContent = 'Saved reader state cleared';
        } else if (event.target.id === 'reset-app') {
            resetApp();
        } else if (event.target.classList.contains('bookmark-link')) {
            openWork(event.target.dataset.workId, event.target.dataset.location, true);
        }
    });
    modalBody.addEventListener('change', event => {
        const settings = appState.readerSettings;
        if (event.target.id === 'setting-day-mode') {
            settings.theme = event.target.checked ? 'day' : 'night';
        } else if (event.target.id === 'setting-large-text') {
            settings.largeText = event.target.checked;
        } else if (event.target.id === 'setting-font') {
            settings.font = event.target.value;
        } else if (event.target.id === 'setting-spacing') {
            settings.spacing = event.target.value;
        } else {
            return;
        }
        saveReaderSettings();
        applyReaderSettings();
    });
}
