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
a:hover { color: white; text-decoration: underline; }

body, html {
    height: 100%;
    background-color: #112233;
    font-family: 'Sorts Mill Goudy', serif;
    color: #D9D9D9;
}

body {
    display: flex;
    flex-direction: column;
}

header, footer {
    height: 61px;
    padding: 22px 20px 20px 18px;
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

nav, button, label {
    cursor: pointer;
}

main {
    height: calc(100% - 122px); /* 100% minus two times the header/footer height */
    width: 100%;
    background: linear-gradient(rgba(0,0,0,0.5),rgba(0,0,0,0.4)), url('/bg.jpg') no-repeat center center / cover fixed;
    overflow: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    color: white;
    animation: fadeIn 1s ease-in forwards;
}

#selection {
    text-align: center;
    padding: 20px;
    max-width: 80%;
    letter-spacing: .03em;
}

#quote, #citation {
    text-shadow: 1px 1px 15px black;
    animation: fadeIn 1s ease-in forwards;
}

#quote {
    font-size: calc(2.1vw + 2.1vh + 10%);
    animation-delay: .05s;    
}

#quote > a, #quote > a:hover {
    color: #e9e9e9;
    text-decoration: none;
}

#citation {
    font-size: calc(1.4vw + 1.4vh);
    padding-top: 3%;
    animation-delay: .1s;
}

#citation > a {
    color: #e9e9e9;
}

@keyframes fadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
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
    position: relative;
    z-index: 30; /* Higher than the menu to manage stack order */
}

#menu-open-button:before {
        content: 'OPEN BOOK';
}
#menu-open-button:hover {
    border-color: white;
    background-color: white;
    color: #112233;
    box-shadow: 1px 1px 10px black;
}

#menu {
    display: none;
    position: absolute;
    background-color: #112233;
    border: 1px solid rgba(255,255,255,.1);
    width: auto;
    min-width: 150px; /* Ensure it has a minimum width */
    top: 55px; /* Height of the header */
    right: 20px; /* Aligns to the right edge of the header */
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    z-index: 20; /* Above the overlay */
    width: 270px;
    max-height: calc(100vh - 55px);
    overflow-y: auto;
    overflow-x: hidden;
}

#overlay {
    display: none;
    position: fixed;
    top: 0; left: 0;
    width: 100vw;
    height: 100vh;
    background: transparent; /* Ensure overlay is invisible */
    z-index: 10; /* Below the menu but above other content */
}

#menu ul {
    list-style-type: none;
  }


#menu li {
    position: relative;
    text-indent: 4px;
}

#menu li label, #menu li a {
    padding: 10px;
    display: block;
    cursor: pointer;
    color: white;   
}

#menu li label:hover, #menu li a:hover {
  background-color: white;
  color: #112233;
  text-decoration: none;
}

#menu li input:checked + label + ul {
    display: block;
}

#menu li ul {
    display: none;
    background-color: #1a2c45;
}

#menu li ul li a {
    display: block;
    padding: 8px;
    color: white;
    padding-left: 20px;

}

#menu li ul li a:hover {
    /* background-color: #1a2c45; */
}

#toggle-menu:checked ~ #menu {
    display: block; /* Show nav menu when toggled */
}

#toggle-menu:checked ~ #overlay {
    display: block; /* Show overlay when nav menu is active */
}




/* Modal overlay and content styles */
.modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    display: none;
    align-items: center;
    justify-content: center;
    z-index: 50;
}

.modal-overlay {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: rgba(0, 0, 0, 0.8);
}

.modal-content {
    position: relative;
    box-shadow: 0 4px 6px rgba(0,0,0,0.1);
    width: 92vw;
    height: 90vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    background-color: #112233;
    border: 1px solid rgba(255,255,255,.1);
    box-shadow: 0 8px 16px rgba(0,0,0,0.2);
    overflow-y: hidden;
    z-index: 51;
}

.modal-header {
    position: sticky;
    top: 0;
    background: inherit;
    padding: 10px 10px 5px 18px;
    border-bottom: 1px solid rgba(255,255,255,.1);;
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    color: #e9e9e9;
}

.modal-header > h2 {
    font-weight: normal;
    letter-spacing: 5px;
}

.modal-body {
    overflow-y: auto;
    padding: 20px;
    flex-grow: 1;
    max-width: 600px;
    line-height: 38px;
    letter-spacing: 1px;
}

.modal-close {
    cursor: pointer;
    border: none;
}

/* Show modal when checkbox is checked */
#modal-toggle:checked + .modal {
    display: flex;
}




/* Responsive */

@media (max-width: 768px) {
    header, footer {
        padding: 22px 12px 20px 12px; /* Reduced left-right padding */
    }

    footer {
        padding-top: 30px;
        font-size: 12px;
    }

    #logo {
        width: 200px; /* Adjust logo width */
    }

    #menu-open-button {
        border: none; /* Remove border if it's not part of the design */
        padding: 10px 10px 5px; /* Adjust padding as needed */
    }

    #menu-open-button:hover {
        background: none;
        box-shadow: none;
        color: white;
    }

    #menu-open-button:before {
        content: '✶'; /* Traditional ☰ from: https://www.symbolcopy.com/star-symbol.html */
        display: block;
    }

    #data-protection {
        display: none;
    }

    #copyright {
        text-align: center;
    }

    footer {
        justify-content: space-evenly;
    }
}
</style>

