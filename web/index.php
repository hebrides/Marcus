<?php

// Quote of the Day Generator For Marcus Aurelius Page

exec("cd ". getcwd(). " && /usr/local/bin/node get_quote.js rotated 2>&1", $output, $error);
if ($error){ echo $error;}
else {
  $quote = $output[0];
  $book = $output[1];
  $verse = $output[2];
}
?>

<!DOCTYPE html>
<html lang="en">



<head>

  <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />

  <meta name="viewport" content="width=device-width, initial-scale=1.0" />



  <title>The Aurelius Fund | Read The Stoics, Donate to Veterans</title>



  <link rel="icon" type="image/png" href="favicon.png"  />

  <link rel="stylesheet" href="style.css" />

</head>





<body>
<div id="content">

<div>
  <img id="brand" src="marcus.png" />
</div>

<div id="quote">
“<?php
  echo $quote;
?>”
</div>

<div id="text"><a href="#">—Marcus Aurelius, Meditations, Book <?php echo $book; ?>, Verse <?php echo $verse; ?></a>
  <br/>
  <span id="title">M e d i t a t i o n s</span>
  <br/>
  <span id="subtitle">Adapted from the 1862 George Long book via <a href="http://classics.mit.edu/Antoninus/meditations.html">The Internet Classics Archive</a></span>
  <br/>
  © <?php echo date("Y"); ?> Marcus Skye Lewis. All Rights Reserved.
  <br/>
  <br/>
  <span id="footer-links"><a href="https://www.smgmobile.com/apps/marcus/privacy/">Privacy Policy</a> | <a href="https://www.smgmobile.com/">About Marcus</a></span>
  <br/>
  <br/>
  <br/>
</div>
</div>

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
