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
        bookmarks: [],
        readerViews: new Map(),
        renderedWorkId: null,
        readerChunks: new Map(),
        readerAnchorGeneration: 0,
        readerAnchorWritesBlocked: false,
        readerLayoutGeneration: 0,
        isResetting: false,
        readerStateEpoch: null
    };

// Stores app data in memory for quick access
let appData = {
};

function getCuration() {
    return appData.curation || {};
}

function releaseReaderAnchorWrites() {
    window.setTimeout(() => {
        appState.readerAnchorWritesBlocked = false;
    }, 500);
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
const READER_STATE_VERSION = 2;
const READER_STATE_EPOCH_KEY = 'stoic-reader-state-epoch';
const READER_SETTINGS_KEY = 'stoic-reader-settings';
const BOOKMARKS_KEY = 'stoic-reader-bookmarks';
const STARTUP_QUOTE_KEY = 'stoic-reader-startup-quote';
const RESET_APP_QUERY_KEY = 'reset-app';
const MINIMUM_LOADING_TIME = 350;
const DEFAULT_READER_SETTINGS = {
    theme: 'night',
    largeText: false,
    font: 'goudy',
    spacing: 'normal'
};

function createReaderStateEpoch() {
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

function initializeReaderStateEpoch() {
    const savedEpoch = localStorage.getItem(READER_STATE_EPOCH_KEY);
    appState.readerStateEpoch = savedEpoch || createReaderStateEpoch();
    if (!savedEpoch) localStorage.setItem(READER_STATE_EPOCH_KEY, appState.readerStateEpoch);
}

function rotateReaderStateEpoch() {
    const epoch = createReaderStateEpoch();
    localStorage.setItem(READER_STATE_EPOCH_KEY, epoch);
    appState.readerStateEpoch = epoch;
}

function clearStateAfterResetNavigation() {
    const url = new URL(window.location.href);
    if (!url.searchParams.has(RESET_APP_QUERY_KEY)) return;

    localStorage.removeItem(READER_STATE_KEY);
    localStorage.removeItem(READER_SETTINGS_KEY);
    localStorage.removeItem(BOOKMARKS_KEY);
    localStorage.removeItem(STARTUP_QUOTE_KEY);
    url.searchParams.delete(RESET_APP_QUERY_KEY);
    window.history.replaceState({}, '', url.toString());
}

clearStateAfterResetNavigation();
initializeReaderStateEpoch();

document.addEventListener('DOMContentLoaded', function() {
    document.getElementById('copyright-year').textContent = new Date().getFullYear();
    restoreReaderSettings();
    restoreBookmarks();
    restoreStartupQuote();
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

function restoreStartupQuote() {
    try {
        const saved = JSON.parse(localStorage.getItem(STARTUP_QUOTE_KEY));
        if (!saved?.quote || !saved?.citation) return;
        document.getElementById('quote').textContent = saved.quote;
        document.getElementById('citation').textContent = saved.citation;
    } catch (error) {
        console.warn('Unable to restore startup quote:', error);
    }
}

function saveStartupQuote(quote, citation) {
    localStorage.setItem(STARTUP_QUOTE_KEY, JSON.stringify({ quote, citation }));
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
    fullscreen.hidden = !isReader;
    bookmark.hidden = !isReader;
    document.getElementById('reader-page-previous').hidden = !isReader;
    document.getElementById('reader-page-next').hidden = !isReader;
    document.getElementById('reader-progress').style.display = isReader ? 'block' : 'none';
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
    <a href="#" id="workLink" onclick="openWork('${myWork.id}', '1')"><label for="modal-toggle">${myWork.title}</label></a>`;

    // get quote location for citation
    const myQuoteLocation = myQuote.location.split(".");
    
    // Compute and display citation chain
    let cumulativeLocation = '';
    for (let i = 0; i < myQuoteLocation.length; i++) {
        cumulativeLocation += (i > 0 ? '.' : '') + myQuoteLocation[i];
        citationHTML += `, <a href="#" id="loc${i}Link" onclick="openWork('${myWork.id}', '${cumulativeLocation}')"><label for="modal-toggle">${myWork.locationSyntax[i]} ${myQuoteLocation[i]}</label></a>`;
    }   
    document.getElementById('citation').innerHTML = citationHTML;
    saveStartupQuote(myQuote.quote, `${myAuthor.name}, ${myWork.title}, ${myQuote.location}`);
    
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

        if (tierLabel) {
            const tierLi = document.createElement('li');
            tierLi.className = 'menu-tier-header';
            tierLi.textContent = tierLabel;
            fragment.appendChild(tierLi);
        }

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

    appendTier('core');
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
    if (appState.isResetting ||
        localStorage.getItem(READER_STATE_EPOCH_KEY) !== appState.readerStateEpoch) return;
    localStorage.setItem(READER_STATE_KEY, JSON.stringify({
        version: READER_STATE_VERSION,
        openBooks: appState.openBooks,
        lastLocations: appState.lastLocations
    }));
}

function restoreReaderState() {
    try {
        const saved = JSON.parse(localStorage.getItem(READER_STATE_KEY));
        if (saved?.version !== READER_STATE_VERSION) {
            localStorage.removeItem(READER_STATE_KEY);
            appState.openBooks = [];
            appState.lastLocations = {};
            renderBookTabs();
            return;
        }
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
    tabs.dataset.tabCount = count;
    const gapWidth = Math.max(0, count - 1) * 3;
    const cap = count === 1 ? 480 : count === 2 ? 340 : count === 3 ? 250 : 190;
    tabs.style.setProperty(
        '--book-tab-max-width',
        `min(calc((100% - ${gapWidth}px) / ${Math.max(count, 1)}), ${cap}px)`
    );
    tabs.innerHTML = '';

    appState.openBooks.forEach(book => {
        const work = appData.works.find(item => item.id === book.workId);
        if (!work) return;
        const tab = document.createElement('div');
        tab.className = `book-tab${book.error ? ' has-error' : ''}${book.workId === appState.activeBookId ? ' is-active' : ''}`;
        const openButton = document.createElement('button');
        openButton.type = 'button';
        openButton.className = 'book-tab-open';
        openButton.title = book.error ? `${work.title}: failed to load; click to retry.` : work.title;
        openButton.textContent = `${work.title} - ${formatBookLocation(work, book.location)}`;
        openButton.addEventListener('click', () => openWork(work.id, book.location));
        const closeButton = document.createElement('button');
        closeButton.type = 'button';
        closeButton.className = 'book-tab-close';
        closeButton.setAttribute('aria-label', `Close ${work.title} tab`);
        closeButton.textContent = '×';
        closeButton.addEventListener('click', () => closeBookTab(work.id));
        tab.append(openButton, closeButton);
        tabs.appendChild(tab);
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
        clearReaderPassageHighlight(appState.activeBookId);
        const book = getBookTab(appState.activeBookId);
        if (book) {
            book.minimized = true;
            book.fullscreen = document.getElementById('modal-content').classList.contains('fullscreen');
        }
        saveReaderState();
        renderBookTabs();
    }
    document.getElementById('modal-toggle').checked = false;
}

function closeBookTab(workId) {
    clearReaderPassageHighlight(workId);
    appState.openBooks = appState.openBooks.filter(book => book.workId !== workId);
    if (appState.activeBookId === workId) appState.activeBookId = null;
    discardReaderView(workId);
    saveReaderState();
    renderBookTabs();
}

function stashRenderedReaderView() {
    const workId = appState.renderedWorkId;
    const view = modalBody.querySelector('.reader-viewport');
    if (workId && view) {
        view.remove();
        appState.readerViews.set(workId, view);
    }
    appState.renderedWorkId = null;
}

function discardReaderView(workId) {
    const cachedView = appState.readerViews.get(workId);
    if (cachedView) cachedView.remove();
    appState.readerViews.delete(workId);
    appState.readerChunks.delete(workId);
    if (appState.renderedWorkId === workId) {
        modalBody.innerHTML = '';
        appState.renderedWorkId = null;
    }
}

function splitReaderContentIntoChunks(partitions) {
    const maxChunkLength = 16000;
    const blocks = partitions
        .flatMap(partition => {
            const matchedBlocks = partition.match(/<(?:h[1-6]|p|blockquote|li)\b[\s\S]*?<\/(?:h[1-6]|p|blockquote|li)>/gi);
            return matchedBlocks && matchedBlocks.length > 0 ? matchedBlocks : [partition];
        });
    const chunks = [];
    let chunk = '';

    blocks.forEach(block => {
        if (chunk && chunk.length + block.length > maxChunkLength) {
            chunks.push(chunk);
            chunk = '';
        }
        chunk += block;
    });
    if (chunk) chunks.push(chunk);
    return chunks;
}

function getReaderChunkIndex(chunks, location) {
    const escapedLocation = String(location).replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const locationPattern = new RegExp(`\\bid=(["'])${escapedLocation}\\1`);
    const index = chunks.findIndex(chunk => locationPattern.test(chunk));
    return index === -1 ? 0 : index;
}

function getReaderAnchors(partitions) {
    const anchors = [];
    const anchorPattern = /\bid=(["'])(.*?)\1/g;
    partitions.forEach(partition => {
        let match;
        while ((match = anchorPattern.exec(partition))) {
            anchors.push(match[2]);
        }
    });
    return anchors;
}

function getReaderTimeline(partitions, timeline) {
    const ids = timeline?.ids;
    const wordOffsets = timeline?.wordOffsets;
    const totalWords = timeline?.totalWords;
    if (Array.isArray(ids) &&
        Array.isArray(wordOffsets) &&
        ids.length === wordOffsets.length &&
        ids.length > 0 &&
        Number.isFinite(totalWords) &&
        totalWords > 0) {
        return {
            ids,
            wordOffsets,
            totalWords,
            indexById: new Map(ids.map((id, index) => [id, index]))
        };
    }

    const legacyIds = getReaderAnchors(partitions);
    return {
        ids: legacyIds,
        wordOffsets: null,
        totalWords: 0,
        indexById: new Map(legacyIds.map((id, index) => [id, index]))
    };
}

function appendNextReaderChunk(workId = appState.renderedWorkId) {
    const readerData = appState.readerChunks.get(workId);
    const flow = modalBody.querySelector('.reader-flow');
    if (!readerData || !flow || readerData.nextChunkIndex >= readerData.chunks.length) return false;

    flow.insertAdjacentHTML('beforeend', readerData.chunks[readerData.nextChunkIndex]);
    readerData.nextChunkIndex += 1;
    updateReaderProgress();
    return true;
}

function prependPreviousReaderChunk(workId = appState.renderedWorkId) {
    const readerData = appState.readerChunks.get(workId);
    const flow = modalBody.querySelector('.reader-flow');
    const viewport = modalBody.querySelector('.reader-viewport');
    if (!readerData || !flow || readerData.previousChunkIndex < 0) return false;

    const previousHeight = viewport?.scrollHeight || 0;
    flow.insertAdjacentHTML('afterbegin', readerData.chunks[readerData.previousChunkIndex]);
    readerData.previousChunkIndex -= 1;
    if (viewport && !document.getElementById('modal-content').classList.contains('fullscreen')) {
        viewport.scrollTop += viewport.scrollHeight - previousHeight;
    }
    updateReaderProgress();
    return true;
}

function ensureReaderLocationRendered(workId, location) {
    const readerData = appState.readerChunks.get(workId);
    if (!readerData) return false;

    const targetChunkIndex = getReaderChunkIndex(readerData.chunks, location);
    while (readerData.previousChunkIndex >= targetChunkIndex) {
        if (!prependPreviousReaderChunk(workId)) return false;
    }
    while (readerData.nextChunkIndex <= targetChunkIndex) {
        if (!appendNextReaderChunk(workId)) return false;
    }
    return true;
}

function restoreReaderView(workId, location, highlightPassage) {
    const view = appState.readerViews.get(workId) ||
        (appState.renderedWorkId === workId ? modalBody.querySelector('.reader-viewport') : null);
    if (!view) return false;

    if (view.parentElement !== modalBody) modalBody.replaceChildren(view);
    modalBody.classList.remove('settings-mode');
    modalBody.classList.add('is-visible');
    modalLoading.style.display = 'none';
    appState.renderedWorkId = workId;
    appState.readerAnchorLocation = String(location);
    modalBody.dataset.readerLocation = String(location);
    appState.readerLayoutReady = false;
    setReaderControlsReady(false);

    requestAnimationFrame(() => {
        ensureReaderLocationRendered(workId, location);
        const target = modalBody.querySelector(`[id="${CSS.escape(String(location))}"]`);
        layoutReaderSpread(target, () => {
            attachReaderSpreadInteractions();
            appState.readerLayoutReady = true;
            setReaderControlsReady(true);
            releaseReaderAnchorWrites();
        });
        if (target && highlightPassage) highlightReaderPassage(target);
    });
    return true;
}

function highlightReaderPassage(target) {
    clearReaderPassageHighlight(appState.currentWork?.id);
    target.classList.add('passage-highlight');
    target.style.setProperty('background-color', 'rgba(0, 0, 0, .22)', 'important');
}

function clearReaderPassageHighlight(workId) {
    const view = appState.readerViews.get(workId) ||
        (appState.renderedWorkId === workId ? modalBody.querySelector('.reader-viewport') : null);
    if (!view) return;
    view.querySelectorAll('.passage-highlight').forEach(target => {
        target.classList.remove('passage-highlight');
        target.style.removeProperty('background-color');
    });
}

function openWork(workId, location, highlightPassage = false) {
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
            fullscreen: false,
            error: false
        };
        appState.openBooks.push(book);
    } else {
        book.minimized = false;
        if (location) book.location = String(location);
    }
    document.getElementById('modal-content').classList.toggle('fullscreen', !!book.fullscreen);
    saveReaderState();
    renderBookTabs();
    // Ensure the modal is visible regardless of how this function was called
    document.getElementById('modal-toggle').checked = true;
    // Quote and citation labels toggle the checkbox after their click handlers run.
    // Reassert the reader state after that default action completes.
    window.setTimeout(() => {
        if (appState.currentWork?.id !== workId) return;
        document.getElementById('modal-toggle').checked = true;
        appState.currentView = 'work';
        const activeBook = getBookTab(workId);
        if (activeBook) {
            activeBook.minimized = false;
            saveReaderState();
            renderBookTabs();
        }
    }, 0);
    showWork(location || book.location || appState.lastLocations[workId] || '1', highlightPassage);
}

function suppressReaderProgressTransition() {
    document.getElementById('modal-content').classList.add('reader-progress-instant');
}

function resumeReaderProgressTransition() {
    window.requestAnimationFrame(() => {
        document.getElementById('modal-content').classList.remove('reader-progress-instant');
    });
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

function showModalContent(content, startedAt, onRendered, renderToken) {
    const wait = Math.max(0, MINIMUM_LOADING_TIME - (Date.now() - startedAt));
    window.setTimeout(() => {
        if (renderToken && renderToken !== appState.readerRenderToken) return;
        modalBody.innerHTML = content;
        requestAnimationFrame(() => {
            modalBody.classList.add('is-visible');
            requestAnimationFrame(() => {
                if (onRendered) {
                    onRendered();
                } else {
                    modalLoading.style.display = 'none';
                }
            });
        });
    }, wait);
}

// Display the current work as discrete, snapped pages around the requested location.
function showWork(location = '1', highlightPassage = false) {
    suppressReaderProgressTransition();
    const renderToken = (appState.readerRenderToken || 0) + 1;
    appState.readerRenderToken = renderToken;
    appState.readerAnchorGeneration += 1;
    appState.readerAnchorWritesBlocked = true;
    appState.currentView = 'work';
    setReaderModalControls('reader');
    console.log('Current view:', appState.currentView);
    console.log(`Showing work ${appState.currentWork.title}, at location ${location}`);

    modalTitle.innerHTML = appState.currentWork.title;
    const workId = appState.currentWork.id;
    const readerData = appState.readerChunks.get(workId);
    if (readerData?.progressAnimationFrame) {
        window.cancelAnimationFrame(readerData.progressAnimationFrame);
    }
    if (readerData) delete readerData.visualProgressRatio;
    if (appState.renderedWorkId && appState.renderedWorkId !== workId) {
        stashRenderedReaderView();
    }
    if (restoreReaderView(workId, location, highlightPassage)) {
        rememberBookLocation(workId, String(location));
        updateBookmarkControl();
        return;
    }

    const loadingStartedAt = beginModalLoading();
    appState.readerLayoutReady = false;
    setReaderControlsReady(false);

    const loc = String(location);

    getWorkData(appState.currentWork)
        .then(data => {
            if (renderToken !== appState.readerRenderToken) return;
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
            appState.readerPartitionIndex = partitionIndex;
            const chunks = splitReaderContentIntoChunks(partitions);
            const targetChunkIndex = getReaderChunkIndex(chunks, loc);
            const firstChunkIndex = Math.max(0, targetChunkIndex - 1);
            const nextChunkIndex = Math.min(chunks.length, firstChunkIndex + 3);
            appState.readerChunks.set(workId, {
                chunks,
                previousChunkIndex: firstChunkIndex - 1,
                nextChunkIndex,
                timeline: getReaderTimeline(partitions, data[2])
            });
            const content = chunks.slice(firstChunkIndex, nextChunkIndex).join('');

            showModalContent(
                `<div class="reader-viewport"><div class="reader-spread-clip"><article class="reader-flow">${content}</article></div></div>`,
                loadingStartedAt,
                () => {
                    if (renderToken !== appState.readerRenderToken) return;
                    const target = modalBody.querySelector(`[id="${CSS.escape(loc)}"]`);
                    const isCurrentRender = () =>
                        renderToken === appState.readerRenderToken &&
                        appState.currentWork?.id === workId;
                    layoutReaderSpread(target, () => {
                        if (!isCurrentRender()) return;
                        attachReaderSpreadInteractions();
                        appState.renderedWorkId = workId;
                        appState.readerLayoutReady = true;
                        setReaderControlsReady(true);
                        modalLoading.style.display = 'none';
                        releaseReaderAnchorWrites();
                    }, isCurrentRender);
                    if (target && highlightPassage) highlightReaderPassage(target);
                    rememberBookLocation(appState.currentWork.id, loc);
                    updateBookmarkControl();
                },
                renderToken
            );
            modalBody.dataset.readerLocation = loc;
            appState.readerAnchorLocation = loc;
        })
        .catch(err => {
            if (renderToken !== appState.readerRenderToken) return;
            resumeReaderProgressTransition();
            const workId = appState.currentWork.id;
            const message = `Unable to load "${appState.currentWork.title}".`;
            console.error(message, err);
            setBookLoadError(workId, true);
            showModalContent(
                `<div class="reader-error" role="alert"><p>${message}</p><button type="button" id="retry-work-load">Try again</button></div>`,
                loadingStartedAt,
                undefined,
                renderToken
            );
            window.setTimeout(() => {
                const retry = document.getElementById('retry-work-load');
                if (retry) retry.addEventListener('click', () => showWork(loc, highlightPassage));
            }, MINIMUM_LOADING_TIME);
        });
}

function moveReaderPage(direction) {
    const content = document.getElementById('modal-content');
    if (appState.currentView !== 'work' ||
        !content.classList.contains('fullscreen') ||
        !appState.readerLayoutReady ||
        !Number.isFinite(appState.readerSpreadPitch)) return;
    const flow = modalBody.querySelector('.reader-flow');
    if (!flow) return;
    let maxSpread = Math.ceil((flow.scrollWidth - flow.clientWidth) / appState.readerSpreadPitch);
    const requestedSpread = appState.readerSpreadIndex + direction;
    if (direction > 0 && requestedSpread > maxSpread && appendNextReaderChunk()) {
        window.requestAnimationFrame(() => moveReaderPage(direction));
        return;
    }
    const nextSpread = Math.max(0, Math.min(maxSpread, appState.readerSpreadIndex + direction));
    if (nextSpread === appState.readerSpreadIndex) return;
    setReaderSpread(nextSpread, true);
}

function layoutReaderSpread(anchor, onReady, isCurrent = () => true) {
    const flow = modalBody.querySelector('.reader-flow');
    const fullscreen = document.getElementById('modal-content').classList.contains('fullscreen');
    const readerData = appState.readerChunks.get(appState.currentWork?.id);
    if (readerData?.progressAnimationFrame) {
        window.cancelAnimationFrame(readerData.progressAnimationFrame);
    }
    if (readerData) delete readerData.visualProgressRatio;
    if (!flow || !fullscreen) {
        if (anchor) anchor.scrollIntoView({ block: 'start', behavior: 'instant' });
        updateReaderProgress();
        if (isCurrent()) {
            if (onReady) onReady();
            resumeReaderProgressTransition();
        }
        return;
    }

    const gap = 20;
    const columnWidth = (flow.clientWidth - gap) / 2;
    flow.style.setProperty('--reader-column-width', `${columnWidth}px`);
    flow.scrollLeft = 0;

    const fontsReady = document.fonts
        ? Promise.race([
            document.fonts.ready,
            new Promise(resolve => window.setTimeout(resolve, 1500))
        ])
        : Promise.resolve();
    fontsReady.then(() => {
        if (!isCurrent()) return;
        while (flow.scrollWidth <= flow.clientWidth &&
            appendNextReaderChunk(appState.currentWork?.id)) {
            // Load only enough adjacent content to make the first page turn possible.
        }
        waitForStableReaderLayout(flow, () => {
            if (!isCurrent() || !flow.isConnected) return;
            appState.readerSpreadPitch = 2 * (columnWidth + gap);
            if (anchor) {
                anchor.scrollIntoView({ block: 'nearest', inline: 'nearest', behavior: 'instant' });
            }
            const flowBounds = flow.getBoundingClientRect();
            const targetColumnIndex = anchor
                ? Math.max(0, Math.floor(
                    (anchor.getBoundingClientRect().left - flowBounds.left + flow.scrollLeft) /
                    (columnWidth + gap)
                ))
                : Math.max(0, Math.floor(flow.scrollLeft / (columnWidth + gap)));
            // A deep link should begin in the left reading column, even when that
            // column is the second half of the surrounding source spread.
            setReaderSpread(targetColumnIndex / 2, false, flow);
            if (readerData) {
                const visualRatio = getFullscreenReaderProgressRatio(flow, readerData);
                if (Number.isFinite(visualRatio)) readerData.visualProgressRatio = visualRatio;
            }
            updateReaderProgress();
            if (onReady) onReady();
            resumeReaderProgressTransition();
        }, isCurrent);
    });
}

function waitForStableReaderLayout(flow, onStable, isCurrent = () => true) {
    let previousGeometry = '';
    let stableFrames = 0;
    let attempts = 0;
    let settled = false;
    const settle = () => {
        if (settled) return;
        settled = true;
        window.clearTimeout(fallback);
        onStable();
    };
    const fallback = window.setTimeout(() => {
        if (isCurrent() && flow.isConnected) settle();
    }, 2000);
    const measure = () => {
        if (!isCurrent() || !flow.isConnected) return;
        const geometry = `${flow.clientWidth}:${flow.clientHeight}:${flow.scrollWidth}`;
        stableFrames = geometry === previousGeometry ? stableFrames + 1 : 0;
        previousGeometry = geometry;
        attempts += 1;
        if (stableFrames >= 2 || attempts >= 60) {
            settle();
            return;
        }
        window.requestAnimationFrame(measure);
    };
    window.requestAnimationFrame(measure);
}

function setReaderControlsReady(ready) {
    document.getElementById('reader-page-previous').disabled = !ready;
    document.getElementById('reader-page-next').disabled = !ready;
}

function getReaderProgressAnchorPair(flow, timeline, focalY) {
    const positionedAnchors = Array.from(flow.querySelectorAll('[id]'))
        .map(element => {
            const index = timeline.indexById.get(element.id);
            return index === undefined ? null : {
                index,
                top: element.getBoundingClientRect().top
            };
        })
        .filter(Boolean)
        .sort((left, right) => left.top - right.top || left.index - right.index);
    let previous;
    let next;

    for (const anchor of positionedAnchors) {
        if (anchor.top <= focalY) {
            previous = anchor;
        } else if (previous && anchor.top > previous.top) {
            next = anchor;
            break;
        }
    }
    return previous && next ? { previous, next } : null;
}

function getReaderLeadingAnchor(flow, viewport) {
    const bounds = viewport?.getBoundingClientRect();
    if (!bounds) return null;
    const anchors = Array.from(flow.querySelectorAll('[id]'))
        .map(element => ({ element, bounds: element.getBoundingClientRect() }))
        .filter(({ bounds: anchorBounds }) =>
            anchorBounds.bottom > bounds.top && anchorBounds.top < bounds.bottom
        );
    const containingAnchor = anchors
        .filter(({ bounds: anchorBounds }) => anchorBounds.top <= bounds.top + 4)
        .sort((left, right) => right.bounds.top - left.bounds.top)[0];
    return containingAnchor?.element ||
        anchors.sort((left, right) => left.bounds.top - right.bounds.top)[0]?.element ||
        null;
}

function getFullscreenReaderProgressRatio(flow, readerData) {
    const { timeline } = readerData;
    if (!timeline?.wordOffsets || timeline.totalWords <= 0) return null;

    const maxScrollLeft = Math.max(0, flow.scrollWidth - flow.clientWidth);
    if (flow.scrollLeft <= 2) return 0;
    if (readerData.nextChunkIndex >= readerData.chunks.length &&
        flow.scrollLeft >= maxScrollLeft - 2) {
        return 1;
    }

    const focalX = flow.scrollLeft + flow.clientWidth / 2;
    const positionedAnchors = Array.from(flow.querySelectorAll('[id]'))
        .map(element => {
            const index = timeline.indexById.get(element.id);
            const rect = element.getClientRects()[0];
            return index === undefined || !rect ? null : {
                index,
                left: rect.left + flow.scrollLeft
            };
        })
        .filter(Boolean)
        .sort((left, right) => left.left - right.left || left.index - right.index);
    let previous;
    let next;

    for (const anchor of positionedAnchors) {
        if (anchor.left <= focalX) {
            previous = anchor;
        } else if (previous && anchor.left > previous.left) {
            next = anchor;
            break;
        }
    }
    if (!previous || !next) return null;

    const position = Math.min(1, Math.max(0, (focalX - previous.left) / (next.left - previous.left)));
    return (timeline.wordOffsets[previous.index] +
        position * (timeline.wordOffsets[next.index] - timeline.wordOffsets[previous.index])) /
        timeline.totalWords;
}

function updateReaderProgress(constrainToScrollDirection = false) {
    const progress = document.getElementById('reader-progress');
    const indicator = document.getElementById('reader-progress-indicator');
    const flow = modalBody.querySelector('.reader-flow');
    if (!progress || !indicator || !flow || appState.currentView !== 'work') return;

    const readerData = appState.readerChunks.get(appState.currentWork?.id);
    const timeline = readerData?.timeline;
    const anchors = timeline?.ids || [];
    const fullscreen = document.getElementById('modal-content').classList.contains('fullscreen');
    const viewport = modalBody.querySelector('.reader-viewport');
    const viewportBounds = viewport?.getBoundingClientRect();
    let currentAnchor = getBookTab(appState.currentWork?.id)?.location;
    if (!fullscreen && viewportBounds) {
        const focalElements = document.elementsFromPoint(
            viewportBounds.left + viewportBounds.width / 2,
            viewportBounds.top + viewportBounds.height / 2
        );
        const focalAnchor = focalElements
            .map(element => element.closest?.('[id]'))
            .find(element => element?.id && anchors.includes(element.id));
        if (focalAnchor) currentAnchor = focalAnchor.id;
    }
    const anchorIndex = timeline.indexById.get(currentAnchor) ?? -1;
    if (anchors.length === 0) return;

    let progressRatio = fullscreen && Number.isFinite(readerData?.visualProgressRatio)
        ? readerData.visualProgressRatio
        : anchorIndex === -1
        ? 0
        : timeline.wordOffsets
            ? timeline.wordOffsets[anchorIndex] / timeline.totalWords
            : anchorIndex / Math.max(1, anchors.length - 1);
    if (!fullscreen && viewport && viewportBounds && timeline.wordOffsets) {
        const remaining = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
        if (anchorIndex === 0 && viewport.scrollTop <= 50) {
            progressRatio = 0;
        } else if (remaining <= 2) {
            progressRatio = 1;
        } else {
            const focalY = viewportBounds.top + viewportBounds.height / 2;
            const pair = getReaderProgressAnchorPair(flow, timeline, focalY);
            if (pair) {
                const distance = pair.next.top - pair.previous.top;
                const position = Math.min(1, Math.max(0, (focalY - pair.previous.top) / distance));
                const start = timeline.wordOffsets[pair.previous.index];
                const end = timeline.wordOffsets[pair.next.index];
                progressRatio = (start + position * (end - start)) / timeline.totalWords;
            }
        }
    }
    progressRatio = Math.min(1, Math.max(0, progressRatio));
    if (constrainToScrollDirection && !fullscreen && Number.isFinite(readerData?.lastProgressRatio)) {
        if (readerData.scrollDirection === 'forward') {
            progressRatio = Math.max(progressRatio, readerData.lastProgressRatio);
        } else if (readerData.scrollDirection === 'backward') {
            progressRatio = Math.min(progressRatio, readerData.lastProgressRatio);
        }
    }
    if (readerData) readerData.lastProgressRatio = progressRatio;
    indicator.style.left = '0';
    indicator.style.width = `${progressRatio * 100}%`;
}

function settleReaderSpread(flow, targetLeft, workId, anchorGeneration) {
    const readerData = appState.readerChunks.get(workId);
    if (!readerData) return;
    if (readerData.progressAnimationFrame) {
        window.cancelAnimationFrame(readerData.progressAnimationFrame);
    }
    let stableFrames = 0;
    const tick = () => {
        if (anchorGeneration !== appState.readerAnchorGeneration ||
            appState.currentWork?.id !== workId ||
            flow !== modalBody.querySelector('.reader-flow')) {
            return;
        }
        const currentReaderData = appState.readerChunks.get(workId);
        if (!currentReaderData) return;
        const visualRatio = currentReaderData && getFullscreenReaderProgressRatio(flow, currentReaderData);
        if (Number.isFinite(visualRatio)) {
            currentReaderData.visualProgressRatio = visualRatio;
            updateReaderProgress();
        }
        stableFrames = Math.abs(flow.scrollLeft - targetLeft) <= 1 ? stableFrames + 1 : 0;
        if (stableFrames < 3) {
            currentReaderData.progressAnimationFrame = window.requestAnimationFrame(tick);
            return;
        }
        delete currentReaderData.progressAnimationFrame;
        rememberReaderAnchor(flow, workId);
    };
    readerData.progressAnimationFrame = window.requestAnimationFrame(tick);
}

function setReaderSpread(index, animate, flow = modalBody.querySelector('.reader-flow'), updateAnchor = animate) {
    if (!flow) return;
    appState.readerSpreadIndex = index;
    const left = index * appState.readerSpreadPitch;
    if (animate) {
        flow.scrollTo({ left, behavior: 'smooth' });
    } else {
        flow.scrollTo({ left, behavior: 'instant' });
    }
    if (updateAnchor) {
        const workId = appState.currentWork?.id;
        const anchorGeneration = appState.readerAnchorGeneration;
        if (animate) {
            settleReaderSpread(flow, left, workId, anchorGeneration);
        } else {
            const readerData = appState.readerChunks.get(workId);
            const visualRatio = readerData && getFullscreenReaderProgressRatio(flow, readerData);
            if (Number.isFinite(visualRatio)) readerData.visualProgressRatio = visualRatio;
            if (anchorGeneration === appState.readerAnchorGeneration) {
                rememberReaderAnchor(flow, workId);
            }
            updateReaderProgress();
        }
    }
}

function rememberReaderAnchor(flow = modalBody.querySelector('.reader-flow'), workId = appState.currentWork?.id) {
    if (!flow || flow !== modalBody.querySelector('.reader-flow') ||
        appState.currentWork?.id !== workId) return;

    const fullscreen = document.getElementById('modal-content').classList.contains('fullscreen');
    const viewport = fullscreen ? flow : modalBody.querySelector('.reader-viewport');
    const bounds = viewport?.getBoundingClientRect();
    if (!bounds) return;
    const focalXs = fullscreen ? [.25, .5, .75] : [.25, .5, .75];
    const focalYs = [.08, .18, .32];
    let focalAnchor;
    for (const x of focalXs) {
        for (const y of focalYs) {
            focalAnchor = document.elementsFromPoint(
                bounds.left + bounds.width * x,
                bounds.top + bounds.height * y
            ).map(element => element.closest?.('[id]')).find(element => element && flow.contains(element));
            if (focalAnchor) break;
        }
        if (focalAnchor) break;
    }
    if (!focalAnchor) {
        focalAnchor = Array.from(flow.querySelectorAll('[id]')).find(element => {
            const elementBounds = element.getBoundingClientRect();
            return elementBounds.right > bounds.left &&
                elementBounds.left < bounds.right &&
                elementBounds.bottom > bounds.top &&
                elementBounds.top < bounds.bottom;
        });
    }
    if (!focalAnchor) return;
    appState.readerAnchorLocation = focalAnchor.id;
    modalBody.dataset.readerLocation = focalAnchor.id;
    rememberBookLocation(workId, focalAnchor.id);
    updateReaderProgress();
}

function attachReaderSpreadInteractions() {
    const flow = modalBody.querySelector('.reader-flow');
    if (!flow || flow.dataset.spreadInteractions === 'true') return;
    flow.dataset.spreadInteractions = 'true';
    const workId = appState.currentWork?.id;

    let wheelDistance = 0;
    let wheelTimer;
    flow.addEventListener('wheel', event => {
        if (!document.getElementById('modal-content').classList.contains('fullscreen') ||
            Math.abs(event.deltaX) <= Math.abs(event.deltaY)) return;
        event.preventDefault();
        wheelDistance += event.deltaX;
        window.clearTimeout(wheelTimer);
        wheelTimer = window.setTimeout(() => { wheelDistance = 0; }, 160);
        if (Math.abs(wheelDistance) >= flow.clientWidth * .15) {
            moveReaderPage(wheelDistance > 0 ? 1 : -1);
            wheelDistance = 0;
        }
    }, { passive: false });

    let touchStart;
    flow.addEventListener('touchstart', event => {
        if (event.touches.length !== 1) return;
        const touch = event.touches[0];
        touchStart = { x: touch.clientX, y: touch.clientY };
    }, { passive: true });
    flow.addEventListener('touchend', event => {
        if (!touchStart) return;
        const touch = event.changedTouches[0];
        const horizontal = touch.clientX - touchStart.x;
        const vertical = touch.clientY - touchStart.y;
        touchStart = null;
        if (Math.abs(horizontal) < 50 || Math.abs(horizontal) <= Math.abs(vertical)) return;
        moveReaderPage(horizontal < 0 ? 1 : -1);
    }, { passive: true });

    flow.addEventListener('scroll', updateReaderProgress, { passive: true });

    const viewport = modalBody.querySelector('.reader-viewport');
    if (!viewport || viewport.dataset.readerLoading === 'true') return;
    viewport.dataset.readerLoading = 'true';
    let anchorTimer;
    let lastScrollTop = viewport.scrollTop;
    viewport.addEventListener('scroll', () => {
        if (document.getElementById('modal-content').classList.contains('fullscreen')) return;
        if (appState.readerAnchorWritesBlocked) {
            lastScrollTop = viewport.scrollTop;
            return;
        }
        const readerData = appState.readerChunks.get(workId);
        const scrollingUp = viewport.scrollTop < lastScrollTop;
        if (readerData && viewport.scrollTop !== lastScrollTop) {
            readerData.scrollDirection = scrollingUp ? 'backward' : 'forward';
        }
        if (scrollingUp && viewport.scrollTop < 500) prependPreviousReaderChunk(workId);
        lastScrollTop = viewport.scrollTop;
        const remaining = viewport.scrollHeight - viewport.scrollTop - viewport.clientHeight;
        if (remaining < 500) appendNextReaderChunk(workId);
        updateReaderProgress(true);
        window.clearTimeout(anchorTimer);
        anchorTimer = window.setTimeout(() => rememberReaderAnchor(flow, workId), 120);
    }, { passive: true });
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
    const starterPathList = (appData.starterPaths || []).length === 0
        ? '<p class="setting-note">No starter paths are available yet.</p>'
        : `<div class="starter-path-list">${appData.starterPaths.map((path, index) =>
            `<button type="button" class="starter-path-link" data-starter-path-index="${index}">${path.title}</button>`
        ).join('')}</div>`;

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
            <label class="setting-toggle">
                <span>Extended library</span>
                <input id="setting-extended-library" type="checkbox" ${appState.showExtendedLibrary ? 'checked' : ''} />
                <span class="setting-switch" aria-hidden="true"></span>
            </label>
            <p class="setting-note">Core Stoic Canon by default. Extended library is currently ${extendedLabel.toLowerCase()}.</p>
            <label class="setting-choice" for="setting-chat-scope">
                <span>Stoic chat scope</span>
                <select id="setting-chat-scope">
                    <option value="strict-stoic" ${appState.chatScope === 'strict-stoic' ? 'selected' : ''}>Strict Stoic</option>
                    <option value="broader-classical-ethics" ${appState.chatScope === 'broader-classical-ethics' ? 'selected' : ''}>Broader Classical Ethics</option>
                </select>
            </label>
            <p class="setting-note">Current scope: ${scopeLabel}.</p>
            <p><strong>Inclusion checks:</strong> Public-domain, clean structure, translation quality.</p>
            <h3>Starter paths</h3>
            <p class="setting-note">Choose a guided starting point without crowding the book menu.</p>
            ${starterPathList}
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

    appState.isResetting = true;
    rotateReaderStateEpoch();
    appState.readerRenderToken = (appState.readerRenderToken || 0) + 1;
    appState.openBooks = [];
    appState.lastLocations = {};
    appState.activeBookId = null;
    appState.readerViews.clear();
    appState.readerChunks.clear();
    appState.renderedWorkId = null;
    renderBookTabs();
    localStorage.removeItem(READER_STATE_KEY);
    localStorage.removeItem(READER_SETTINGS_KEY);
    localStorage.removeItem(BOOKMARKS_KEY);
    localStorage.removeItem(STARTUP_QUOTE_KEY);
    const reload = () => {
        const url = new URL(window.location.href);
        url.searchParams.set(RESET_APP_QUERY_KEY, '1');
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
                clearReaderPassageHighlight(appState.activeBookId);
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
        const content = document.getElementById('modal-content');
        if (!content.classList.contains('fullscreen')) {
            const flow = modalBody.querySelector('.reader-flow');
            const viewport = modalBody.querySelector('.reader-viewport');
            const leadingAnchor = flow && getReaderLeadingAnchor(flow, viewport);
            if (leadingAnchor && appState.activeBookId) {
                appState.readerAnchorLocation = leadingAnchor.id;
                modalBody.dataset.readerLocation = leadingAnchor.id;
            }
        }
        appState.readerAnchorGeneration += 1;
        const layoutGeneration = ++appState.readerLayoutGeneration;
        appState.readerAnchorWritesBlocked = true;
        content.classList.toggle('fullscreen');
        const activeBook = getBookTab(appState.activeBookId);
        if (activeBook) {
            activeBook.fullscreen = content.classList.contains('fullscreen');
            saveReaderState();
        }
        if (content.classList.contains('fullscreen')) {
            appState.readerLayoutReady = false;
            setReaderControlsReady(false);
            const renderToken = appState.readerRenderToken;
            const workId = appState.currentWork?.id;
            window.requestAnimationFrame(() => {
                const location = modalBody.dataset.readerLocation;
                layoutReaderSpread(
                    location && modalBody.querySelector(`[id="${CSS.escape(location)}"]`),
                    () => {
                        if (renderToken !== appState.readerRenderToken ||
                            appState.currentWork?.id !== workId ||
                            layoutGeneration !== appState.readerLayoutGeneration ||
                            !content.classList.contains('fullscreen')) return;
                        appState.readerLayoutReady = true;
                        setReaderControlsReady(true);
                        releaseReaderAnchorWrites();
                    },
                    () => renderToken === appState.readerRenderToken &&
                        appState.currentWork?.id === workId &&
                        layoutGeneration === appState.readerLayoutGeneration &&
                        content.classList.contains('fullscreen')
                );
            });
        } else {
            const location = modalBody.dataset.readerLocation;
            const anchor = location && modalBody.querySelector(`[id="${CSS.escape(location)}"]`);
            layoutReaderSpread(anchor, releaseReaderAnchorWrites);
        }
    });
    document.getElementById('modal-bookmark').addEventListener('click', toggleBookmark);
    document.getElementById('modal-close').addEventListener('click', minimizeBook);
    document.getElementById('reader-page-previous').addEventListener('click', () => moveReaderPage(-1));
    document.getElementById('reader-page-next').addEventListener('click', () => moveReaderPage(1));
    let readerResizeTimer;
    window.addEventListener('resize', () => {
        if (appState.currentView !== 'work' ||
            !document.getElementById('modal-content').classList.contains('fullscreen')) return;
        window.clearTimeout(readerResizeTimer);
        readerResizeTimer = window.setTimeout(() => {
            const renderToken = appState.readerRenderToken;
            const workId = appState.currentWork?.id;
            const anchor = appState.readerAnchorLocation &&
                modalBody.querySelector(`[id="${CSS.escape(appState.readerAnchorLocation)}"]`);
            layoutReaderSpread(anchor, undefined, () =>
                renderToken === appState.readerRenderToken &&
                appState.currentWork?.id === workId
            );
        }, 100);
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
            appState.readerViews.clear();
            appState.readerChunks.clear();
            appState.renderedWorkId = null;
            renderBookTabs();
            event.target.disabled = true;
            event.target.textContent = 'Saved reader state cleared';
        } else if (event.target.id === 'reset-app') {
            resetApp();
        } else if (event.target.classList.contains('starter-path-link')) {
            const path = appData.starterPaths?.[Number(event.target.dataset.starterPathIndex)];
            const firstWorkId = path?.workIds?.find(workId => {
                const work = appData.works.find(item => item.id === workId);
                return work && (appState.showExtendedLibrary || work.tier !== 'extended');
            });
            if (firstWorkId) openWork(firstWorkId);
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
        } else if (event.target.id === 'setting-extended-library') {
            toggleExtendedLibrary();
            showSettings();
            return;
        } else if (event.target.id === 'setting-chat-scope') {
            appState.chatScope = event.target.value;
            updateScopeLabels();
            showNewQuote('random');
            showSettings();
            return;
        } else {
            return;
        }
        saveReaderSettings();
        applyReaderSettings();
    });
}
