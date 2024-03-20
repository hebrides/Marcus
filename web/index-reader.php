<?php

// Quote of the Day Generator For Marcus Aurelius Page

exec("cd ". getcwd(). " && /usr/local/bin/node get_quote.js rotated 2>&1", $output, $error);
if ($error){ echo $error;}
else {
  $quote = $output[0];
  $author = "Marcus Aurelius";  
  $title = "Meditations";
  $chapter = $output[1];
  $verse = $output[2];
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Stoic Reader | Read The Stoics, Donate to Veterans</title>
</head>
<style>

@import url('https://fonts.googleapis.com/css2?family=Josefin+Sans:wght@400;700&family=Sorts+Mill+Goudy:ital@0;1&display=swap');

* {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
}

a {
 text-decoration: none;
 color: #D9D9D9;
}
a:hover { color:white; text-decoration: underline;}

body, html {
    height: 100%;
    background-color: #112233;
    font-family: 'Sorts Mill Goudy', serif;
    color: #D9D9D9;
}

/* Ensures the main content is flexibly sized */
body {
    display: flex;
    flex-direction: column;
}

header, footer {
    height: 61px;
    padding:22px 20px 20px 18px;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
    letter-spacing: 0.05em;
}

footer {
  padding-top: 30px;
  font-size: 14px;
}

nav, button {
 cursor: pointer;
}

main {
    height: calc(100% - 122px); /* 100% minus two times the header/footer height */
    width: 100%;
    background: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.4)), url('/bg.jpg') no-repeat center center / cover fixed;
    /* Can also use blend mode: https://css-tricks.com/almanac/properties/b/background-blend-mode/ */
    overflow: auto; /* Adds scroll to the main content if needed */
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
}

#selection {
    text-align: center;
    padding: 20px;
    max-width: 80%;
    letter-spacing: .03em;
}
#quote {
    font-size: calc(2.1vw + 2.1vh + 10%);
}
#citation {
  font-size: calc(1.4vw + 1.4vh);
  padding-top: 3%;
}


#menu-open-button {
  font-family: 'Josefin Sans', sans-serif;
  font-size: 16px;
  height: 38px;
  color: #D9D9D9;
  letter-spacing: 0.05em;
  border: 2px solid #D9D9D9;
  padding: 11px 18px;
  border-radius: 50px;
  background: #112233;
}

#menu-open-button:hover {
 color: white;
 border-color: white;
}

#copyright {
  text-align: right;
}

</style>


<body>
    <header>
	<img id="logo" src="/logo.svg" alt="The Stoic Reader" />
	<nav id="menu">
            <button id="menu-open-button">OPEN BOOK</button>
        </nav>
    </header>
    <main>
          <div id="selection">
            <p id="quote">“<?php echo $quote;?>”</p>
             <p id="citation">
             ~<?php echo $author.", ".$title.", Book ".$chapter.", Verse ".$verse; ?>
             </p>
          </div>

</main>
<footer>
<div id="data-protection"><a href="/data-protection-policy">Data Protection Policy</a></div>
    <div id="copyright">Copyright © <?php echo date("Y"); ?> <a href="#">The Aurelius Fund</a> | All Rights Reserved</div>
</footer>

 <script>
