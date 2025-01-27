<!DOCTYPE html>
<html lang="en">

<head>
  <meta http-equiv="Content-Type" content="text/html" charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>The Stoic Reader | Read The Stoics, Donate to Veterans</title>

  <link rel="stylesheet" href="style.css" />

</head>

<body>

    <header>
        <img id="logo" src="img/logo.svg" alt="The Stoic Reader" />

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
                        <li><a href="#" onclick="showWork('1');"><label for="modal-toggle">Meditations</label></a></li>
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
                <li><a href="#" onclick="showNewQuote('random');" >Random Quote</a></li>
                <li>
                    <input type="checkbox" id="chat-toggle" hidden/>
                    <label for="chat-toggle">Stoic Chat</label>
                    <ul>
                        <li><a href="#">Marcus Aurelius</a></li>
                        <li><a href="#">Marcus Tullius Cicero</a></li>
                        <li><a href="#">Epictetus</a></li>
                        <li><a href="#">Lucius Annaeus Seneca</a></li>
                    </ul>
                </li>
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
        <p id="citation"></p>
    </div>
</main>

<!-- Modal Structure -->
 <!-- NOTE: 
  This modal looks better / more readable zoomed in 125% on desktop (use Safari and Zoom one time).
  Consider updating CSS to match default font sizes and spacings at 100% to 125% zoom
 -->
<input type="checkbox" id="modal-toggle" hidden />
<div id="modal">
    <label for="modal-toggle" id="modal-overlay"></label>
    <div id="modal-content">
        <div id="modal-header">
            <h2 id="modal-title">Modal Title</h2>
            <label id="modal-fullscreen">
                <svg id="double-column-icon" height="30px" width="30px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#dedede" stroke-width="2">
                        <line x1="7" y1="15" x2="23" y2="15"></line><line x1="7" y1="22" x2="23" y2="22"></line>
                        <line x1="7" y1="29" x2="23" y2="29"></line><line x1="7" y1="36" x2="23" y2="36"></line>
                        <line x1="27" y1="15" x2="43" y2="15"></line><line x1="27" y1="22" x2="43" y2="22"></line>
                        <line x1="27" y1="29" x2="43" y2="29"></line><line x1="27" y1="36" x2="43" y2="36"></line>
                    </g>
                </svg>
                <svg id="single-column-icon" height="30px" width="30px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <g stroke="#dedede" stroke-width="2">
                        <!-- NOTE: Make this 2 px wider at some point, will look better -->
                        <line x1="15" y1="15" x2="34" y2="15"></line>
                        <line x1="15" y1="22" x2="34" y2="22"></line>
                        <line x1="15" y1="29" x2="34" y2="29"></line>
                        <line x1="15" y1="36" x2="34" y2="36"></line>
                    </g>   
                </svg>
    
            </label>
            <label for="modal-toggle" id="modal-close">
                <svg height="30px" width="30px" viewBox="0 0 50 50" xmlns="http://www.w3.org/2000/svg">
                    <line x1="10" y1="10" x2="40" y2="40" stroke="#dedede" stroke-width="2"/>
                    <line x1="40" y1="10" x2="10" y2="40" stroke="#dedede" stroke-width="2"/>
                </svg>
            </label>            
        </div>

        <!-- MODAL CONTENT GOES HERE -->
            <div id="modal-data-loading" class="activity">Loading Book...</div>

            <div id="modal-body"></div>

    </div>
</div>

<footer>
    <div id="data-protection" alt="Data Protection Policy">
        <a href="#" onclick="showDataProtectionPolicy();">
            <label for="modal-toggle">Data Protection Policy</label>
        </a>
    </div>
    <div id="copyright" alt="Copyright © <?php echo date("Y"); ?> The Aurelius Fund | All Rights Reserved">
    Copyright © <?php echo date("Y"); ?> <a href="#">The Aurelius Fund</a> | All Rights Reserved</div>
</footer>

<script src="script.js"></script>
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


                --Chapter X, Verse I, Meditationes, Marcus Aurelius









!-->

<!--

                      ';olclkxkOxkdkxkOxdOOOK0Okx;                    
                 ..cl;:c;cxxdodkckdoddccoxOkOO00x,                  
               .;cl:ck:do.;ol''lxodoxddo;;coOkdddk:.                
.  ..         .occc,cxc;;llkk;..,l,ldlc::';ddoOkkkkd;.              
......       .odlxkl'.';..,,loc,',;:coxxxxxkxcc:cld0Ok.             
.......... .,cc;,,,ol,,;;;,,;oO0O000KXXXK0kdll;',:dOOx:.            
...........cc,;;'...;:loddkkO0000KKXNNXK0000Oxk0xdOkkO0x'           
...........;:'loxl;,;;cldxkkkO0000XXXXXK0O00OkO0xxOxdO0kk,          
...........,'.loxo;',;clodddxkOOkkOOkO0KO000Okxkcoxxxxccc'          
..........,dc,;;;l,.';lddolllllodolcc:::;codxxdxc;,,:ldooo.         
...........,,;''cl,..',,.......;odc,''''','';ldOkoc,clooo'          
.............,coc;,......,;;,,.,x0xdollodddodxkOkxdc;.';c.          
...............,::,.';;;;:cldo:;k0k0K0Okkkk0KK0Okddol;.'.           
...............;c:,',coxxxkOkl;;kKxk0KXXKKK00OOkkkxdo;;c.           
............... ',;.';lodxxkk:':OKkdk0K00OOOOkxkO0d;;:l'            
..................;,',;clodxx:,l0KOkkxkOOOOkkxkO0Okol;....          
...................,'',;:lddo'.':c:,cOOxxkkxxxkkxoxd'.......        
.................';';;;;,cllc,...'lxO000kxkkOkkxkdd;........        
.................,;.';::;cco;''.'c:ccllxOOOOkkxkood...........      
..................:;,lc:llcl;'',:codooo:oxkOO0Oxxd:............     
...................'.,c:c::cc:::oxkOOO0kldxxdddddo.............     
.......................'::cdlldllxxOO000kddxxllc:...................
........................;,cxdxOkkO0000000Okllc;;:...................
.........................',:;cdoxxkkkxxkOxoo:',co...................
...........................''::;llcoooolc:'',:oxx::;'...............
.................................',',''...';lkOOkxxxkkdl,...........
...................    .................',cdkO0Okk0OOOOkdl;'........
..................     ..............'',:oxkOOOOkkO00OOkxOOkc...;'..
...................    ..........''',,;ldkOOOOOkkO000OOkO0Oxxl:dOko,
........';;;;.....  .  ......''''''',:ldkkOOOOkOKK000OOOkxkOOdlO0Okk
......,loxxdo;''..........''''''''',:ldxxkkkkOKKKKK0OxdoxO0Oklx0Okkk
.....;:dxOkdo;;'..,'......',,,,,,,;:clodxxxkKKKK00OdlldOOOkOxcxxkO0O
.....,coxxdo;;,,';;''.....'',;;;;;::clodxxOKKK0Odccok0OOOk0Occdk0OOk
..'''';cdxc',::,'c,',,''''',;:ccccccloddxO000Ol,;dOK0OO0kO0k;;lO0Okk


        “Every man always has handy a dozen glib little reasons

               why he is right not to sacrifice himself."


                  ―-Aleksandr Solzhenitsyn, The Gulag Archipelago
-->

</html>
