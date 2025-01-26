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

// Global modal vars
const modalLoading = document.getElementById('modal-data-loading');
const modalTitle = document.getElementById('modal-title');
const modalBody = document.getElementById('modal-body');

document.addEventListener('DOMContentLoaded', function() {  
    attachEventListeners();
      
    fetch('data-meta.json')
    .then(response => response.json())
        .then(metaData => {
            appData = metaData;
            console.log('Fetched metadata:', metaData);
            // check metadata for updates & load if necessary
            
            // TODO: if no updates, try indexDB

            // no indexDB data? load quotes, display a random quote, load data
            loadQuotes().then(() => {
                showNewQuote('random');
                loadApplicationData();
                //
                // TODO: Store new data in IndexDB
                //
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

    // Fetch current author bio
    fetch(currentAuthor.bioUri)
        .then(response => response.text())
        .then(bio => {
            currentAuthor.bio = bio;
            console.log('Loaded author bio:', bio);
        })
        .catch(error => {
            console.error('Error loading author bio:', error);
        });

    // Fetch current work text
    fetch(currentWork.textUri)
        .then(response => response.text())
        .then(workText => {
            currentWork.text = workText;
            console.log('Loaded work text:', workText);
            // Additional parsing can be done here if needed
        })
        .catch(error => {
            console.error('Error loading work text:', error);
        });
    
    // Load remaining author bios and work texts
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
            return fetch(work.textUri)
                .then(response => response.text())
                .then(workText => {
                    work.text = workText;
                    console.log(`Loaded work ${work.id} text:`, workText);
                })
                .catch(error => {
                    console.error(`Error loading work ${work.id} text:`, error);
                });
        });
}

function showNewQuote(selectionMethod) {
    if (!appData.quotes.allQuotes) {
        console.error('Ummm... ¯\_(ツ)_/¯ No quote data available!');
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

    // display quote, citation
    document.getElementById('quote').innerHTML =  // quote
        `<a href="#" id="quoteLink"><label for='modal-toggle'>${myQuote.quote}</label></a>`;
    
    document.getElementById('citation').innerHTML = // citation
        `~<a href="#" id="authorLink"><label for="modal-toggle">${myAuthor.name}</label></a>, 
        <a href="#" id="workLink"><label for="modal-toggle">${myWork.title}</a>, 
        <a href="#" id="chapterLink"><label for="modal-toggle">Book ${myQuote.chapter}</a>, 
        <a href="#" id="verseLink"><label for="modal-toggle">Verse ${myQuote.verse}</a>`;
    
    // link quote, citation data to click event listeners for modal update functions
    const links = [
        { id: 'quoteLink', handler: () => showQuoteInContext(myWork, myQuote) },
        { id: 'authorLink', handler: () => showBiography(myAuthor) },
        { id: 'workLink', handler: () => showWork(myWork.id) },
        { id: 'chapterLink', handler: () => showChapter(myWork, myQuote) },
        { id: 'verseLink', handler: () => showVerse(myWork, myQuote) }
    ];

    links.forEach(link => {
        document.getElementById(link.id).addEventListener('click', link.handler);
    });

    console.log(`New quote: "${myQuote.quote}" ~${myAuthor.name}, ${myWork.title}, Book ${myQuote.chapter}, Verse ${myQuote.verse}`);
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
        modalBody.innerHTML = 'ERROR LOADING BIO. ¯\\_(ツ)_/¯';
        return;
    }

    modalLoading.style.display = 'block';
    modalTitle.innerHTML = myAuthor.name;
    modalBody.innerHTML = 
    `<img id="modal-image" src="${myAuthor.imgUri}" alt="${myAuthor.name} Image" />
    <p id="modal-text" >${myAuthor.bio}</p>`;
    modalLoading.style.display = 'none';

}

function showWork(workId) {   
    appState.currentView = 'work';

    if (!workId) { console.error('No work ID provided!'); return;}

    console.log(`Showing work ${workId}`);

    console.log('Current view:', appState.currentView);

    const myWork = appData.works.find(work => work.id === workId);

    if (myWork) {
        appState.currentWork = myWork;
        appState.currentAuthor = appData.authors.find(author => author.id === myWork.authorId);

    } else {
        console.error('Work not found!');
        modalTitle.innerHTML = 'Error';
        modalBody.innerHTML = 'ERROR LOADING WORK. ¯\\_(ツ)_/¯';
        return;
    }

    // update modal title and display loading activity indicator    
    modalTitle.innerHTML = myWork.title;
    modalBody.innerHTML = '';
    modalLoading.style.display = 'block';

    // Load the work text asynchronously - hack necessary to make sure the 
    // modal displays instantly and the loading indicator is shown, otherwise
    // webkit will wait until all the text is ready to display before showing
    // the modal, which is weird, non-intuitive, and not user-friendly.   
    setTimeout(() => {
        if (!myWork.text) {
            console.error('No work text data available!');
            modalBody.innerHTML = 'ERROR LOADING WORK. ¯\\_(ツ)_/¯';
        } else {
            modalBody.innerHTML = `<p>${myWork.text}</p>`;
        }
        modalLoading.style.display = 'none';
    }, 100);
}

function showChapter(myWork,myQuote) {    
    return; 
}

function showVerse(myWork,myQuote) {    
    return; 
}

function showQuoteInContext(myWork,myQuote) {    
    return; 
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