<body>

    <header>
        <img id="logo" src="/logo.svg" alt="The Stoic Reader" />

        <!-- Menu toggle button -->
        <input type="checkbox" id="toggle-menu" hidden onchange="if(!this.checked) document.querySelectorAll('#menu input[type=checkbox]').forEach(checkbox => checkbox.checked = false);"/>
                  

        <label for="toggle-menu" id="menu-open-button" alt="Book & Settings Menu"></label>

        <!-- Navigation menu -->
        <nav id="menu">
            <ul>
                <li>
                    <input type="checkbox" id="marcus-toggle" hidden />
                    <label for="marcus-toggle">Marcus Aurelius</label>
                    <ul>
                        <li><a href="#">Meditations</a></li>
                    </ul>
                </li>
                <li>
                    <input type="checkbox" id="epictetus-toggle" hidden />
                    <label for="epictetus-toggle">Epictetus</label>
                    <ul>
                        <li><a href="#">The Discourses</a></li>
                        <li><a href="#">The Enchiridion</a></li>
                        <li><a href="#">The Golden Sayings</a></li>
                    </ul>
                </li>
                <li>
                    <input type="checkbox" id="seneca-toggle" hidden />
                    <label for="seneca-toggle">Seneca</label>
                    <ul>
                        <li><a href="#">Letters from a Stoic</a></li>
                        <li><a href="#">On the Shortness of Life</a></li>
                    </ul>
                </li>
                <li>
                    <input type="checkbox" id="cicero-toggle" hidden />
                    <label for="cicero-toggle">Cicero</label>
                    <ul>
                        <li><a href="#">On the Ends of Good and Evil</a></li>
                        <li><a href="#">Tuscan Disputations</a></li>
                        <li><a href="#">On Duties</a></li>
                    </ul>
                </li>
                <li><a href="#" onclick="newQuote('random'); dismissMenu();" >Random Quote</a></li>
                <li><a href="#">Stoic Chat</a></li>
                <li><a href="#">About</a></li>
                <li><a href="#">Settings</a></li>
            </ul>
        </nav>

        <!-- Overlay label for closing menu when clicked outside -->
        <label for="toggle-menu" id="overlay"></label>

    </header>


<main>
          <div id="selection">
            <p id="quote"></p>
             <p id="citation">
             </p>
          </div>
</main>

<!-- Modal Structure -->
<input type="checkbox" id="modal-toggle" hidden />
<div class="modal">
    <label for="modal-toggle" class="modal-overlay"></label>
    <div class="modal-content">
        <div class="modal-header">
            <h2>Modal Title</h2>
            <label for="modal-toggle" class="modal-close"><svg height="30px" width="30px" version="1.1" id="Layer_1" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" 
	 viewBox="0 0 50 50" enable-background="new 0 0 50 50" xml:space="preserve">
<path fill="#dedede" d="M9.016,40.837c0.195,0.195,0.451,0.292,0.707,0.292c0.256,0,0.512-0.098,0.708-0.293l14.292-14.309
	l14.292,14.309c0.195,0.196,0.451,0.293,0.708,0.293c0.256,0,0.512-0.098,0.707-0.292c0.391-0.39,0.391-1.023,0.001-1.414
	L26.153,25.129L40.43,10.836c0.39-0.391,0.39-1.024-0.001-1.414c-0.392-0.391-1.024-0.391-1.414,0.001L24.722,23.732L10.43,9.423
	c-0.391-0.391-1.024-0.391-1.414-0.001c-0.391,0.39-0.391,1.023-0.001,1.414l14.276,14.293L9.015,39.423
	C8.625,39.813,8.625,40.447,9.016,40.837z"/>
</svg></label>
        </div>
        <div class="modal-body">
            <p>Details about the selection...</p>
            <!-- Additional content can go here and will scroll if too long -->
        </div>
    </div>
</div>

<footer>
<div id="data-protection" alt="Data Protection Policy"><a href="/data-protection-policy">Data Protection Policy</a></div>
    <div id="copyright" alt="Copyright © <?php echo date("Y"); ?> The Aurelius Fund | All Rights Reserved">
    Copyright © <?php echo date("Y"); ?> <a href="#">The Aurelius Fund</a> | All Rights Reserved</div>
</footer>

<script>
document.addEventListener('DOMContentLoaded', function() {

      /*
      /* App Lifecycle 
      */  
       
      newQuote(); // Maybe later let's go back to using PHP to show quote on initial load
      
});

function newQuote(selectionMethod) {

fetch('stoic-quotes.json')
  .then(response => response.json())
  .then(data => {
    const { works, quotes } = data;
    if (selectionMethod === 'random') { 
      var myQuote = quotes[ Math.floor( Math.random() * quotes.length )];
    } else { 
      // days since 1970 modulo # quotes rotates through all the quotes, gives new one each day       
      var myQuote = quotes[( Math.ceil((new Date().getTime()) / (1000 * 3600 * 24)) % quotes.length)];
    }
    const myWork = works.find(work => work.id === myQuote.workId);
    document.getElementById('quote').innerHTML = 
    `<a href="#"><label for='modal-toggle'>${myQuote.quote}</label></a>`;
    document.getElementById('citation').innerHTML = 
    `~<a href="#"><label for='modal-toggle'>${myWork.author}</label></a>, 
    <a href="#"><label for='modal-toggle'>${myWork.title}</a>, 
    <a href="#"><label for='modal-toggle'>Book ${myQuote.chapter}</a>, 
    <a href="#"><label for='modal-toggle'>Verse ${myQuote.verse}</a>`;
})
.catch(error => {
  console.error('Error fetching the quote:', error);
  document.getElementById('quote').innerHTML = 'Derp. Failed to load quote! <a href=".">Try again?</a>';
  document.getElementById('citation').innerHTML = '';
});
}

function dismissMenu() {
  document.getElementById("toggle-menu").checked = false;
  document.querySelectorAll('#menu input[type=checkbox]').forEach(checkbox => checkbox.checked = false);
}


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
