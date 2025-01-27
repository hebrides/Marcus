$(document).ready( function() {
                  
      updateDay ();

      function updateDay () {
            var quotation = document.getElementById('quotation');
            var citation = document.getElementById('citation');
            quoteOfTheDay = getQuoteOfTheDay();
            quotation.innerHTML = quoteOfTheDay.quote;
            citation.innerHTML = "Book " + quoteOfTheDay.book + ", Verse " + quoteOfTheDay.verse;
      }

      function getQuoteOfTheDay(selectionMethod) {
            var quotesArray = loadJSON("meditations-quotes.json");

            // Rotate through quotes by day, default behavior
            var now = new Date();
            // Index is number of days since 1/1/1970 % number of quotes
            var quoteIndex = ( Math.ceil(now.getTime() / (1000 * 3600 * 24)) % quotesArray.length);

            // Or get random
            if (selectionMethod == 'random') {
                  quoteIndex = Math.floor( Math.random() * quotesArray.length );
            }

            return quotesArray[quoteIndex];
      }

      function getDayOfCurrentYear() {
            var now = new Date();
            var start = new Date(now.getFullYear(), 0, 0);
            var diff = now - start;
            var oneDay = 1000 * 60 * 60 * 24;
            var dayOfYear = Math.floor(diff / oneDay);
            return dayOfYear;
      }

      // Load local JSON to Array
      function loadJSON(file) {
            $.ajaxSetup({'async': false}); // Want to make sure we get all the quotes
            var objects = [];
            $.getJSON(file, function(json) {
                  $.each(json, function( key, val ) {
                        objects.push( val );
                  });

            });
            return objects;
      }

});

/* Remote?
 var xobj = new XMLHttpRequest();
 xobj.overrideMimeType("application/json");
 xobj.open('GET', 'verses-english-classic.json', true);
 xobj.onreadystatechange = function () {
 if (xobj.readyState == 4 && xobj.status == "200") {
 // Required use of an anonymous callback as .open will NOT return a value but simply returns undefined in asynchronous mode
 callback(xobj.responseText);
 }
 };
 xobj.send(null); */


