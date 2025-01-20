// State and data globals are declared at the top of the script.js file.
let appState = {
        currentQuote: null,
        currentAuthor: null,
        currentWork: null,
        currentView: 'quote'
    };

let appData = {
};

document.addEventListener('DOMContentLoaded', function() {
    fetch('data-meta.json')
    .then(response => response.json())
        .then(metaData => {
            appData = metaData;
            console.log('Fetched metadata:', metaData);
            // load quotes and display a random quote
            loadQuotes();
        })
        .catch(error => {
            console.error('Error initializing app data:', error);
        });
});

function loadQuotes() {
    fetch(appData.quotes.allQuotesUri)
        .then(response => response.json())
        .then(quotesData => {
            appData.quotes.allQuotes = quotesData;
            console.log('Fetched quotes:', quotesData);
            showNewQuote('random');
        })
        .catch(error => {
            console.error('Error loading quotes:', error);
        });
}

function showNewQuote(selectionMethod) {
    if (!appData.quotes.allQuotes) {
        console.error('Ummm... ¯\_(ツ)_/¯ No quote data available!');
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
        { id: 'workLink', handler: () => showWork(myWork) },
        { id: 'chapterLink', handler: () => showChapter(myWork, myQuote) },
        { id: 'verseLink', handler: () => showVerse(myWork, myQuote) }
    ];

    links.forEach(link => {
        document.getElementById(link.id).addEventListener('click', link.handler);
    });

    // update app state
    appState.currentQuote = myQuote;
    appState.currentAuthor = myAuthor;
    appState.currentWork = myWork;
    appState.currentView = 'quote';

    console.log(`New quote: "${myQuote.quote}" ~${myAuthor.name}, ${myWork.title}, Book ${myQuote.chapter}, Verse ${myQuote.verse}`);
}

function dismissMenu() {
  document.getElementById("toggle-menu").checked = false;
  document.querySelectorAll('#menu input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
}

function showBiography(myAuthor) {    
    if (!myAuthor.bio) {
        console.error('No author biography data available!');
        myAuthor.bio = 'ERROR LOADING BIO. ¯\\_(ツ)_/¯';
    }
    document.getElementById('modal-title').innerHTML = myAuthor.name;
    document.getElementById('modal-body').innerHTML = 
    `<img id="modal-image" src="${myAuthor.imgUri}" alt="${myAuthor.name} Image" />
    <p id="modal-text" >${myAuthor.bio}</p>`;
}

function showWork(workId) {
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
    return;
}
