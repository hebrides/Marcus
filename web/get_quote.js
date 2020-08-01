// Reads JSON quote data then returns a unique quote for the day, 
// cycling through all quotes before repeating (optional) or using a random quote (default)
// TODO: Add read of Google Sheets data
// TODO: Log data to logfile as well as console
// TODO: Add metadata logfile : Timestamp / IP Address

var fs = require('fs');
try {
    var data = fs.readFileSync(__dirname+"/meditations-quotes.json", "utf8");    
} catch(e) {
    console.log("Error: ", e.stack);
}

var quotesArray = JSON.parse(data);
var quoteOfTheDay = getQuoteOfTheDay(quotesArray, process.argv[2]);
console.log(quoteOfTheDay.quote);
console.log(quoteOfTheDay.chapter);
console.log(quoteOfTheDay.verse);

function getQuoteOfTheDay(quotesArray, selectionMethod) {
    if (selectionMethod === "rotated") {
        // Rotate through quotes by day
        var now = new Date();
        // quoteIndex is number of days since 1/1/1970 % number of quotes
        var quoteIndex = (Math.ceil(now.getTime() / (1000 * 3600 * 24)) % quotesArray.length);
    } else {
        // Get random, default behavior
        var quoteIndex = Math.floor(Math.random() * quotesArray.length);
    }
    return quotesArray[quoteIndex];
}

// Not used
function getDayOfCurrentYear() {
    var today = new Date();
    return Math.ceil((today - new Date(today.getFullYear(),0,1)) / 86400000);
}
