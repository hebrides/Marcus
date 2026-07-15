# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stoic-reader.spec.js >> Visual snapshots >> work modal at desktop viewport
- Location: stoic-reader.spec.js:273:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  30992 pixels (ratio 0.03 of all image pixels) are different.

  Snapshot: modal-desktop.png

Call log:
  - Expect "toHaveScreenshot(modal-desktop.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 17838 pixels (ratio 0.02 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 10662 pixels (ratio 0.01 of all image pixels) are different.
  - waiting 250ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 30992 pixels (ratio 0.03 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - img "The Stoic Reader" [ref=e3]
    - generic [ref=e4] [cursor=pointer]: OPEN BOOK
  - main [ref=e5]:
    - generic [ref=e6]:
      - paragraph [ref=e7]:
        - link "Piety toward the Gods, to be sure, consists chiefly in thinking rightly concerning them—that they are, and that they govern the Universe with goodness and justice; and that thou thyself art appointed to obey them, and to submit under all circumstances that arise; acquiescing c..." [active] [ref=e8] [cursor=pointer]:
          - /url: "#"
      - paragraph [ref=e9]:
        - text: ~
        - link "Epictetus" [ref=e10] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "The Golden Sayings" [ref=e11] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "Section 163" [ref=e12] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "Verse 1" [ref=e13] [cursor=pointer]:
          - /url: "#"
  - generic [ref=e16]:
    - generic [ref=e17]:
      - heading "The Golden Sayings" [level=2] [ref=e18]
      - img [ref=e20] [cursor=pointer]
      - img [ref=e23] [cursor=pointer]
    - generic [ref=e26]:
      - paragraph [ref=e27]: "\"But to marry and to rear offspring,\" said the young man, \"will the Cynic hold himself bound to undertake this as a chief duty?\""
      - paragraph [ref=e28]: Grant me a republic of wise men, answered Epictetus, and perhaps none will lightly take the Cynic life upon him. For on whose account should he embrace that method of life? Suppose however that he does, there will then be nothing to hinder his marrying and rearing offspring. For his wife will be even such another as himself, and likewise her father; and in like manner will his children be brought up.
      - paragraph [ref=e29]: But in the present condition of things, which resembles an Army in battle array, ought not the Cynic to be free from all distraction and given wholly to the service of God, so that he can go in and out among men, neither fettered by the duties nor entangled by the relations of common life? For if he transgress them, he will forfeit the character of a good man and true; whereas if he observe them, there is an end to him as the Messenger, the Spy, the Herald of the Gods!
      - heading "CXVII" [level=3] [ref=e30]
      - paragraph [ref=e31]: Ask me if you choose if a Cynic shall engage in the administration of the State. O fool, seek you a nobler administration that that in which he is engaged? Ask you if a man shall come forward in the Athenian assembly and talk about revenue and supplies, when his business is to converse with all men, Athenians, Corinthians, and Romans alike, not about supplies, not about revenue, nor yet peace and war, but about Happiness and Misery, Prosperity and Adversity, Slavery and Freedom?
      - paragraph [ref=e32]: Ask you whether a man shall engage in the administration of the State who has engaged in such an Administration as this? Ask me too if he shall govern; and again I will answer, Fool, what greater government shall he hold than he holds already?
      - heading "CXVIII" [level=3] [ref=e33]
      - paragraph [ref=e34]: Such a man needs also to have a certain habit of body. If he appears consumptive, thin and pale, his testimony has no longer the same authority. He must not only prove to the unlearned by showing them what his Soul is that it is possible to be a good man apart from all that they admire; but he must also show them, by his body, that a plain and simple manner of life under the open sky does no harm to the body either. "See, I am proof of this! and my body also." As Diogenes used to do, who went about fresh of look and by the very appearance of his body drew men's eyes. But if a Cynic is an object of pity, he seems a mere beggar; all turn away, all are offended at him. Nor should he be slovenly of look, so as not to scare men from him in this way either; on the contrary, his very roughness should be clean and attractive.
      - heading "CXIX" [level=3] [ref=e35]
      - paragraph [ref=e36]: "Kings and tyrants have armed guards wherewith to chastise certain persons, though they themselves be evil. But to the Cynic conscience gives this power—not arms and guards. When he knows that he has watched and laboured on behalf of mankind: that sleep hath found him pure, and left him purer still: that his thoughts have been the thought of a Friend of the Gods—of a servant, yet one that hath a part in the government of the Supreme God: that the words are ever on his lips:—"
      - paragraph [ref=e37]: Lead me, O God, and thou, O Destiny!
      - paragraph [ref=e38]: as well as these:—
      - paragraph [ref=e39]: If this be God's will, so let it be!
      - paragraph [ref=e40]: Why should he not speak boldly unto his own brethren, unto his children—in a word, unto all that are akin to him!
      - heading "CXX" [level=3] [ref=e41]
      - paragraph [ref=e42]: Does a Philosopher apply to people to come and hear him? does he not rather, of his own nature, attract those that will be benefited by him—like the sun that warms, the food that sustains them? What Physician applies to men to come and be healed? (Though indeed I hear that the Physicians at Rome do nowadays apply for patients—in my time they were applied to.) I apply to you to come and hear that you are in evil case; that what deserves your attention most is the last thing to gain it; that you know not good from evil, and are in short a hapless wretch; a fine way to apply! though unless the words of the Philosopher affect you thus, speaker and speech are alike dead.
      - heading "CXXI" [level=3] [ref=e43]
      - paragraph [ref=e44]: "A Philosopher's school is a Surgery: pain, not pleasure, you should have felt therein. For on entering none of you is whole. One has a shoulder out of joint, another an abscess: a third suffers from an issue, a fourth from pains in the head. And am I then to sit down and treat you to pretty sentiments and empty flourishes, so that you may applaud me and depart, with neither shoulder, nor head, nor issue, nor abscess a whit the better for your visit? Is it then for this that young men are to quit their homes, and leave parents, friends, kinsmen and substance to mouth out Bravo to your empty phrases!"
      - heading "CXXII" [level=3] [ref=e45]
      - paragraph [ref=e46]: If any be unhappy, let him remember that he is unhappy by reason of himself alone. For God hath made all men to enjoy felicity and constancy of good.
      - heading "CXXIII" [level=3] [ref=e47]
      - paragraph [ref=e48]: Shall we never wean ourselves—shall we never heed the teachings of Philosophy (unless perchance they have been sounding in our ears like an enchanter's drone):—
      - paragraph [ref=e49]: "This World is one great City, and one is the substance whereof it is fashioned: a certain period indeed there needs must be, while these give place to those; some must perish for others to succeed; some move and some abide: yet all is full of friends—first God, then Men, whom Nature hath bound by ties of kindred each to each."
      - heading "CXXIV" [level=3] [ref=e50]
      - paragraph [ref=e51]: "Nor did the hero weep and lament at leaving his children orphans. For he knew that no man is an orphan, but it is the Father that careth for all continually and for evermore. Not by mere report had he heard that the Supreme God is the Father of men: seeing that he called Him Father believing Him so to be, and in all that he did had ever his eyes fixed upon Him. Wherefore in whatsoever place he was, there is was given him to live happily."
      - heading "CXXV" [level=3] [ref=e52]
      - paragraph [ref=e53]: "Know you not that the thing is a warfare? one man's duty is to mount guard, another must go out to reconnoitre, a third to battle; all cannot be in one place, nor would it even be expedient. But you, instead of executing you Commander's orders, complain if aught harsher than usual is enjoined; not understanding to what condition you are bringing the army, so far as in you lies. If all were to follow your example, none would dig a trench, none would cast a rampart around the camp, none would keep watch, or expose himself to danger; but all turn out useless for the service of war. . . . Thus it is here also. Every life is a warfare, and that long and various. You must fulfil a soldier's duty, and obey each order at your commander's nod: aye, if it be possible, divine what he would have done; for between that Command and this, there is no comparison, either in might or in excellence."
      - heading "CXXVI" [level=3] [ref=e54]
      - paragraph [ref=e55]: Have you again forgotten? Know you not that a good man does nothing for appearance' sake, but for the sake of having done right? . . .
      - paragraph [ref=e56]: "\"Is there no reward then?\""
      - paragraph [ref=e57]: Reward! do you seek any greater reward for a good man than doing what is right and just? Yet at the Great Games you look for nothing else; there the victor's crown you deem enough. Seems it to you so small a thing and worthless, to be a good man, and happy therein?
      - heading "CXXVII" [level=3] [ref=e58]
      - paragraph [ref=e59]: It befits thee not to be unhappy by reason of any, but rather to be happy by reason of all men, and especially by reason of God, who formed us to this end.
      - heading "CXXVIII" [level=3] [ref=e60]
      - paragraph [ref=e61]: What, did Diogenes love no man, he that was so gentle, so true a friend to men as cheerfully to endure such bodily hardships for the common weal of all mankind? But how loved he them? As behoved a minister of the Supreme God, alike caring for men and subject unto God.
      - heading "CXXIX" [level=3] [ref=e62]
      - paragraph [ref=e63]: I am by Nature made for my own good; not for my own evil.
      - heading "CXXX" [level=3] [ref=e64]
      - paragraph [ref=e65]: Remind thyself that he whom thou lovest is mortal—that what thou lovest is not thine own; it is given thee for the present, not irrevocably nor for ever, but even as a fig or a bunch of grapes at the appointed season of the year. . . .
      - paragraph [ref=e66]: "\"But these are words of evil omen.\". . ."
      - paragraph [ref=e67]: What, callest thou aught of evil omen save that which signifies some evil thing? Cowardice is a word of evil omen, if thou wilt, and meanness of spirit, and lamentation and mourning, and shamelessness. . . .
      - paragraph [ref=e68]: But do not, I pray thee, call of evil omen a word that is significant of any natural thing:—as well call of evil omen the reaping of the corn; for that means the destruction of the ears, though not of the World!—as well say that the fall of the leaf is of evil omen; that the dried fig should take the place of the green; that raisins should be made from grapes. All these are changes from a former state into another; not destruction, but an ordered economy, a fixed administration. Such is leaving home, a change of small account; such is Death, a greater change, from what now is, not to what is not, but to what is not now.
      - paragraph [ref=e69]: "\"Shall I then no longer be?\""
      - paragraph [ref=e70]: Not so; thou wilt be; but something different, of which the World now hath need. For thou too wert born not when thou chosest, but when the World had need of thee.
      - heading "CXXXI" [level=3] [ref=e71]
      - paragraph [ref=e72]: Wherefore a good man and true, bearing in mind who he is and whence he came and from whom he sprang, cares only how he may fill his post with due discipline and obedience to God.
      - paragraph [ref=e73]: "Wilt thou that I continue to live? Then will I live, as one that is free and noble, as Thou wouldst have me. For Thou hast made me free from hindrance in what appertaineth unto me. But hast Thou no further need of me? I thank Thee! Up to this hour have I stayed for Thy sake and none other's: and now in obedience to Thee I depart."
      - paragraph [ref=e74]: "\"How dost thou depart?\""
      - paragraph [ref=e75]: Again I say, as Thou wouldst have me; as one that is free, as Thy servant, as one whose ear is open unto what Thou dost enjoin, what Thou dost forbid.
      - heading "CXXXII" [level=3] [ref=e76]
      - paragraph [ref=e77]: "Whatsoever place or post Thou assignest me, sooner will I die a thousand deaths, as Socrates said, than desert it. And where wilt Thou have me to be? At Rome or Athens? At Thebes or on a desert island? Only remember me there! Shouldst Thou send me where man cannot live as Nature would have him, I will depart, not in disobedience to Thee, but as though Thou wert sounding the signal for my retreat: I am not deserting Thee—far be that from me! I only perceive that thou needest me no longer."
      - heading "CXXXIII" [level=3] [ref=e78]
      - paragraph [ref=e79]: If you are in Gyaros, do not let your mind dwell upon life at Rome, and all the pleasures it offered to you when living there, and all that would attend your return. Rather be intent on this—how he that lives in Gyaros may live in Gyaros like a man of spirit. And if you are at Rome, do not let your mind dwell upon the life at Athens, but study only how to live at Rome.
      - paragraph [ref=e80]: Finally, in the room of all other pleasures put this—the pleasure which springs from conscious obedience to God.
      - heading "CXXXIV" [level=3] [ref=e81]
      - paragraph [ref=e82]: To a good man there is no evil, either in life or death. And if God supply not food, has He not, as a wise Commander, sounded the signal for retreat and nothing more? I obey, I follow—speaking good of my Commander, and praising His acts. For at His good pleasure I came; and I depart when it pleases Him; and while I was yet alive that was my work, to sing praises unto God!
      - heading "CXXXV" [level=3] [ref=e83]
      - paragraph [ref=e84]: Reflect that the chief source of all evils to Man, and of baseness and cowardice, is not death, but the fear of death.
      - paragraph [ref=e85]: Against this fear then, I pray you, harden yourself; to this let all your reasonings, your exercises, your reading tend. Then shall you know that thus alone are men set free.
      - heading "CXXXVI" [level=3] [ref=e86]
      - paragraph [ref=e87]: He is free who lives as he wishes to live; to whom none can do violence, none hinder or compel; whose impulses are unimpeded, whose desires are attain their purpose, who falls not into what he would avoid. Who then would live in error?—None. Who would live deceived and prone to fall, unjust, intemperate, in abject whining at his lot?—None. Then doth no wicked man live as he would, and therefore neither is he free.
      - heading "CXXXVII" [level=3] [ref=e88]
      - paragraph [ref=e89]: Thus do the more cautious of travellers act. The road is said to be beset by robbers. The traveller will not venture alone, but awaits the companionship on the road of an ambassador, a quaestor or a proconsul. To him he attaches himself and thus passes by in safety. So doth the wise man in the world. Many are the companies of robbers and tyrants, many the storms, the straits, the losses of all a man holds dearest. Whither shall he fall for refuge—how shall he pass by unassailed? What companion on the road shall he await for protection? Such and such a wealthy man, of consular rank? And how shall I be profited, if he is stripped and falls to lamentation and weeping? And how if my fellow-traveller himself turns upon me and robs me? What am I to do? I will become a friend of Caesar's! in his train none will do me wrong! In the first place—O the indignities I must endure to win distinction! O the multitude of hands there will be to rob me! And if I succeed, Caesar too is but a mortal. While should it come to pass that I offend him, whither shall I flee from his presence? To the wilderness? And may not fever await me there? What then is to be done? Cannot a fellow-traveller be found that is honest and loyal, strong and secure against surprise? Thus doth the wise man reason, considering that if he would pass through in safety, he must attach himself unto God.
      - heading "CXXXVIII" [level=3] [ref=e90]
      - paragraph [ref=e91]: "\"How understandest thou attach himself to God?\""
      - paragraph [ref=e92]: That what God wills, he should will also; that what God wills not, neither should he will.
      - paragraph [ref=e93]: "\"How then may this come to pass?\""
      - paragraph [ref=e94]: By considering the movements of God, and His administration.
      - heading "CXXXIX" [level=3] [ref=e95]
      - paragraph [ref=e96]: And dost thou that hast received all from another's hands, repine and blame the Giver, if He takes anything from thee? Why, who art thou, and to what end comest thou here? was it not He that made the Light manifest unto thee, that gave thee fellow-workers, and senses, and the power to reason? And how brought He thee into the world? Was it not as one born to die; as one bound to live out his earthly life in some small tabernacle of flesh; to behold His administration, and for a little while share with Him in the mighty march of this great Festival Procession? Now therefore that thou hast beheld, while it was permitted thee, the Solemn Feast and Assembly, wilt thou not cheerfully depart, when He summons thee forth, with adoration and thanksgiving for what thou hast seen and heard?—"Nay, but I would fain have stayed longer at the Festival."—Ah, so would the mystics fain have the rites prolonged; so perchance would the crowd at the Great Games fain behold more wrestlers still. But the Solemn Assembly is over! Come forth, depart with thanksgiving and modesty—give place to others that must come into being even as thyself.
      - heading "CXL" [level=3] [ref=e97]
      - paragraph [ref=e98]: "Why art thou thus insatiable? why thus unreasonable? why encumber the world?—\"Aye, but I fain would have my wife and children with me too.\"—What, are they then thine, and not His that gave them—His that made thee? Give up then that which is not thine own: yield it to One who is better than thou. \"Nay, but why did He bring one into the world on these conditions?\"—If it suits thee not, depart! He hath no need of a spectator who finds fault with his lot! Them that will take part in the Feast he needeth—that will lift their voices with the rest that men may applaud the more, and exalt the Great Assembly in hymns and songs of praise. But the wretched and the fearful He will not be displeased to see absent from it: for when they were present, they did not behave as at a Feast, nor fulfil their proper office; but moaned as though in pain, and found fault with their fate, their fortune and their companions; insensible to what had fallen to their lot, insensible to the powers they had received for a very different purpose—the powers of Magnanimity, Nobility of Heart, of Fortitude, or Freedom!"
      - heading "CXLI" [level=3] [ref=e99]
      - paragraph [ref=e100]: Art thou then free? a man may say. So help me heaven, I long and pray for freedom! But I cannot look my masters boldly in the face; I still value the poor body; I still set much store on its preservation whole and sound.
      - paragraph [ref=e101]: But I can point thee out a free man, that thou mayest be no more in search of an example. Diogenes was free. How so? Not because he was of free parentage (for that, indeed, was not the case), but because he was himself free. He had cast away every handle whereby slavery might lay hold of him to enslave him, nor was it possible for any to approach and take hold of him to enslave him. All things sat loose upon him—all things were to him attached by but slender ties. Hadst thou seized upon his possessions, he would rather have let them go than have followed thee for them—aye, had it been even a limb, or mayhap his whole body; and in like manner, relatives, friends, and country. For he knew whence they came—from whose hands and on what terms he had received them. His true forefathers, the Gods, his true Country, he never would have abandoned; nor would he have yielded to any man in obedience and submission to the one nor in cheerfully dying for the other. For he was ever mindful that everything that comes to pass has its source and origin there; being indeed brought about for the weal of that his true Country, and directed by Him in whose governance it is.
      - heading "CXLII" [level=3] [ref=e102]
      - paragraph [ref=e103]: "Ponder on this—on these convictions, on these words: fix thine eyes on these examples, if thou wouldst be free, if thou hast thine heart set upon the matter according to its worth. And what marvel if thou purchase so great a thing at so great and high a price? For the sake of this that men deem liberty, some hang themselves, others cast themselves down from the rock; aye, time has been when whole cities came utterly to an end: while for the sake of Freedom that is true, and sure, and unassailable, dost thou grudge to God what He gave, when He claims it? Wilt thou not study, as Plato saith, to endure, not death alone, but torture, exile, stripes—in a word, to render up all that is not thine own? Else thou wilt be a slave amid slaves, wert thou ten thousand times a consul; aye, not a whit the less, though thou climb the Palace steps. And thou shalt know how true the saying of Cleanthes, that though the words of philosophers may run counter to the opinions of the world, yet have they reason on their side."
      - heading "CXLIII" [level=3] [ref=e104]
      - paragraph [ref=e105]: Asked how a man should best grieve his enemy, Epictetus replied, "By setting himself to live the noblest life himself."
      - heading "CXLIV" [level=3] [ref=e106]
      - paragraph [ref=e107]: "I am free, I am a friend of God, ready to render Him willing obedience. Of all else I may set store by nothing—neither by mine own body, nor possessions, nor office, nor good report, nor, in a word, aught else beside. For it is not His Will, that I should so set store by these things. Had it been His pleasure, He would have placed my Good therein. But now He hath not done so: therefore I cannot transgress one jot of His commands. In everything hold fast to that which is thy Good—but to all else (as far as is given thee) within the measure of Reason only, contented with this alone. Else thou wilt meet with failure, ill success, let and hindrance. These are the Laws ordained of God—these are His Edicts; these a man should expound and interpret; to these submit himself, not to the laws of Masurius and Cassius."
      - heading "CXLV" [level=3] [ref=e108]
      - paragraph [ref=e109]: "Remember that not the love of power and wealth sets us under the heel of others, but even the love of tranquillity, of leisure, of change of scene—of learning in general, it matters not what the outward thing may be—to set store by it is to place thyself in subjection to another. Where is the difference then between desiring to be a Senator, and desiring not to be one: between thirsting for office and thirsting to be quit of it? Where is the difference between crying, Woe is me, I know not what to do, bound hand and foot as I am to my books so that I cannot stir! and crying, Woe is me, I have not time to read! As though a book were not as much an outward thing and independent of the will, as office and power and the receptions of the great."
      - paragraph [ref=e110]: Or what reason hast thou (tell me) for desiring to read? For if thou aim at nothing beyond the mere delight of it, or gaining some scrap of knowledge, thou art but a poor, spiritless knave. But if thou desirest to study to its proper end, what else is this than a life that flows on tranquil and serene? And if thy reading secures thee not serenity, what profits it?—"Nay, but it doth secure it," quoth he, "and that is why I repine at being deprived of it."—And what serenity is this that lies at the mercy of every passer-by? I say not at the mercy of the Emperor or Emperor's favorite, but such as trembles at a raven's croak and piper's din, a fever's touch or a thousand things of like sort! Whereas the life serene has no more certain mark than this, that it ever moves with constant unimpeded flow.
      - heading "CXLVI" [level=3] [ref=e111]
      - paragraph [ref=e112]: "If thou hast put malice and evil speaking from thee, altogether, or in some degree: if thou hast put away from thee rashness, foulness of tongue, intemperance, sluggishness: if thou art not moved by what once moved thee, or in like manner as thou once wert moved—then thou mayest celebrate a daily festival, to-day because thou hast done well in this manner, to-morrow in that. How much greater cause is here for offering sacrifice, than if a man should become Consul or Prefect?"
      - heading "CXLVII" [level=3] [ref=e113]
      - paragraph [ref=e114]: "These things hast thou from thyself and from the Gods: only remember who it is that giveth them—to whom and for what purpose they were given. Feeding thy soul on thoughts like these, dost thou debate in what place happiness awaits thee? in what place thou shalt do God's pleasure? Are not the Gods nigh unto all places alike; see they not alike what everywhere comes to pass?"
      - heading "CXLVIII" [level=3] [ref=e115]
      - paragraph [ref=e116]: To each man God hath granted this inward freedom. These are the principles that in a house create love, in a city concord, among nations peace, teaching a man gratitude towards God and cheerful confidence, wherever he may be, in dealing with outward things that he knows are neither his nor worth striving after.
      - heading "CXLIX" [level=3] [ref=e117]
      - paragraph [ref=e118]: If you seek Truth, you will not seek to gain a victory by every possible means; and when you have found Truth, you need not fear being defeated.
      - heading "CL" [level=3] [ref=e119]
      - paragraph [ref=e120]: What foolish talk is this? how can I any longer lay claim to right principles, if I am not content with being what I am, but am all aflutter about what I am supposed to be?
      - heading "CLI" [level=3] [ref=e121]
      - paragraph [ref=e122]: God hath made all things in the world, nay, the world itself, free from hindrance and perfect, and its parts for the use of the whole. No other creature is capable of comprehending His administration thereof; but the reasonable being Man possesses faculties for the consideration of all these things—not only that he is himself a part, but what part he is, and how it is meet that the parts should give place to the whole. Nor is this all. Being naturally constituted noble, magnanimous, and free, he sees that the things which surround him are of two kinds. Some are free from hindrance and in the power of the will. Other are subject to hindrance, and depend on the will of other men. If then he place his own good, his own best interest, only in that which is free from hindrance and in his power, he will be free, tranquil, happy, unharmed, noble-hearted, and pious; giving thanks to all things unto God, finding fault with nothing that comes to pass, laying no charge against anything. Whereas if he place his good in outward things, depending not on the will, he must perforce be subject to hindrance and restraint, the slave of those that have power over the things he desires and fears; he must perforce be impious, as deeming himself injured at the hands of God; he must be unjust, as ever prone to claim more than his due; he must perforce be of a mean and abject spirit.
      - heading "CLII" [level=3] [ref=e123]
      - paragraph [ref=e124]: Whom then shall I fear? the lords of the Bedchamber, lest they should shut me out? If they find me desirous of entering in, let them shut me out, if they will.
      - paragraph [ref=e125]: "\"Then why comest thou to the door?\""
      - paragraph [ref=e126]: Because I think it meet and right, so long as the Play lasts, to take part therein.
      - paragraph [ref=e127]: "\"In what sense art thou then shut out?\""
      - paragraph [ref=e128]: "Because, unless I am admitted, it is not my will to enter: on the contrary, my will is simply that which comes to pass. For I esteem what God wills better than what I will. To Him will I cleave as His minister and attendant; having the same movements, the same desires, in a word the same Will as He. There is no such thing as being shut out for me, but only for them that would force their way in."
      - heading "CLIII" [level=3] [ref=e129]
      - paragraph [ref=e130]: But what says Socrates?—"One man finds pleasure in improving his land, another his horses. My pleasure lies in seeing that I myself grow better day by day."
      - heading "CLIV" [level=3] [ref=e131]
      - paragraph [ref=e132]: The dress is suited to the craft; the craftsman takes his name from the craft, not from the dress. For this reason Euphrates was right in saying, "I long endeavoured to conceal my following the philosophic life; and this profited me much. In the first place, I knew that what I did aright, I did not for the sake of lookers-on, but for my own. I ate aright—unto myself; I kept the even tenor of my walk, my glance composed and serene—all unto myself and unto God. Then as I fought alone, I was alone in peril. If I did anything amiss or shameful, the cause of Philosophy was not in me endangered; nor did I wrong the multitude by transgressing as a professed philosopher. Wherefore those that knew not my purpose marvelled how it came about, that whilst all my life and conversation was passed with philosophers without exception, I was yet none myself. And what harm that the philosopher should be known by his acts, instead of mere outward signs and symbols?"
      - heading "CLV" [level=3] [ref=e133]
      - paragraph [ref=e134]: "First study to conceal what thou art; seek wisdom a little while unto thyself. Thus grows the fruit; first, the seed must be buried in the earth for a little space; there it must be hid and slowly grow, that it may reach maturity. But if it produce the ear before the jointed stalk, it is imperfect—a thing from the garden of Adonis. Such a sorry growth art thou; thou hast blossomed too soon: the winter cold will wither thee away!"
      - heading "CLVI" [level=3] [ref=e135]
      - paragraph [ref=e136]: "First of all, condemn the life thou art now leading: but when thou hast condemned it, do not despair of thyself—be not like them of mean spirit, who once they have yielded, abandon themselves entirely and as it were allow the torrent to sweep them away. No; learn what the wrestling masters do. Has the boy fallen? \"Rise,\" they say, \"wrestle again, till thy strength come to thee.\" Even thus should it be with thee. For know that there is nothing more tractable than the human soul. It needs but to will, and the thing is done; the soul is set upon the right path: as on the contrary it needs but to nod over the task, and all is lost. For ruin and recovery alike are from within."
      - heading "CLVII" [level=3] [ref=e137]
      - paragraph [ref=e138]: It is the critical moment that shows the man. So when the crisis is upon you, remember that God, like a trainer of wrestlers, has matched you with a rough and stalwart antagonist.—"To what end?" you ask. That you may prove the victor at the Great Games. Yet without toil and sweat this may not be!
      - heading "CLVIII" [level=3] [ref=e139]
      - paragraph [ref=e140]: If thou wouldst make progress, be content to seem foolish and void of understanding with respect to outward things. Care not to be thought to know anything. If any should make account of thee, distrust thyself.
      - heading "CLIX" [level=3] [ref=e141]
      - paragraph [ref=e142]: Remember that in life thou shouldst order thy conduct as at a banquet. Has any dish that is being served reached thee? Stretch forth thy hand and help thyself modestly. Doth it pass thee by? Seek not to detain it. Has it not yet come? Send not forth thy desire to meet it, but wait until it reaches thee. Deal thus with children, thus with wife; thus with office, thus with wealth—and one day thou wilt be meet to share the Banquets of the Gods. But if thou dost not so much as touch that which is placed before thee, but despisest it, then shalt thou not only share the Banquets of the Gods, but their Empire also.
      - heading "CLX" [level=3] [ref=e143]
      - paragraph [ref=e144]: "Remember that thou art an actor in a play, and of such sort as the Author chooses, whether long or short. If it be his good pleasure to assign thee the part of a beggar, a ruler, or a simple citizen, thine it is to play it fitly. For thy business is to act the part assigned thee, well: to choose it, is another's."
      - heading "CLXI" [level=3] [ref=e145]
      - paragraph [ref=e146]: Keep death and exile daily before thine eyes, with all else that men deem terrible, but more especially Death. Then wilt thou never think a mean though, nor covet anything beyond measure.
      - heading "CLXII" [level=3] [ref=e147]
      - paragraph [ref=e148]: As a mark is not set up in order to be missed, so neither is such a thing as natural evil produced in the World.
      - heading "CLXIII" [level=3] [ref=e149]
      - paragraph [ref=e150]: Piety toward the Gods, to be sure, consists chiefly in thinking rightly concerning them—that they are, and that they govern the Universe with goodness and justice; and that thou thyself art appointed to obey them, and to submit under all circumstances that arise; acquiescing cheerfully in whatever may happen, sure it is brought to pass and accomplished by the most Perfect Understanding. Thus thou wilt never find fault with the Gods, nor charge them with neglecting thee.
      - heading "CLXIV" [level=3] [ref=e151]
      - paragraph [ref=e152]: Lose no time in setting before you a certain stamp of character and behaviour both when by yourself and in company with others. Let silence be your general rule; or say only what is necessary and in few words. We shall, however, when occasion demands, enter into discourse sparingly. avoiding common topics as gladiators, horse-races, athletes; and the perpetual talk about food and drink. Above all avoid speaking of persons, either in way of praise or blame, or comparison.
      - paragraph [ref=e153]: If you can, win over the conversation of your company to what it should be by your own. But if you find yourself cut off without escape among strangers and aliens, be silent.
      - heading "CLXV" [level=3] [ref=e154]
      - paragraph [ref=e155]: Laughter should not be much, nor frequent, nor unrestrained.
      - heading "CLXVI" [level=3] [ref=e156]
      - paragraph [ref=e157]: Refuse altogether to take an oath if you can, if not, as far as may be.
      - heading "CLXVII" [level=3] [ref=e158]
      - paragraph [ref=e159]: Banquets of the unlearned and of them that are without, avoid. But if you have occasion to take part in them, let not your attention be relaxed for a moment, lest you slip after all into evil ways. For you may rest assured that be a man ever so pure himself, he cannot escape defilement if his associates are impure.
      - heading "CLXVIII" [level=3] [ref=e160]
      - paragraph [ref=e161]: Take what relates to the body as far as the bare use warrants—as meat, drink, raiment, house and servants. But all that makes for show and luxury reject.
      - heading "CLXIX" [level=3] [ref=e162]
      - paragraph [ref=e163]: If you are told that such an one speaks ill of you, make no defence against what was said, but answer, He surely knew not my other faults, else he would not have mentioned these only!
      - heading "CLXX" [level=3] [ref=e164]
      - paragraph [ref=e165]: "When you visit any of those in power, bethink yourself that you will not find him in: that you may not be admitted: that the door may be shut in your face: that he may not concern himself about you. If with all this, it is your duty to go, bear what happens, and never say to yourself, It was not worth the trouble! For that would smack of the foolish and unlearned who suffer outward things to touch them."
      - heading "CLXXI" [level=3] [ref=e166]
      - paragraph [ref=e167]: "In company avoid frequent and undue talk about your own actions and dangers. However pleasant it may be to you to enlarge upon the risks you have run, others may not find such pleasure in listening to your adventures. Avoid provoking laughter also: it is a habit from which one easily slides into the ways of the foolish, and apt to diminish the respect which your neighbors feel for you. To border on coarse talk is also dangerous. On such occasions, if a convenient opportunity offer, rebuke the speaker. If not, at least by relapsing into silence, colouring, and looking annoyed, show that you are displeased with the subject."
      - heading "CLXXII" [level=3] [ref=e168]
      - paragraph [ref=e169]: When you have decided that a thing ought to be done, and are doing it, never shun being seen doing it, even though the multitude should be likely to judge the matter amiss. For if you are not acting rightly, shun the act itself; if rightly, however, why fear misplaced censure?
      - heading "CLXXIII" [level=3] [ref=e170]
      - paragraph [ref=e171]: It stamps a man of mean capacity to spend much time on the things of the body, as to be long over bodily exercises, long over eating, long over drinking, long over other bodily functions. Rather should these things take the second place, while all your care is directed to the understanding.
      - heading "CLXXIV" [level=3] [ref=e172]
      - paragraph [ref=e173]: "Everything has two handles, one by which it may be borne, the other by which it may not. If your brother sin against you lay not hold of it by the handle of injustice, for by that it may not be borne: but rather by this, that he is your brother, the comrade of your youth; and thus you will lay hold on it so that it may be borne."
      - heading "CLXXV" [level=3] [ref=e174]
      - paragraph [ref=e175]: Never call yourself a Philosopher nor talk much among the unlearned about Principles, but do that which follows from them. Thus at a banquet, do not discuss how people ought to eat; but eat as you ought. Remember that Socrates thus entirely avoided ostentation. Men would come to him desiring to be recommended to philosophers, and he would conduct them thither himself—so well did he bear being overlooked. Accordingly if any talk concerning principles should arise among the unlearned, be you for the most part silent. For you run great risk of spewing up what you have ill digested. And when a man tells you that you know nothing and you are not nettled at it, then you may be sure that you have begun the work.
      - heading "CLXXVI" [level=3] [ref=e176]
      - paragraph [ref=e177]: When you have brought yourself to supply the needs of the body at small cost, do not pique yourself on that, nor if you drink only water, keep saying on each occasion, I drink water! And if you ever want to practise endurance and toil, do so unto yourself and not unto others—do not embrace statues!
      - heading "CLXXVII" [level=3] [ref=e178]
      - paragraph [ref=e179]: When a man prides himself on being able to understand and interpret the writings of Chrysippus, say to yourself:—
      - paragraph [ref=e180]: If Chrysippus had not written obscurely, this fellow would have had nothing to be proud of. But what is it that I desire? To understand Nature, and to follow her! Accordingly I ask who is the Interpreter. On hearing that it is Chrysippus, I go to him. But it seems I do not understand what he wrote. So I seek one to interpret that. So far there is nothing to pride myself on. But when I have found my interpreter, what remains is to put in practice his instructions. This itself is the only thing to be proud of. But if I admire the interpretation and that alone, what else have I turned out but a mere commentator instead of a lover of wisdom?—except indeed that I happen to be interpreting Chrysippus instead of Homer. So when any one says to me, Prithee, read me Chrysippus, I am more inclined to blush, when I cannot show my deeds to be in harmony and accordance with his sayings.
      - heading "CLXXVIII" [level=3] [ref=e181]
      - paragraph [ref=e182]: At feasts, remember that you are entertaining two guests, body and soul. What you give to the body, you presently lose; what you give to the soul, you keep for ever.
      - heading "CLXXIX" [level=3] [ref=e183]
      - paragraph [ref=e184]: At meals, see to it that those who serve be not more in number than those who are served. It is absurd for a crowd of persons to be dancing attendance on half a dozen chairs.
      - heading "CLXXX" [level=3] [ref=e185]
      - paragraph [ref=e186]: It is best to share with your attendants what is going forward, both in the labour of preparation and in the enjoyment of the feast itself. If such a thing be difficult at the time, recollect that you who are not weary are being served by those that are; you who are eating and drinking by those who do neither; you who are talking by those who are silent; you who are at ease by those who are under constraint. Thus no sudden wrath will betray you into unreasonable conduct, nor will you behave harshly by irritating another.
      - heading "CLXXXI" [level=3] [ref=e187]
      - paragraph [ref=e188]: When Xanthippe was chiding Socrates for making scanty preparation for entertaining his friends, he answered:—"If they are friends of ours they will not care for that; if they are not, we shall care nothing for them!"
      - heading "CLXXXII" [level=3] [ref=e189]
      - paragraph [ref=e190]: Asked, Who is the rich man? Epictetus replied, "He who is content."
      - heading "CLXXXIII" [level=3] [ref=e191]
      - paragraph [ref=e192]: "Favorinus tells us how Epictetus would also say that there were two faults far graver and fouler than any others—inability to bear, and inability to forbear, when we neither patiently bear the blows that must be borne, nor abstain from the things and the pleasures we ought to abstain from. \"So,\" he went on, \"if a man will only have these two words at heart, and heed them carefully by ruling and watching over himself, he will for the most part fall into no sin, and his life will be tranquil and serene.\" He meant the words [Greek: Anechou kai apechou ]—\"Bear and Forbear.\""
      - heading "CLXXXIV" [level=3] [ref=e193]
      - paragraph [ref=e194]: On all occasions these thoughts should be at hand:—
      - paragraph [ref=e195]: Lead me, O God, and Thou, O Destiny
      - paragraph [ref=e196]: Be what it may the goal appointed me,
      - paragraph [ref=e197]: Bravely I'll follow; nay, and if I would not,
      - paragraph [ref=e198]: I'd prove a coward, yet must follow still!
      - paragraph [ref=e199]: "Again:"
      - paragraph [ref=e200]: Who to Necessity doth bow aright,
      - paragraph [ref=e201]: Is learn'd in wisdom and the things of God.
      - paragraph [ref=e202]: Once more:—
      - paragraph [ref=e203]: Crito, if this be God's will, so let it be. As for me,
      - paragraph [ref=e204]: Anytus and Meletus can indeed put me to death, but injure me, never!
      - heading "CLXXXV" [level=3] [ref=e205]
      - paragraph [ref=e206]: We shall then be like Socrates, when we can indite hymns of praise to the Gods in prison.
      - heading "CLXXXVI" [level=3] [ref=e207]
      - paragraph [ref=e208]: "It is hard to combine and unite these two qualities, the carefulness of one who is affected by circumstances, and the intrepidity of one who heeds them not. But it is not impossible: else were happiness also impossible. We should act as we do in seafaring."
      - paragraph [ref=e209]: "\"What can I do?\"—Choose the master, the crew, the day, the opportunity. Then comes a sudden storm. What matters it to me? my part has been fully done. The matter is in the hands of another—the Master of the ship. The ship is foundering. What then have I to do? I do the only thing that remains to me—to be drowned without fear, without a cry, without upbraiding God, but knowing that what has been born must likewise perish. For I am not Eternity, but a human being—a part of the whole, as an hour is part of the day. I must come like the hour, and like the hour must pass!"
      - heading "CLXXXVII" [level=3] [ref=e210]
      - paragraph [ref=e211]: And now we are sending you to Rome to spy out the land; but none send a coward as such a spy, that, if he hear but a noise and see a shadow moving anywhere, loses his wits and comes flying to say, The enemy are upon us!
      - paragraph [ref=e212]: "So if you go now, and come and tell us: \"Everything at Rome is terrible: Death is terrible, Exile is terrible, Slander is terrible, Want is terrible; fly, comrades! the enemy are upon us!\" we shall reply, Get you gone, and prophesy to yourself! we have but erred in sending such a spy as you. Diogenes, who was sent as a spy long before you, brought us back another report than this. He says that Death is no evil; for it need not even bring shame with it. He says that Fame is but the empty noise of madmen. And what report did this spy bring us of Pain, what of Pleasure, what of Want? That to be clothed in sackcloth is better than any purple robe; that sleeping on the bare ground is the softest couch; and in proof of each assertion he points to his own courage, constancy, and freedom; to his own healthy and muscular frame. \"There is no enemy near,\" he cries, \"all is perfect peace!\""
      - heading "CLXXXVIII" [level=3] [ref=e213]
      - paragraph [ref=e214]: "If a man has this peace—not the peace proclaimed by Caesar (how indeed should he have it to proclaim?), nay, but the peace proclaimed by God through reason, will not that suffice him when alone, when he beholds and reflects:—Now can no evil happen unto me; for me there is no robber, for me no earthquake; all things are full of peace, full of tranquillity; neither highway nor city nor gathering of men, neither neighbor nor comrade can do me hurt. Another supplies my food, whose care it is; another my raiment; another hath given me perceptions of sense and primary conceptions. And when He supplies my necessities no more, it is that He is sounding the retreat, that He hath opened the door, and is saying to thee, Come!—Wither? To nought that thou needest fear, but to the friendly kindred elements whence thou didst spring. Whatsoever of fire is in thee, unto fire shall return; whatsoever of earth, unto earth; of spirit, unto spirit; of water, unto water. There is no Hades, no fabled rivers of Sighs, of Lamentation, or of Fire: but all things are full of Beings spiritual and divine. With thoughts like these, beholding the Sun, Moon, and Stars, enjoying earth and sea, a man is neither helpless nor alone!"
      - heading "CLXXXIX" [level=3] [ref=e215]
      - paragraph [ref=e216]: What wouldst thou be found doing when overtaken by Death? If I might choose, I would be found doing some deed of true humanity, of wide import, beneficent and noble. But if I may not be found engaged in aught so lofty, let me hope at least for this—what none may hinder, what is surely in my power—that I may be found raising up in myself that which had fallen; learning to deal more wisely with the things of sense; working out my own tranquillity, and thus rendering that which is its due to every relation of life. . . .
      - paragraph [ref=e217]: "If death surprise me thus employed, it is enough if I can stretch forth my hands to God and say, \"The faculties which I received at Thy hands for apprehending this thine Administration, I have not neglected. As far as in me lay, I have done Thee no dishonour. Behold how I have used the senses, the primary conceptions which Thou gavest me. Have I ever laid anything to Thy charge? Have I ever murmured at aught that came to pass, or wished it otherwise? Have I in anything transgressed the relations of life? For that Thou didst beget me, I thank Thee for that Thou hast given: for the time during which I have used the things that were Thine, it suffices me. Take them back and place them wherever Thou wilt! They were all Thine, and Thou gavest them me.\"—If a man depart thus minded, is it not enough? What life is fairer and more noble, what end happier than his?"
  - contentinfo [ref=e218]:
    - link "Data Protection Policy" [ref=e220] [cursor=pointer]:
      - /url: "#"
    - generic [ref=e221]:
      - text: Copyright © 2026
      - link "The Aurelius Fund" [ref=e222] [cursor=pointer]:
        - /url: "#"
      - text: "| All Rights Reserved"
```

# Test source

```ts
  177 |         await expect(page.locator('#modal')).toBeVisible();
  178 |         await expect(page.locator('#modal-title')).toHaveText(/meditations/i);
  179 |         // Meditations starts with Book I
  180 |         await expect(page.locator('#modal-body')).toContainText('Book I', { timeout: 15000 });
  181 |     });
  182 | 
  183 |     test('clicking Random Quote keeps the app functional', async ({ page }) => {
  184 |         await page.locator('#menu-open-button').click();
  185 |         await page.locator('#menu a', { hasText: 'Random Quote' }).click();
  186 |         // App should still show a quote after random selection
  187 |         await expect(page.locator('#quote a')).toBeVisible();
  188 |         await expect(page.locator('#citation')).not.toBeEmpty();
  189 |     });
  190 | 
  191 |     test('clicking outside the menu (overlay) closes it', async ({ page }) => {
  192 |         await page.locator('#menu-open-button').click();
  193 |         await expect(page.locator('#menu')).toBeVisible();
  194 |         await page.locator('#overlay').click();
  195 |         await expect(page.locator('#menu')).not.toBeVisible();
  196 |     });
  197 | });
  198 | 
  199 | // ── readability / CSS ─────────────────────────────────────────────────────────
  200 | 
  201 | test.describe('Readability', () => {
  202 |     test.beforeEach(async ({ page }) => {
  203 |         await waitForQuote(page);
  204 |         await openWorkModal(page);
  205 |     });
  206 | 
  207 |     test('modal body paragraphs have a readable font size (≥18px)', async ({ page }) => {
  208 |         const para = page.locator('#modal-body p').first();
  209 |         // Wait for at least one paragraph to appear (double-RAF + lazy network load)
  210 |         await expect(para).toBeVisible({ timeout: 15000 });
  211 |         const fontSize = await para.evaluate(el =>
  212 |             parseFloat(getComputedStyle(el).fontSize)
  213 |         );
  214 |         expect(fontSize).toBeGreaterThanOrEqual(18);
  215 |     });
  216 | 
  217 |     test('modal body paragraphs have comfortable line height (≥26px)', async ({ page }) => {
  218 |         const para = page.locator('#modal-body p').first();
  219 |         await expect(para).toBeVisible({ timeout: 15000 });
  220 |         const lineHeight = await para.evaluate(el =>
  221 |             parseFloat(getComputedStyle(el).lineHeight)
  222 |         );
  223 |         expect(lineHeight).toBeGreaterThanOrEqual(26);
  224 |     });
  225 | 
  226 |     test('modal content is wider than 600px on desktop', async ({ page }) => {
  227 |         // Only relevant on wider viewports
  228 |         const viewport = page.viewportSize();
  229 |         if (viewport && viewport.width < 700) test.skip();
  230 | 
  231 |         const modalWidth = await page.locator('#modal-content').evaluate(el =>
  232 |             el.getBoundingClientRect().width
  233 |         );
  234 |         expect(modalWidth).toBeGreaterThan(600);
  235 |     });
  236 | 
  237 |     test('fullscreen two-column layout is suppressed on narrow viewport', async ({ page }) => {
  238 |         await page.setViewportSize({ width: 375, height: 812 });
  239 |         await page.locator('#modal-fullscreen').click();
  240 |         await expect(page.locator('#modal-content')).toHaveClass(/fullscreen/);
  241 | 
  242 |         const columnCount = await page.locator('#modal-body').evaluate(el =>
  243 |             getComputedStyle(el).columnCount
  244 |         );
  245 |         // On a narrow viewport the column-count override kicks in
  246 |         expect(columnCount).toBe('1');
  247 |     });
  248 | });
  249 | 
  250 | // ── visual snapshots ──────────────────────────────────────────────────────────
  251 | // These capture the UI at key breakpoints for manual review.
  252 | // On first run, use `npm run test:update-snapshots` to create the baselines.
  253 | 
  254 | test.describe('Visual snapshots', () => {
  255 |     test('quote page at desktop viewport', async ({ page }) => {
  256 |         await page.setViewportSize({ width: 1440, height: 900 });
  257 |         await waitForQuote(page);
  258 |         await expect(page).toHaveScreenshot('quote-desktop.png', { maxDiffPixels: 200 });
  259 |     });
  260 | 
  261 |     test('quote page at tablet viewport', async ({ page }) => {
  262 |         await page.setViewportSize({ width: 768, height: 1024 });
  263 |         await waitForQuote(page);
  264 |         await expect(page).toHaveScreenshot('quote-tablet.png', { maxDiffPixels: 200 });
  265 |     });
  266 | 
  267 |     test('quote page at mobile viewport', async ({ page }) => {
  268 |         await page.setViewportSize({ width: 375, height: 812 });
  269 |         await waitForQuote(page);
  270 |         await expect(page).toHaveScreenshot('quote-mobile.png', { maxDiffPixels: 200 });
  271 |     });
  272 | 
  273 |     test('work modal at desktop viewport', async ({ page }) => {
  274 |         await page.setViewportSize({ width: 1440, height: 900 });
  275 |         await waitForQuote(page);
  276 |         await openWorkModal(page);
> 277 |         await expect(page).toHaveScreenshot('modal-desktop.png', { maxDiffPixels: 200 });
      |                            ^ Error: expect(page).toHaveScreenshot(expected) failed
  278 |     });
  279 | 
  280 |     test('work modal at mobile viewport', async ({ page }) => {
  281 |         await page.setViewportSize({ width: 375, height: 812 });
  282 |         await waitForQuote(page);
  283 |         await openWorkModal(page);
  284 |         await expect(page).toHaveScreenshot('modal-mobile.png', { maxDiffPixels: 200 });
  285 |     });
  286 | });
  287 | 
```