/*
$(document).ready( 
function() {
                  
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

</script>
</body>
<!--



                                ,~~' `+sl*+;~~`
                             ,_m@@@QuR@@@@@@@@@&p}r`
                          `)8RzpwQQ@RFDX~yQQq@Q%GOQVl=^;-
                     `^3Ud;`,|\;hFvU{Kc. rjQ@QQyL\0QQwK@Q'
                    `|r=XRt)Zl`   \QDDp%0m&g*,,`~F^LjgdQ@l~c+`
                  '\'   =~}|~4ja3,*i^ 'i})gu|$Q}$%pQBQUZ\'=QQj
                  :?+``;+;;~.   X$*      `  ->,-~.,~'`+. `'o*J^
                 ;lgwzOQ&FL``~;F$B$^;:`             `  `   ;~ j'
                     ,,~```^slJz~.  .         .;;`  --^l,  :`  `
                `^iL>w1~` '*' `           ,,~~u@@g>yBQ@@@r.
                  ,i~~-r>>`            `=q@@@@@@@@Q%p{Q@Q+   y)
                   ` .Fy'             ;D@@@@@QBQ@@@@@Q$D8d+  ~'
                  ;K~~^`           `18@W{|;~'` `:~,cO, ,,`;' `
                  -``             ~dR*'   riL;     -~   '~
                  '             .*D@t`    ` ``    ,D%'  ``
                                l@@@@QD$1,   .`'iO@@@%'  ?~
                     '~     `~  ;Q@@@@@@@@$)FXQ@@@@@@@N,>Q^
                    ~`:,.   ',,i%QQp{>-'~t@@@@hrXQ@@@@@Q;`
                   ~'     ';iQABUi\ `.:?Q@@@G|z+^~' .:roD''
                           `;,.``. ;Q@@@@@U)P@@@QA~`  {8;|~
                           ,^`,-~Gj,=G@@@@@@@@R}x~    .1dX`
                         yQ? '%DV;|Q@Q@&XQ@gL,          ;L`
                         t@@}*~  `'F8dt`,;,`            .-
                       '^ |&QH'    ;3j-rt'*ta}?^:`:ikBRUX`
                     `SOS  ';~        .jj=>s%QQ@@@Qq}xq3+
                  ,+FQQNQi`.'      `.' ` `. ,^yKF^' >BQc`
              '~|DQ%30@R@@+>;     `,.' -'   .'++,   ``;~
         `,lU&QUXRQp8Uj%RQX-   -~,``   .,-`~OpwL~, `;;:}l^''1jl^
  `'~=FUD$%Q@@@@@@@@@@p~LzQ+               `,'` ``  `;;~Lhl=@@@@Bh;
RQ08$kb@@@@QQ@@@@@@@@@@Qls?rx'                   `*.iQ@Q3'  ,v&RRZ;  `
D@@@@@B{VQ@@@@QQ@@@@@@@@@QW*~GP=                  3j~K@@@$`   -jRNL^,,,'
=^+r;FO@K|N@@@@Q@@@@@@@@@@@Q~'0@8t:               lA{;&@@@8)y~*' ,;,~|Ca)'
'mB0SQ@@@Q>Q@@@@@@P4O@@QXQ@@QL'>UBQF`            t@@Q$L@@@@;Dl~&~10@B3r',;~-
-. ,l^+J3Qgu@@@@@@@Q%@@@@@@@@@N~;-`';)?LwL       |Q@@Qca@@@^L@~O$`;%@@@8F~ ',`
}?`'8QHmoQ@zO@@@@Q@@@@@@@@@@@@@Q@QJ-?3` ,P      ~;,Q@@8;Q@@z~Q}-FU*^l>H@@@h,
Rjw*xBQ@@@@bu@@@@@@@@@@@@@@@@@@Q@@@@@&|~`,-~~i;l@Q+j@@@tP@@P`%@Bj@Qi|&;?&@@p  .
*pQ1,|j3a%@QL@@@@@@@@@@@@@@@@@@BQ@&gW0NgkVRN&@Q&Q@@Q@Q0W8@@Q'?@@UQ@@Q@Q:`,io '`
 |j;  .`-.1Q+Q@@@@@@@@@@@@@@@@NW&g0%bUPpDRNWORWQ&BQQDpXO8&N&~`K@)`w@Pm@B,`xRx``:r
 =0A,iQjRQLVv@@@@0b@@@@@@@@@@@@@@@@@@QQQQQDgQBQQRQwt=vllc3ZA^ ~@Q,*@0-u@8''$@+  ;`


            "Be full and without a want of any kind,

                longing for nothing more, nor desiring anything."


                                 --Chapter X, Verse I.




        “Every man always has handy a dozen glib little reasons

               why he is right not to sacrifice himself."


                  ―-Aleksandr Solzhenitsyn, The Gulag Archipelago




!-->

</html>
