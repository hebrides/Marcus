# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: stoic-reader.spec.js >> Visual snapshots >> work modal at mobile viewport
- Location: stoic-reader.spec.js:280:5

# Error details

```
Error: expect(page).toHaveScreenshot(expected) failed

  13712 pixels (ratio 0.05 of all image pixels) are different.

  Snapshot: modal-mobile.png

Call log:
  - Expect "toHaveScreenshot(modal-mobile.png)" with timeout 10000ms
    - verifying given screenshot expectation
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - 13712 pixels (ratio 0.05 of all image pixels) are different.
  - waiting 100ms before taking screenshot
  - taking page screenshot
    - disabled all CSS animations
  - waiting for fonts to load...
  - fonts loaded
  - captured a stable screenshot
  - 13712 pixels (ratio 0.05 of all image pixels) are different.

```

# Page snapshot

```yaml
- generic [ref=e1]:
  - banner [ref=e2]:
    - img "The Stoic Reader" [ref=e3]
    - generic [ref=e4] [cursor=pointer]: ✶
  - main [ref=e5]:
    - generic [ref=e6]:
      - paragraph [ref=e7]:
        - link "Seek then the real nature of the Good in that without whose presence thou wilt not admit the Good to exist in aught else.—What then? Are not these other things also works of God?—They are; but not preferred to honour, nor are they portions of God. But thou art a thing preferre..." [active] [ref=e8] [cursor=pointer]:
          - /url: "#"
      - paragraph [ref=e9]:
        - text: ~
        - link "Epictetus" [ref=e10] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "The Golden Sayings" [ref=e11] [cursor=pointer]:
          - /url: "#"
        - text: ","
        - link "Section 60" [ref=e12] [cursor=pointer]:
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
      - heading "I" [level=3] [ref=e27]
      - paragraph [ref=e28]: Are these the only works of Providence within us? What words suffice to praise or set them forth? Had we but understanding, should we ever cease hymning and blessing the Divine Power, both openly and in secret, and telling of His gracious gifts? Whether digging or ploughing or eating, should we not sing the hymn to God:—
      - paragraph [ref=e29]: "Great is God, for that He hath given us such instruments to till the ground withal: Great is God, for that He hath given us hands and the power of swallowing and digesting; of unconsciously growing and breathing while we sleep!"
      - paragraph [ref=e30]: Thus should we ever have sung; yea and this, the grandest and divinest hymn of all:—
      - paragraph [ref=e31]: Great is God, for that He hath given us a mind to apprehend these things, and duly to use them!
      - paragraph [ref=e32]: "What then! seeing that most of you are blinded, should there not be some one to fill this place, and sing the hymn to God on behalf of all men? What else can I that am old and lame do but sing to God? Were I a nightingale, I should do after the manner of a nightingale. Were I a swan, I should do after the manner of a swan. But now, since I am a reasonable being, I must sing to God: that is my work: I do it, nor will I desert this my post, as long as it is granted me to hold it; and upon you too I call to join in this self-same hymn."
      - heading "II" [level=3] [ref=e33]
      - paragraph [ref=e34]: How then do men act? As though one returning to his country who had sojourned for the night in a fair inn, should be so captivated thereby as to take up his abode there.
      - paragraph [ref=e35]: "\"Friend, thou hast forgotten thine intention! This was not thy destination, but only lay on the way thither.\""
      - paragraph [ref=e36]: "\"Nay, but it is a proper place.\""
      - paragraph [ref=e37]: "\"And how many more of the sort there may be; only to pass through upon thy way! Thy purpose was to return to thy country; to relieve thy kinsmen's fears for thee; thyself to discharge the duties of a citizen; to marry a wife, to beget offspring, and to fill the appointed round of office. Thou didst not come to choose out what places are most pleasant; but rather to return to that wherein thou wast born and where wert appointed to be a citizen.\""
      - heading "III" [level=3] [ref=e38]
      - paragraph [ref=e39]: Try to enjoy the great festival of life with other men.
      - heading "IV" [level=3] [ref=e40]
      - paragraph [ref=e41]: "But I have one whom I must please, to whom I must be subject, whom I must obey:—God, and those who come next to Him. He hath entrusted me with myself: He hath made my will subject to myself alone and given me rules for the right use thereof."
      - heading "V" [level=3] [ref=e42]
      - paragraph [ref=e43]: "Rufus used to say, If you have leisure to praise me, what I say is naught. In truth he spoke in such wise, that each of us who sat there, though that some one had accused him to Rufus:—so surely did he lay his finger on the very deeds we did: so surely display the faults of each before his very eyes."
      - heading "VI" [level=3] [ref=e44]
      - paragraph [ref=e45]: But what saith God?—"Had it been possible, Epictetus, I would have made both that body of thine and thy possessions free and unimpeded, but as it is, be not deceived:—it is not thine own; it is but finely tempered clay. Since then this I could not do, I have given thee a portion of Myself, in the power of desiring and declining and of pursuing and avoiding, and in a word the power of dealing with the things of sense. And if thou neglect not this, but place all that thou hast therein, thou shalt never be let or hindered; thou shalt never lament; thou shalt not blame or flatter any. What then? Seemeth this to thee a little thing?"—God forbid!—"Be content then therewith!"
      - paragraph [ref=e46]: And so I pray the Gods.
      - heading "VII" [level=3] [ref=e47]
      - paragraph [ref=e48]: What saith Antisthenes? Hast thou never heard?— It is a kingly thing, O Cyrus, to do well and to be evil spoken of.
      - heading "VIII" [level=3] [ref=e49]
      - paragraph [ref=e50]: "\"Aye, but to debase myself thus were unworthy of me.\""
      - paragraph [ref=e51]: "\"That,\" said Epictetus, \"is for you to consider, not for me. You know yourself what you are worth in your own eyes; and at what price you will sell yourself. For men sell themselves at various prices. This was why, when Florus was deliberating whether he should appear at Nero's shows, taking part in the performance himself, Agrippinus replied, 'But why do not you appear?' he answered, 'Because I do not even consider the question.' For the man who has once stooped to consider such questions, and to reckon up the value of external things, is not far from forgetting what manner of man he is. Why, what is it that you ask me? Is death preferable, or life? I reply, Life. Pain or pleasure? I reply, Pleasure.\""
      - paragraph [ref=e52]: "\"Well, but if I do not act, I shall lose my head.\""
      - paragraph [ref=e53]: "\"Then go and act! But for my part I will not act.\""
      - paragraph [ref=e54]: "\"Why?\""
      - paragraph [ref=e55]: "\"Because you think yourself but one among the many threads which make up the texture of the doublet. You should aim at being like men in general—just as your thread has no ambition either to be anything distinguished compared with the other threads. But I desire to be the purple—that small and shining part which makes the rest seem fair and beautiful. Why then do you bid me become even as the multitude? Then were I no longer the purple.\""
      - heading "IX" [level=3] [ref=e56]
      - paragraph [ref=e57]: "If a man could be thoroughly penetrated, as he ought, with this thought, that we are all in an especial manner sprung from God, and that God is the Father of men as well as of Gods, full surely he would never conceive aught ignoble or base of himself. Whereas if Caesar were to adopt you, your haughty looks would be intolerable; will you not be elated at knowing that you are the son of God? Now however it is not so with us: but seeing that in our birth these two things are commingled—the body which we share with the animals, and the Reason and Thought which we share with the Gods, many decline towards this unhappy kinship with the dead, few rise to the blessed kinship with the Divine. Since then every one must deal with each thing according to the view which he forms about it, those few who hold that they are born for fidelity, modesty, and unerring sureness in dealing with the things of sense, never conceive aught base or ignoble of themselves: but the multitude the contrary. Why, what am I?—A wretched human creature; with this miserable flesh of mine. Miserable indeed! but you have something better than that paltry flesh of yours. Why then cling to the one, and neglect the other?"
      - heading "X" [level=3] [ref=e58]
      - paragraph [ref=e59]: Thou art but a poor soul laden with a lifeless body.
      - heading "XI" [level=3] [ref=e60]
      - paragraph [ref=e61]: The other day I had an iron lamp placed beside my household gods. I heard a noise at the door and on hastening down found my lamp carried off. I reflected that the culprit was in no very strange case. "Tomorrow, my friend," I said, "you will find an earthenware lamp; for a man can only lose what he has."
      - heading "XII" [level=3] [ref=e62]
      - paragraph [ref=e63]: "The reason why I lost my lamp was that the thief was superior to me in vigilance. He paid however this price for the lamp, that in exchange for it he consented to become a thief: in exchange for it, to become faithless."
      - heading "XIII" [level=3] [ref=e64]
      - paragraph [ref=e65]: "But God hath introduced Man to be a spectator of Himself and of His works; and not a spectator only, but also an interpreter of them. Wherefore it is a shame for man to begin and to leave off where the brutes do. Rather he should begin there, and leave off where Nature leaves off in us: and that is at contemplation, and understanding, and a manner of life that is in harmony with herself."
      - paragraph [ref=e66]: See then that ye die not without being spectators of these things.
      - heading "XIV" [level=3] [ref=e67]
      - paragraph [ref=e68]: You journey to Olympia to see the work of Phidias; and each of you holds it a misfortune not to have beheld these things before you die. Whereas when there is no need even to take a journey, but you are on the spot, with the works before you, have you no care to contemplate and study these?
      - paragraph [ref=e69]: "Will you not then perceive either who you are or unto what end you were born: or for what purpose the power of contemplation has been bestowed on you?"
      - paragraph [ref=e70]: "\"Well, but in life there are some things disagreeable and hard to bear.\""
      - paragraph [ref=e71]: And are there none at Olympia? Are you not scorched by the heat? Are you not cramped for room? Have you not to bathe with discomfort? Are you not drenched when it rains? Have you not to endure the clamor and shouting and such annoyances as these? Well, I suppose you set all this over against the splendour of the spectacle and bear it patiently. What then? have you not received greatness of heart, received courage, received fortitude? What care I, if I am great of heart, for aught that can come to pass? What shall cast me down or disturb me? What shall seem painful? Shall I not use the power to the end for which I received it, instead of moaning and wailing over what comes to pass?
      - heading "XV" [level=3] [ref=e72]
      - paragraph [ref=e73]: If what philosophers say of the kinship of God and Man be true, what remains for men to do but as Socrates did:—never, when asked one's country, to answer, "I am an Athenian or a Corinthian," but "I am a citizen of the world."
      - heading "XVI" [level=3] [ref=e74]
      - paragraph [ref=e75]: "He that hath grasped the administration of the World, who hath learned that this Community, which consists of God and men, is the foremost and mightiest and most comprehensive of all:—that from God have descended the germs of life, not to my father only and father's father, but to all things that are born and grow upon the earth, and in an especial manner to those endowed with Reason (for those only are by their nature fitted to hold communion with God, being by means of Reason conjoined with Him)—why should not such an one call himself a citizen of the world? Why not a son of God? Why should he fear aught that comes to pass among men? Shall kinship with Caesar, or any other of the great at Rome, be enough to hedge men around with safety and consideration, without a thought of apprehension: while to have God for our Maker, and Father, and Kinsman, shall not this set us free from sorrows and fears?"
      - heading "XVII" [level=3] [ref=e76]
      - paragraph [ref=e77]: "I do not think that an old fellow like me need have been sitting here to try and prevent your entertaining abject notions of yourselves, and talking of yourselves in an abject and ignoble way: but to prevent there being by chance among you any such young men as, after recognising their kindred to the Gods, and their bondage in these chains of the body and its manifold necessities, should desire to cast them off as burdens too grievous to be borne, and depart their true kindred. This is the struggle in which your Master and Teacher, were he worthy of the name, should be engaged. You would come to me and say: \"Epictetus, we can no longer endure being chained to this wretched body, giving food and drink and rest and purification: aye, and for its sake forced to be subservient to this man and that. Are these not things indifferent and nothing to us? Is it not true that death is no evil? Are we not in a manner kinsmen of the Gods, and have we not come from them? Let us depart thither, whence we came: let us be freed from these chains that confine and press us down. Here are thieves and robbers and tribunals: and they that are called tyrants, who deem that they have after a fashion power over us, because of the miserable body and what appertains to it. Let us show them that they have power over none.\""
      - heading "XVIII" [level=3] [ref=e78]
      - paragraph [ref=e79]: And to this I reply:—
      - paragraph [ref=e80]: "\"Friends, wait for God. When He gives the signal, and releases you from this service, then depart to Him. But for the present, endure to dwell in the place wherein He hath assigned you your post. Short indeed is the time of your habitation therein, and easy to those that are minded. What tyrant, what robber, what tribunals have any terrors for those who thus esteem the body and all that belong to it as of no account? Stay; depart not rashly hence!\""
      - heading "XIX" [level=3] [ref=e81]
      - paragraph [ref=e82]: "Something like that is what should pass between a teacher and ingenuous youths. As it is, what does pass? The teacher is a lifeless body, and you are lifeless bodies yourselves. When you have had enough to eat today, you sit down and weep about tomorrow's food. Slave! if you have it, well and good; if not, you will depart: the door is open—why lament? What further room is there for tears? What further occasion for flattery? Why should one envy another? Why should you stand in awe of them that have much or are placed in power, especially if they be also strong and passionate? Why, what should they do to us? What they can do, we will not regard: what does concern us, that they cannot do. Who then shall rule one that is thus minded?"
      - heading "XX" [level=3] [ref=e83]
      - paragraph [ref=e84]: Seeing this then, and noting well the faculties which you have, you should say,—"Send now, O God, any trial that Thou wilt; lo, I have means and powers given me by Thee to acquit myself with honour through whatever comes to pass!"—No; but there you sit, trembling for fear certain things should come to pass, and moaning and groaning and lamenting over what does come to pass. And then you upbraid the Gods. Such meanness of spirit can have but one result—impiety.
      - paragraph [ref=e85]: Yet God has not only given us these faculties by means of which we may bear everything that comes to pass without being crushed or depressed thereby; but like a good King and Father, He has given us this without let or hindrance, placed wholly at our own disposition, without reserving to Himself any power of impediment or restraint. Though possessing all these things free and all you own, you do not use them! you do not perceive what it is you have received nor whence it comes, but sit moaning and groaning; some of you blind to the Giver, making no acknowledgment to your Benefactor; others basely giving themselves to complaints and accusations against God.
      - paragraph [ref=e86]: Yet what faculties and powers you possess for attaining courage and greatness of heart, I can easily show you; what you have for upbraiding and accusation, it is for you to show me!
      - heading "XXI" [level=3] [ref=e87]
      - paragraph [ref=e88]: How did Socrates bear himself in this regard? How else than as became one who was fully assured that he was the kinsman of Gods?
      - heading "XXII" [level=3] [ref=e89]
      - paragraph [ref=e90]: If God had made that part of His own nature which He severed from Himself and gave to us, liable to be hindered or constrained either by Himself or any other, He would not have been God, nor would He have been taking care of us as He ought . . . . If you choose, you are free; if you choose, you need blame no man—accuse no man. All things will be at once according to your mind and according to the Mind of God.
      - heading "XXIII" [level=3] [ref=e91]
      - paragraph [ref=e92]: Petrifaction is of two sorts. There is petrifaction of the understanding; and also of the sense of shame. This happens when a man obstinately refuses to acknowledge plain truths, and persists in maintaining what is self-contradictory. Most of us dread mortification of the body, and would spare no pains to escape anything of that kind. But of mortification of the soul we are utterly heedless. With regard, indeed, to the soul, if a man is in such a state as to be incapable of following or understanding anything, I grant you we do think him in a bad way. But mortification of the sense of shame and modesty we go so far as to dub strength of mind!
      - heading "XXIV" [level=3] [ref=e93]
      - paragraph [ref=e94]: If we were as intent upon our business as the old fellows at Rome are upon what interests them, we too might perhaps accomplish something. I know a man older than I am, now Superintendent of the Corn-market at Rome, and I remember when he passed through this place on his way back from exile, what an account he gave me of his former life, declaring that for the future, once home again, his only care should be to pass his remaining years in quiet and tranquility. "For how few years have I left!" he cried. "That," I said, "you will not do; but the moment the scent of Rome is in your nostrils, you will forget it all; and if you can but gain admission to Court, you will be glad enough to elbow your way in, and thank God for it." "Epictetus," he replied, "if ever you find me setting as much as one foot within the Court, think what you will of me."
      - paragraph [ref=e95]: Well, as it was, what did he do? Ere ever he entered the city, he was met by a despatch from the Emperor. He took it, and forgot the whole of his resolutions. From that moment, he has been piling one thing upon another. I should like to be beside him to remind him of what he said when passing this way, and to add, How much better a prophet I am than you!
      - paragraph [ref=e96]: "What then? do I say man is not made for an active life? Far from it! . . . But there is a great difference between other men's occupations and ours. . . . A glance at theirs will make it clear to you. All day long they do nothing but calculate, contrive, consult how to wring their profit out of food-stuffs, farm-plots and the like. . . . Whereas, I entreat you to learn what the administration of the World is, and what place a Being endowed with reason holds therein: to consider what you are yourself, and wherein your Good and Evil consists."
      - heading "XXV" [level=3] [ref=e97]
      - paragraph [ref=e98]: "A man asked me to write to Rome on his behalf who, as most people thought, had met with misfortune; for having been before wealthy and distinguished, he had afterwards lost all and was living here. So I wrote about him in a humble style. He however on reading the letter returned it to me, with the words: \"I asked for your help, not for your pity. No evil has happened unto me.\""
      - heading "XXVI" [level=3] [ref=e99]
      - paragraph [ref=e100]: True instruction is this:—to learn to wish that each thing should come to pass as it does. And how does it come to pass? As the Disposer has disposed it. Now He has disposed that there should be summer and winter, and plenty and dearth, and vice and virtue, and all such opposites, for the harmony of the whole.
      - heading "XXVII" [level=3] [ref=e101]
      - paragraph [ref=e102]: Have this thought ever present with thee, when thou losest any outward thing, what thou gainest in its stead; and if this be the more precious, say not, I have suffered loss.
      - heading "XXVIII" [level=3] [ref=e103]
      - paragraph [ref=e104]: Concerning the Gods, there are who deny the very existence of the Godhead; others say that it exists, but neither bestirs nor concerns itself nor has forethought for anything. A third party attributes to it existence and forethought, but only for great and heavenly matters, not for anything that is on earth. A fourth party admit things on earth as well as in heaven, but only in general, and not with respect to each individual. A fifth, of whom were Ulysses and Socrates are those that cry:—
      - paragraph [ref=e105]: I move not without Thy knowledge!
      - heading "XXIX" [level=3] [ref=e106]
      - paragraph [ref=e107]: Considering all these things, the good and true man submits his judgment to Him that administers the Universe, even as good citizens to the law of the State. And he that is being instructed should come thus minded:—How may I in all things follow the Gods; and, How may I rest satisfied with the Divine Administration; and, How may I become free? For he is free for whom all things come to pass according to his will, and whom none can hinder. What then, is freedom madness? God forbid. For madness and freedom exist not together.
      - paragraph [ref=e108]: "\"But I wish all that I desire to come to pass and in the manner that I desire.\""
      - paragraph [ref=e109]: —You are mad, you are beside yourself. Know you not that Freedom is a glorious thing and of great worth? But that what I desired at random I should wish at random to come to pass, so far from being noble, may well be exceeding base.
      - heading "XXX" [level=3] [ref=e110]
      - paragraph [ref=e111]: You must know that it is no easy thing for a principle to become a man's own, unless each day he maintain it and hear it maintained, as well as work it out in life.
      - heading "XXXI" [level=3] [ref=e112]
      - paragraph [ref=e113]: "You are impatient and hard to please. If alone, you call it solitude: if in the company of men, you dub them conspirators and thieves, and find fault with your very parents, children, brothers, and neighbours. Whereas when by yourself you should have called it Tranquillity and Freedom: and herein deemed yourself like unto the Gods. And when in the company of many, you should not have called it a wearisome crowd and tumult, but an assembly and a tribunal; and thus accepted all with contentment."
      - heading "XXXII" [level=3] [ref=e114]
      - paragraph [ref=e115]: "What then is the chastisement of those who accept it not? To be as they are. Is any discontented with being alone? let him be in solitude. Is any discontented with his parents? let him be a bad son, and lament. Is any discontented with his children? let him be a bad father.—\"Throw him into prison!\"—What prison?—Where he is already: for he is there against his will; and wherever a man is against his will, that to him is a prison. Thus Socrates was not in prison, since he was there with his own consent."
      - heading "XXXIII" [level=3] [ref=e116]
      - paragraph [ref=e117]: Knowest thou what a speck thou art in comparison with the Universe?—-That is, with respect to the body; since with respect to Reason, thou art not inferior to the Gods, nor less than they. For the greatness of Reason is not measured by length or height, but by the resolves of the mind. Place then thy happiness in that wherein thou art equal to the Gods.
      - heading "XXXIV" [level=3] [ref=e118]
      - paragraph [ref=e119]: Asked how a man might eat acceptably to the Gods, Epictetus replied:—If when he eats, he can be just, cheerful, equable, temperate, and orderly, can he not thus eat acceptably to the Gods? But when you call for warm water, and your slave does not answer, or when he answers brings it lukewarm, or is not even found to be in the house at all, then not to be vexed nor burst with anger, is not that acceptable to the Gods?
      - paragraph [ref=e120]: "\"But how can one endure such people?\""
      - paragraph [ref=e121]: Slave, will you not endure your own brother, that has God to his forefather, even as a son sprung from the same stock, and of the same high descent as yourself? And if you are stationed in a high position, are you therefor forthwith set up for a tyrant? Remember who you are, and whom you rule, that they are by nature your kinsmen, your brothers, the offspring of God.
      - paragraph [ref=e122]: "\"But I paid a price for them, not they for me.\""
      - paragraph [ref=e123]: Do you see whither you are looking—down to the earth, to the pit, to those despicable laws of the dead? But to the laws of the Gods you do not look.
      - heading "XXXV" [level=3] [ref=e124]
      - paragraph [ref=e125]: When we are invited to a banquet, we take what is set before us; and were one to call upon his host to set fish upon the table or sweet things, he would be deemed absurd. Yet in a word, we ask the Gods for what they do not give; and that, although they have given us so many things!
      - heading "XXXVI" [level=3] [ref=e126]
      - paragraph [ref=e127]: Asked how a man might convince himself that every single act of his was under the eye of God, Epictetus answered:—
      - paragraph [ref=e128]: "\"Do you not hold that things on earth and things in heaven are continuous and in unison with each other?\""
      - paragraph [ref=e129]: "\"I do,\" was the reply."
      - paragraph [ref=e130]: "\"Else how should the trees so regularly, as though by God's command, at His bidding flower; at His bidding send forth shoots, bear fruit and ripen it; at His bidding let it fall and shed their leaves, and folded up upon themselves lie in quietness and rest? How else, as the Moon waxes and wanes, as the Sun approaches and recedes, can it be that such vicissitude and alternation is seen in earthly things?"
      - paragraph [ref=e131]: "\"If then all things that grow, nay, our own bodies, are thus bound up with the whole, is not this still truer of our souls? And if our souls are bound up and in contact with God, as being very parts and fragments plucked from Himself, shall He not feel every movement of theirs as though it were His own, and belonging to His own nature?\""
      - heading "XXXVII" [level=3] [ref=e132]
      - paragraph [ref=e133]: "\"But,\" you say, \"I cannot comprehend all this at once.\""
      - paragraph [ref=e134]: "\"Why, who told you that your powers were equal to God's?\""
      - paragraph [ref=e135]: "Yet God hath placed by the side of each a man's own Guardian Spirit, who is charged to watch over him—a Guardian who sleeps not nor is deceived. For to what better or more watchful Guardian could He have committed which of us? So when you have shut the doors and made a darkness within, remember never to say that you are alone; for you are not alone, but God is within, and your Guardian Spirit, and what light do they need to behold what you do? To this God you also should have sworn allegiance, even as soldiers unto Caesar. They, when their service is hired, swear to hold the life of Caesar dearer than all else: and will you not swear your oath, that are deemed worthy of so many and great gifts? And will you not keep your oath when you have sworn it? And what oath will you swear? Never to disobey, never to arraign or murmur at aught that comes to you from His hand: never unwillingly to do or suffer aught that necessity lays upon you."
      - paragraph [ref=e136]: "\"Is this oath like theirs?\""
      - paragraph [ref=e137]: "They swear to hold no other dearer than Caesar: you, to hold our true selves dearer than all else beside."
      - heading "XXXVIII" [level=3] [ref=e138]
      - paragraph [ref=e139]: "\"How shall my brother cease to be wroth with me?\""
      - paragraph [ref=e140]: Bring him to me, and I will tell him. But to thee I have nothing to say about his anger.
      - heading "XXXIX" [level=3] [ref=e141]
      - paragraph [ref=e142]: "When one took counsel of Epictetus, saying, \"What I seek is this, how even though my brother be not reconciled to me, I may still remain as Nature would have me to be,\" he replied: \"All great things are slow of growth; nay, this is true even of a grape or of a fig. If then you say to me now, I desire a fig, I shall answer, It needs time: wait till it first flower, then cast its blossom, then ripen. Whereas then the fruit of the fig-tree reaches not maturity suddenly nor yet in a single hour, do you nevertheless desire so quickly, and easily to reap the fruit of the mind of man?—Nay, expect it not, even though I bade you!\""
      - heading "XL" [level=3] [ref=e143]
      - paragraph [ref=e144]: Epaphroditus had a shoemaker whom he sold as being good-for-nothing. This fellow, by some accident, was afterwards purchased by one of Caesar's men, and became a shoemaker to Caesar. You should have seen what respect Epaphroditus paid him then. "How does the good Felicion? Kindly let me know!" And if any of us inquired, "What is Epaphroditus doing?" the answer was, "He is consulting about so and so with Felicion."—Had he not sold him as good-for-nothing? Who had in a trice converted him into a wiseacre?
      - paragraph [ref=e145]: This is what comes of holding of importance anything but the things that depend on the Will.
      - heading "XLI" [level=3] [ref=e146]
      - paragraph [ref=e147]: What you shun enduring yourself, attempt not to impose on others. You shun slavery—beware of enslaving others! If you can endure to do that, one would think you had been once upon a time a slave yourself. For Vice has nothing in common with virtue, nor Freedom with slavery.
      - heading "XLII" [level=3] [ref=e148]
      - paragraph [ref=e149]: Has a man been raised to tribuneship? Every one that he meets congratulates him. One kisses him on the eyes, another on the neck, while the slaves kiss his hands. He goes home to find torches burning; he ascends to the Capitol to sacrifice.—Who ever sacrificed for having had right desires; for having conceived such inclinations as Nature would have him? In truth we thank the Gods for that wherein we place our happiness.
      - heading "XLIII" [level=3] [ref=e150]
      - paragraph [ref=e151]: A man was talking to me to-day about the priesthood of Augustus. I said to him, "Let the thing go, my good Sir; you will spend a good deal to no purpose."
      - paragraph [ref=e152]: "\"Well, but my name will be inserted in all documents and contracts.\""
      - paragraph [ref=e153]: "\"Will you be standing there to tell those that read them, That is my name written there? And even if you could now be there in every case, what will you do when you are dead?\""
      - paragraph [ref=e154]: "\"At all events my name will remain.\""
      - paragraph [ref=e155]: "\"Inscribe it on a stone and it will remain just as well. And think, beyond Nicopolis what memory of you will there be?\""
      - paragraph [ref=e156]: "\"But I shall have a golden wreath to wear.\""
      - paragraph [ref=e157]: "\"If you must have a wreath, get a wreath of roses and put it on; you will look more elegant!\""
      - heading "XLIV" [level=3] [ref=e158]
      - paragraph [ref=e159]: Above all, remember that the door stands open. Be not more fearful than children; but as they, when they weary of the game, cry, "I will play no more," even so, when thou art in the like case, cry, "I will play no more" and depart. But if thou stayest, make no lamentation.
      - heading "XLV" [level=3] [ref=e160]
      - paragraph [ref=e161]: Is there smoke in the room? If it be slight, I remain; if grievous, I quit it. For you must remember this and hold it fast, that the door stands open.
      - paragraph [ref=e162]: "\"You shall not dwell at Nicopolis!\""
      - paragraph [ref=e163]: Well and good.
      - paragraph [ref=e164]: "\"Nor at Athens.\""
      - paragraph [ref=e165]: Then I will not dwell at Athens either.
      - paragraph [ref=e166]: "\"Nor at Rome.\""
      - paragraph [ref=e167]: Nor at Rome either.
      - paragraph [ref=e168]: "\"You shall dwell in Gyara!\""
      - paragraph [ref=e169]: "Well: but to dwell in Gyara seems to me like a grievous smoke; I depart to a place where none can forbid me to dwell: that habitation is open unto all! As for the last garment of all, that is the poor body; beyond that, none can do aught unto me. This why Demetrius said to Nero: \"You threaten me with death; it is Nature who threatens you!\""
      - heading "XLVI" [level=3] [ref=e170]
      - paragraph [ref=e171]: The beginning of philosophy is to know the condition of one's own mind. If a man recognises that this is in a weakly state, he will not then want to apply it to questions of the greatest moment. As it is, men who are not fit to swallow even a morsel, buy whole treatises and try to devour them. Accordingly they either vomit them up again, or suffer from indigestion, whence come gripings, fluxions, and fevers. Whereas they should have stopped to consider their capacity.
      - heading "XLVII" [level=3] [ref=e172]
      - paragraph [ref=e173]: "In theory it is easy to convince an ignorant person: in actual life, men not only object to offer themselves to be convinced, but hate the man who has convinced them. Whereas Socrates used to say that we should never lead a life not subjected to examination."
      - heading "XLVIII" [level=3] [ref=e174]
      - paragraph [ref=e175]: "This is the reason why Socrates, when reminded that he should prepare for his trial, answered: \"Thinkest thou not that I have been preparing for it all my life?\""
      - paragraph [ref=e176]: "\"In what way?\""
      - paragraph [ref=e177]: "\"I have maintained that which in me lay!\""
      - paragraph [ref=e178]: "\"How so?\""
      - paragraph [ref=e179]: "\"I have never, secretly or openly, done a wrong unto any.\""
      - heading "XLIX" [level=3] [ref=e180]
      - paragraph [ref=e181]: In what character dost thou now come forward?
      - paragraph [ref=e182]: As a witness summoned by God. "Come thou," saith God, "and testify for me, for thou art worthy of being brought forward as a witness by Me. Is aught that is outside thy will either good or bad? Do I hurt any man? Have I placed the good of each in the power of any other than himself? What witness dost thou bear to God?"
      - paragraph [ref=e183]: "\"I am in evil state, Master, I am undone! None careth for me, none giveth me aught: all men blame, all speak evil of me.\""
      - paragraph [ref=e184]: Is this the witness thou wilt bear, and do dishonour to the calling wherewith He hath called thee, because He hath done thee so great honour, and deemed thee worthy of being summoned to bear witness in so great a cause?
      - heading "L" [level=3] [ref=e185]
      - paragraph [ref=e186]: Wouldst thou have men speak good of thee? speak good of them. And when thou hast learned to speak good of them, try to do good unto them, and thus thou wilt reap in return their speaking good of thee.
      - heading "LI" [level=3] [ref=e187]
      - paragraph [ref=e188]: When thou goest in to any of the great, remember that Another from above sees what is passing, and that thou shouldst please Him rather than man. He therefore asks thee:—
      - paragraph [ref=e189]: "\"In the Schools, what didst thou call exile, imprisonment, bonds, death and shame?\""
      - paragraph [ref=e190]: "\"I called them things indifferent.\""
      - paragraph [ref=e191]: "\"What then dost thou call them now? Are they at all changed?\""
      - paragraph [ref=e192]: "\"No.\""
      - paragraph [ref=e193]: "\"Is it then thou that art changed?\""
      - paragraph [ref=e194]: "\"No.\""
      - paragraph [ref=e195]: "\"Say then, what are things indifferent?\""
      - paragraph [ref=e196]: "\"Things that are not in our power.\""
      - paragraph [ref=e197]: "\"Say then, what follows?\""
      - paragraph [ref=e198]: "\"That things which are not in our power are nothing to me.\""
      - paragraph [ref=e199]: "\"Say also what things you hold to be good.\""
      - paragraph [ref=e200]: "\"A will such as it ought to be, and a right use of the things of sense.\""
      - paragraph [ref=e201]: "\"And what is the end?\""
      - paragraph [ref=e202]: "\"To follow Thee!\""
      - heading "LII" [level=3] [ref=e203]
      - paragraph [ref=e204]: "\"That Socrates should ever have been so treated by the Athenians!\""
      - paragraph [ref=e205]: "Slave! why say \"Socrates\"? Speak of the thing as it is: That ever then the poor body of Socrates should have been dragged away and haled by main force to prison! That ever hemlock should have been given to the body of Socrates; that that should have breathed its life away!—Do you marvel at this? Do you hold this unjust? Is it for this that you accuse God? Had Socrates no compensation for this? Where then for him was the ideal Good? Whom shall we hearken to, you or him? And what says he?"
      - paragraph [ref=e206]: "\"Anytus and Melitus may put me to death: to injure me is beyond their power.\""
      - paragraph [ref=e207]: And again:—
      - paragraph [ref=e208]: "\"If such be the will of God, so let it be.\""
      - heading "LIII" [level=3] [ref=e209]
      - paragraph [ref=e210]: "Nay, young man, for heaven's sake; but once thou hast heard these words, go home and say to thyself:—\"It is not Epictetus that has told me these things: how indeed should he? No, it is some gracious God through him. Else it would never have entered his head to tell me them—he that is not used to speak to any one thus. Well, then, let us not lie under the wrath of God, but be obedient unto Him.\"—-Nay, indeed; but if a raven by its croaking bears thee any sign, it is not the raven but God that sends the sign through the raven; and if He signifies anything to thee through human voice, will He not cause the man to say these words to thee, that thou mayest know the power of the Divine—how He sends a sign to some in one way and to others in another, and on the greatest and highest matters of all signifies His will through the noblest messenger?"
      - paragraph [ref=e211]: What else does the poet mean:—
      - paragraph [ref=e212]: I spake unto him erst Myself, and sent
      - paragraph [ref=e213]: Hermes the shining One, to check and warn him,
      - paragraph [ref=e214]: The husband not to slay, nor woo the wife!
      - heading "LIV" [level=3] [ref=e215]
      - paragraph [ref=e216]: "In the same way my friend Heraclitus, who had a trifling suit about a petty farm at Rhodes, first showed the judges that his cause was just, and then at the finish cried, \"I will not entreat you: nor do I care what sentence you pass. It is you who are on your trial, not I!\"—And so he ended the case."
      - heading "LV" [level=3] [ref=e217]
      - paragraph [ref=e218]: As for us, we behave like a herd of deer. When they flee from the huntsman's feathers in affright, which way do they turn? What haven of safety do they make for? Why, they rush upon the nets! And thus they perish by confounding what they should fear with that wherein no danger lies. . . . Not death or pain is to be feared, but the fear of death or pain. Well said the poet therefore:—
      - paragraph [ref=e219]: Death has no terror; only a Death of shame!
      - heading "LVI" [level=3] [ref=e220]
      - paragraph [ref=e221]: How is it then that certain external things are said to be natural, and other contrary to Nature?
      - paragraph [ref=e222]: Why, just as it might be said if we stood alone and apart from others. A foot, for instance, I will allow it is natural should be clean. But if you take it as a foot, and as a thing which does not stand by itself, it will beseem it (if need be) to walk in the mud, to tread on thorns, and sometimes even to be cut off, for the benefit of the whole body; else it is no longer a foot. In some such way we should conceive of ourselves also. What art thou?—A man.—Looked at as standing by thyself and separate, it is natural for thee in health and wealth long to live. But looked at as a Man, and only as a part of a Whole, it is for that Whole's sake that thou shouldest at one time fall sick, at another brave the perils of the sea, again, know the meaning of want and perhaps die an early death. Why then repine? Knowest thou not that as the foot is no more a foot if detached from the body, so thou in like case art no longer a Man? For what is a Man? A part of a City:—first of the City of Gods and Men; next, of that which ranks nearest it, a miniature of the universal City. . . . In such a body, in such a world enveloping us, among lives like these, such things must happen to one or another. Thy part, then, being here, is to speak of these things as is meet, and to order them as befits the matter.
      - heading "LVII" [level=3] [ref=e223]
      - paragraph [ref=e224]: "That was a good reply which Diogenes made to a man who asked him for letters of recommendation.—\"That you are a man, he will know when he sees you;—whether a good or bad one, he will know if he has any skill in discerning the good or bad. But if he has none, he will never know, though I write him a thousand times.\"—It is as though a piece of silver money desired to be recommended to some one to be tested. If the man be a good judge of silver, he will know: the coin will tell its own tale."
      - heading "LVIII" [level=3] [ref=e225]
      - paragraph [ref=e226]: "Even as the traveller asks his way of him that he meets, inclined in no wise to bear to the right rather than to the left (for he desires only the way leading whither he would go), so should we come unto God as to a guide; even as we use our eyes without admonishing them to show us some things rather than others, but content to receive the images of such things as they present to us. But as it is we stand anxiously watching the victim, and with the voice of supplication call upon the augur:—\"Master, have mercy on me: vouchsafe unto me a way of escape!\" Slave, would you then have aught else then what is best? is there anything better than what is God's good pleasure? Why, as far as in you lies, would you corrupt your Judge, and lead your Counsellor astray?"
      - heading "LIX" [level=3] [ref=e227]
      - paragraph [ref=e228]: God is beneficent. But the Good also is beneficent. It should seem then that where the real nature of God is, there too is to be found the real nature of the Good. What then is the real nature of God?—Intelligence, Knowledge, Right Reason. Here then without more ado seek the real nature of the Good. For surely thou dost not seek it in a plant or in an animal that reasoneth not.
      - heading "LX" [level=3] [ref=e229]
      - paragraph [ref=e230]: "Seek then the real nature of the Good in that without whose presence thou wilt not admit the Good to exist in aught else.—What then? Are not these other things also works of God?—They are; but not preferred to honour, nor are they portions of God. But thou art a thing preferred to honour: thou art thyself a fragment torn from God:—thou hast a portion of Him within thyself. How is it then that thou dost not know thy high descent—dost not know whence thou comest? When thou eatest, wilt thou not remember who thou art that eatest and whom thou feedest? In intercourse, in exercise, in discussion knowest thou not that it is a God whom thou feedest, a God whom thou exercisest, a God whom thou bearest about with thee, O miserable! and thou perceivest it not. Thinkest thou that I speak of a God of silver or gold, that is without thee? Nay, thou bearest Him within thee! all unconscious of polluting Him with thoughts impure and unclean deeds. Were an image of God present, thou wouldest not dare to act as thou dost, yet, when God Himself is present within thee, beholding and hearing all, thou dost not blush to think such thoughts and do such deeds, O thou that art insensible of thine own nature and liest under the wrath of God!"
      - heading "LXI" [level=3] [ref=e231]
      - paragraph [ref=e232]: "Why then are we afraid when we send a young man from the Schools into active life, lest he should indulge his appetites intemperately, lest he should debase himself by ragged clothing, or be puffed up by fine raiment? Knows he not the God within him; knows he not with whom he is starting on his way? Have we patience to hear him say to us, Would I had thee with me!—Hast thou not God where thou art, and having Him dost thou still seek for any other! Would He tell thee aught else than these things? Why, wert thou a statue of Phidias, an Athena or a Zeus, thou wouldst bethink thee both of thyself and thine artificer; and hadst thou any sense, thou wouldst strive to do no dishonour to thyself or him that fashioned thee, nor appear to beholders in unbefitting guise. But now, because God is thy Maker, is that why thou carest not of what sort thou shalt show thyself to be? Yet how different the artists and their workmanship! What human artist's work, for example, has in it the faculties that are displayed in fashioning it? Is it aught but marble, bronze, gold, or ivory? Nay, when the Athena of Phidias has put forth her hand and received therein a Victory, in that attitude she stands for evermore. But God's works move and breathe; they use and judge the things of sense. The workmanship of such an Artist, wilt thou dishonor Him? Ay, when he not only fashioned thee, but placed thee, like a ward, in the care and guardianship of thyself alone, wilt thou not only forget this, but also do dishonour to what is committed to thy care! If God had entrusted thee with an orphan, wouldst thou have thus neglected him? He hath delivered thee to thine own care, saying, I had none more faithful than myself: keep this man for me such as Nature hath made him—modest, faithful, high-minded, a stranger to fear, to passion, to perturbation. . . ."
      - paragraph [ref=e233]: "Such will I show myself to you all.—\"What, exempt from sickness also: from age, from death?\"—Nay, but accepting sickness, accepting death as becomes a God!"
      - heading "LXII" [level=3] [ref=e234]
      - paragraph [ref=e235]: No labour, according to Diogenes, is good but that which aims at producing courage and strength of soul rather than of body.
      - heading "LXIII" [level=3] [ref=e236]
      - paragraph [ref=e237]: A guide, on finding a man who has lost his way, brings him back to the right path—he does not mock and jeer at him and then take himself off. You also must show the unlearned man the truth, and you will see that he will follow. But so long as you do not show it him, you should not mock, but rather feel your own incapacity.
      - heading "LXIV" [level=3] [ref=e238]
      - paragraph [ref=e239]: It was the first and most striking characteristic of Socrates never to become heated in discourse, never to utter an injurious or insulting word—on the contrary, he persistently bore insult from others and thus put an end to the fray. If you care to know the extent of his power in this direction, read Xenophon's Banquet, and you will see how many quarrels he put an end to. This is why the Poets are right in so highly commending this faculty:—
      - paragraph [ref=e240]: Quickly and wisely withal even bitter feuds would he settle.
      - paragraph [ref=e241]: Nevertheless the practice is not very safe at present, especially in Rome. One who adopts it, I need not say, ought not to carry it out in an obscure corner, but boldly accost, if occasion serve, some personage of rank or wealth.
      - paragraph [ref=e242]: "\"Can you tell me, sir, to whose care you entrust your horses?\""
      - paragraph [ref=e243]: "\"I can.\""
      - paragraph [ref=e244]: "\"Is it to the first comer, who knows nothing about them?\""
      - paragraph [ref=e245]: "\"Certainly not.\""
      - paragraph [ref=e246]: "\"Well, what of the man who takes care of your gold, your silver or your raiment?\""
      - paragraph [ref=e247]: "\"He must be experienced also.\""
      - paragraph [ref=e248]: "\"And your body—have you ever considered about entrusting it to any one's care?\""
      - paragraph [ref=e249]: "\"Of course I have.\""
      - paragraph [ref=e250]: "\"And no doubt to a person of experience as a trainer, a physician?\""
      - paragraph [ref=e251]: "\"Surely.\""
      - paragraph [ref=e252]: "\"And these things the best you possess, or have you anything more precious?\""
      - paragraph [ref=e253]: "\"What can you mean?\""
      - paragraph [ref=e254]: "\"I mean that which employs these; which weights all things; which takes counsel and resolve.\""
      - paragraph [ref=e255]: "\"Oh, you mean the soul.\""
      - paragraph [ref=e256]: "\"You take me rightly; I do mean the soul. By Heaven, I hold that far more precious than all else I possess. Can you show me then what care you bestow on a soul? For it can scarcely be thought that a man of your wisdom and consideration in the city would suffer your most precious possession to go to ruin through carelessness and neglect.\""
      - paragraph [ref=e257]: "\"Certainly not.\""
      - paragraph [ref=e258]: "\"Well, do you take care of it yourself? Did any one teach you the right method, or did you discover it yourself?\""
      - paragraph [ref=e259]: "Now here comes in the danger: first, that the great man may answer, \"Why, what is that to you, my good fellow? are you my master?\" And then, if you persist in troubling him, may raise his hand to strike you. It is a practice of which I was myself a warm admirer until such experiences as these befell me."
      - heading "LXV" [level=3] [ref=e260]
      - paragraph [ref=e261]: When a youth was giving himself airs in the Theatre and saying, "I am wise, for I have conversed with many wise men," Epictetus replied, "I too have conversed with many rich men, yet I am not rich!"
      - heading "LXVI" [level=3] [ref=e262]
      - paragraph [ref=e263]: "We see that a carpenter becomes a carpenter by learning certain things: that a pilot, by learning certain things, becomes a pilot. Possibly also in the present case the mere desire to be wise and good is not enough. It is necessary to learn certain things. This is then the object of our search. The Philosophers would have us first learn that there is a God, and that His Providence directs the Universe; further, that to hide from Him not only one's acts but even one's thoughts and intentions is impossible; secondly, what the nature of God is. Whatever that nature is discovered to be, the man who would please and obey Him must strive with all his might to be made like unto him. If the Divine is faithful, he also must be faithful; if free, he also must be free; if beneficent, he also must be beneficent; if magnanimous, he also must be magnanimous. Thus as an imitator of God must he follow Him in every deed and word."
      - heading "LXVII" [level=3] [ref=e264]
      - paragraph [ref=e265]: "If I show you, that you lack just what is most important and necessary to happiness, that hitherto your attention has been bestowed on everything rather than that which claims it most; and, to crown all, that you know neither what God nor Man is—neither what Good or Evil is: why, that you are ignorant of everything else, perhaps you may bear to be told; but to hear that you know nothing of yourself, how could you submit to that? How could you stand your ground and suffer that to be proved? Clearly not at all. You instantly turn away in wrath. Yet what harm have I done to you? Unless indeed the mirror harms the ill-favoured man by showing him to himself just as he is; unless the physician can be thought to insult his patient, when he tells him:—\"Friend, do you suppose there is nothing wrong with you? why, you have a fever. Eat nothing to-day, and drink only water.\" Yet no one says, \"What an insufferable insult!\" Whereas if you say to a man, \"Your desires are inflamed, your instincts of rejection are weak and low, your aims are inconsistent, your impulses are not in harmony with Nature, your opinions are rash and false,\" he forthwith goes away and complains that you have insulted him."
      - heading "LXVIII" [level=3] [ref=e266]
      - paragraph [ref=e267]: Our way of life resembles a fair. The flocks and herds are passing along to be sold, and the greater part of the crowd to buy and sell. But there are some few who come only to look at the fair, to inquire how and why it is being held, upon what authority and with what object. So too, in this great Fair of life, some, like the cattle, trouble themselves about nothing but the fodder. Know all of you, who are busied about land, slaves and public posts, that these are nothing but fodder! Some few there are attending the Fair, who love to contemplate what the world is, what He that administers it. Can there be no Administrator? is it possible, that while neither city nor household could endure even a moment without one to administer and see to its welfare, this Fabric, so fair, so vast, should be administered in order so harmonious, without a purpose and by blind chance? There is therefore an Administrator. What is His nature and how does He administer? And who are we that are His children and what work were we born to perform? Have we any close connection or relation with Him or not?
      - paragraph [ref=e268]: "Such are the impressions of the few of whom I speak. And further, they apply themselves solely to considering and examining the great assembly before they depart. Well, they are derided by the multitude. So are the lookers-on by the traders: aye, and if the beasts had any sense, they would deride those who thought much of anything but fodder!"
      - heading "LXIX" [level=3] [ref=e269]
      - paragraph [ref=e270]: I think I know now what I never knew before—the meaning of the common saying, A fool you can neither bend nor break. Pray heaven I may never have a wise fool for my friend! There is nothing more intractable.—"My resolve is fixed!"—Why so madman say too; but the more firmly they believe in their delusions, the more they stand in need of treatment.
      - heading "LXX" [level=3] [ref=e271]
      - paragraph [ref=e272]: —"O! when shall I see Athens and its Acropolis again?"—Miserable man! art thou not contented with the daily sights that meet thine eyes? canst thou behold aught greater or nobler than the Sun, Moon, and Stars; than the outspread Earth and Sea? If indeed thou apprehendest Him who administers the universe, if thou bearest Him about within thee, canst thou still hanker after mere fragments of stone and fine rock? When thou art about to bid farewell to the Sun and Moon itself, wilt thou sit down and cry like a child? Why, what didst thou hear, what didst thou learn? why didst thou write thyself down a philosopher, when thou mightest have written what was the fact, namely, "I have made one or two Compendiums, I have read some works of Chrysippus, and I have not even touched the hem of Philosophy's robe!"
      - heading "LXXI" [level=3] [ref=e273]
      - paragraph [ref=e274]: "Friend, lay hold with a desperate grasp, ere it is too late, on Freedom, on Tranquility, on Greatness of soul! Lift up thy head, as one escaped from slavery; dare to look up to God, and say:—\"Deal with me henceforth as Thou wilt; Thou and I are of one mind. I am Thine: I refuse nothing that seeeth good to Thee; lead on whither Thou wilt; clothe me in what garb Thou pleasest; wilt Thou have me a ruler or a subject—at home or in exile—poor or rich? All these things will I justify unto men for Thee. I will show the true nature of each. . . .\""
      - paragraph [ref=e275]: Who would Hercules have been had he loitered at home? no Hercules, but Eurystheus. And in his wanderings through the world how many friends and comrades did he find? but nothing dearer to him than God. Wherefore he was believed to be God's son, as indeed he was. So then in obedience to Him, he went about delivering the earth from injustice and lawlessness.
      - paragraph [ref=e276]: But thou art not Hercules, thou sayest, and canst not deliver others from their iniquity—not even Theseus, to deliver the soil of Attica from its monsters? Purge away thine own, cast forth thence—from thine own mind, not robbers and monsters, but Fear, Desire, Envy, Malignity, Avarice, Effeminacy, Intemperance. And these may not be cast out, except by looking to God alone, by fixing thy affections on Him only, and by consecrating thyself to His commands. If thou choosest aught else, with sighs and groans thou wilt be forced to follow a Might greater than thine own, ever seeking Tranquillity without, and never able to attain unto her. For thou seekest her where she is not to be found; and where she is, there thou seekest her not!
      - heading "LXXII" [level=3] [ref=e277]
      - paragraph [ref=e278]: If a man would pursue Philosophy, his first task is to throw away conceit. For it is impossible for a man to begin to learn what he has a conceit that he already knows.
      - heading "LXXIII" [level=3] [ref=e279]
      - paragraph [ref=e280]: Give me but one young man, that has come to the School with this intention, who stands forth a champion of this cause, and says, "All else I renounce, content if I am but able to pass my life free from hindrance and trouble; to raise my head aloft and face all things as a free man; to look up to heaven as a friend of God, fearing nothing that may come to pass!" Point out such a one to me, that I may say, "Enter, young man, into possession of that which is thine own. For thy lot is to adorn Philosophy. Thine are these possessions; thine these books, these discourses!"
      - paragraph [ref=e281]: And when our champion has duly exercised himself in this part of the subject, I hope he will come back to me and say:—"What I desire is to be free from passion and from perturbation; as one who grudges no pains in the pursuit of piety and philosophy, what I desire is to know my duty to the Gods, my duty to my parents, to my brothers, to my country, to strangers."
      - paragraph [ref=e282]: "\"Enter then on the second part of the subject; it is thine also.\""
      - paragraph [ref=e283]: "\"But I have already mastered the second part; only I wished to stand firm and unshaken—as firm when asleep as when awake, as firm when elated with wine as in despondency and dejection.\""
      - paragraph [ref=e284]: "\"Friend, you are verily a God! you cherish great designs.\""
      - heading "LXXIV" [level=3] [ref=e285]
      - paragraph [ref=e286]: "\"The question at stake,\" said Epictetus, \"is no common one; it is this:—Are we in our senses, or are we not?\""
      - heading "LXXV" [level=3] [ref=e287]
      - paragraph [ref=e288]: "If you have given way to anger, be sure that over and above the evil involved therein, you have strengthened the habit, and added fuel to the fire. If overcome by a temptation of the flesh, do not reckon it a single defeat, but that you have also strengthened your dissolute habits. Habits and faculties are necessarily affected by the corresponding acts. Those that were not there before, spring up: the rest gain in strength and extent. This is the account which Philosophers give of the origin of diseases of the mind:—Suppose you have once lusted after money: if reason sufficient to produce a sense of evil be applied, then the lust is checked, and the mind at once regains its original authority; whereas if you have recourse to no remedy, you can no longer look for this return—on the contrary, the next time it is excited by the corresponding object, the flame of desire leaps up more quickly than before. By frequent repetition, the mind in the long run becomes callous; and thus this mental disease produces confirmed Avarice."
      - paragraph [ref=e289]: "One who has had fever, even when it has left him, is not in the same condition of health as before, unless indeed his cure is complete. Something of the same sort is true also of diseases of the mind. Behind, there remains a legacy of traces and blisters: and unless these are effectually erased, subsequent blows on the same spot will produce no longer mere blisters, but sores. If you do not wish to be prone to anger, do not feed the habit; give it nothing which may tend its increase. At first, keep quiet and count the days when you were not angry: \"I used to be angry every day, then every other day: next every two, next every three days!\" and if you succeed in passing thirty days, sacrifice to the Gods in thanksgiving."
      - heading "LXXVI" [level=3] [ref=e290]
      - paragraph [ref=e291]: How then may this be attained?—Resolve, now if never before, to approve thyself to thyself; resolve to show thyself fair in God's sight; long to be pure with thine own pure self and God!
      - heading "LXXVII" [level=3] [ref=e292]
      - paragraph [ref=e293]: That is the true athlete, that trains himself to resist such outward impressions as these.
      - paragraph [ref=e294]: "\"Stay, wretched man! suffer not thyself to be carried away!\" Great is the combat, divine the task! you are fighting for Kingship, for Liberty, for Happiness, for Tranquillity. Remember God: call upon Him to aid thee, like a comrade that stands beside thee in the fight."
      - heading "LXXVIII" [level=3] [ref=e295]
      - paragraph [ref=e296]: Who then is a Stoic—in the sense that we call a statue of Phidias which is modelled after that master's art? Show me a man in this sense modelled after the doctrines that are ever upon his lips. Show me a man that is sick—and happy; an exile—and happy; in evil report—and happy! Show me him, I ask again. So help me Heaven, I long to see one Stoic! Nay, if you cannot show me one fully modelled, let me at least see one in whom the process is at work—one whose bent is in that direction. Do me that favour! Grudge it not to an old man, to behold a sight he has never yet beheld. Think you I wish to see the Zeus or Athena of Phidias, bedecked with gold and ivory?—Nay, show me, one of you, a human soul, desiring to be of one mind with God, no more to lay blame on God or man, to suffer nothing to disappoint, nothing to cross him, to yield neither to anger, envy, nor jealousy—in a word, why disguise the matter? one that from a man would fain become a God; one that while still imprisoned in this dead body makes fellowship with God his aim. Show me him!—Ah, you cannot! Then why mock yourselves and delude others? why stalk about tricked out in other men's attire, thieves and robbers that you are of names and things to which you can show no title!
      - heading "LXXIX" [level=3] [ref=e297]
      - paragraph [ref=e298]: If you have assumed a character beyond your strength, you have both played a poor figure in that, and neglected one that is within your powers.
      - heading "LXXX" [level=3] [ref=e299]
      - paragraph [ref=e300]: "Fellow, you have come to blows at home with a slave: you have turned the household upside down, and thrown the neighbourhood into confusion; and do you come to me then with airs of assumed modesty—do you sit down like a sage and criticise my explanation of the readings, and whatever idle babble you say has come into my head? Have you come full of envy, and dejected because nothing is sent you from home; and while the discussion is going on, do you sit brooding on nothing but how your father or your brother are disposed towards you:—\"What are they saying about me there? at this moment they imagine I am making progress and saying, He will return perfectly omniscient! I wish I could become omniscient before I return; but that would be very troublesome. No one sends me anything—the baths at Nicopolis are dirty; things are wretched at home and wretched here.\" And then they say, \"Nobody is any the better for the School.\"—Who comes to the School with a sincere wish to learn: to submit his principles to correction and himself to treatment? Who, to gain a sense of his wants? Why then be surprised if you carry home from the School exactly what you bring into it?"
      - heading "LXXXI" [level=3] [ref=e301]
      - paragraph [ref=e302]: "\"Epictetus, I have often come desiring to hear you speak, and you have never given me any answer; now if possible, I entreat you, say something to me.\""
      - paragraph [ref=e303]: "\"Is there, do you think,\" replied Epictetus, \"an art of speaking as of other things, if it is to be done skilfully and with profit to the hearer?\""
      - paragraph [ref=e304]: "\"Yes.\""
      - paragraph [ref=e305]: "\"And are all profited by what they hear, or only some among them? So that it seems there is an art of hearing as well as of speaking. . . . To make a statue needs skill: to view a statue aright needs skill also.\""
      - paragraph [ref=e306]: "\"Admitted.\""
      - paragraph [ref=e307]: "\"And I think all will allow that one who proposes to hear philosophers speak needs a considerable training in hearing. Is that not so? The tell me on what subject your are able to hear me.\""
      - paragraph [ref=e308]: "\"Why, on good and evil.\""
      - paragraph [ref=e309]: "\"The good and evil of what? a horse, an ox?\""
      - paragraph [ref=e310]: "\"No; of a man.\""
      - paragraph [ref=e311]: "\"Do we know then what Man is? what his nature is? what is the idea we have of him? And are our ears practised in any degree on the subject? Nay, do you understand what Nature is? can you follow me in any degree when I say that I shall have to use demonstration? Do you understand what Demonstration is? what True or False is? . . . must I drive you to Philosophy? . . . Show me what good I am to do by discoursing with you. Rouse my desire to do so. The sight of a pasture it loves stirs in a sheep the desire to feed: show it a stone or a bit of bread and it remains unmoved. Thus we also have certain natural desires, aye, and one that moves us to speak when we find a listener that is worth his salt: one that himself stirs the spirit. But if he sits by like a stone or a tuft of grass, how can he rouse a man's desire?\""
      - paragraph [ref=e312]: "\"Then you will say nothing to me?\""
      - paragraph [ref=e313]: "\"I can only tell you this: that one who knows not who he is and to what end he was born; what kind of world this is and with whom he is associated therein; one who cannot distinguish Good and Evil, Beauty and Foulness, . . . Truth and Falsehood, will never follow Reason in shaping his desires and impulses and repulsions, nor yet in assent, denial, or suspension of judgement; but will in one word go about deaf and blind, thinking himself to be somewhat, when he is in truth of no account. Is there anything new in all this? Is not this ignorance the cause of all the mistakes and mischances of men since the human race began? . . .\""
      - paragraph [ref=e314]: "\"This is all I have to say to you, and even this against the grain. Why? Because you have not stirred my spirit. For what can I see in you to stir me, as a spirited horse will stir a judge of horses? Your body? That you maltreat. Your dress? That is luxurious. You behavior, your look?—Nothing whatever. When you want to hear a philosopher, do not say, You say nothing to me'; only show yourself worthy or fit to hear, and then you will see how you will move the speaker.\""
      - heading "LXXXII" [level=3] [ref=e315]
      - paragraph [ref=e316]: "And now, when you see brothers apparently good friends and living in accord, do not immediately pronounce anything upon their friendship, though they should affirm it with an oath, though they should declare, \"For us to live apart in a thing impossible!\" For the heart of a bad man is faithless, unprincipled, inconstant: now overpowered by one impression, now by another. Ask not the usual questions, Were they born of the same parents, reared together, and under the same tutor; but ask this only, in what they place their real interest—whether in outward things or in the Will. If in outward things, call them not friends, any more than faithful, constant, brave or free: call them not even human beings, if you have any sense. . . . But should you hear that these men hold the Good to lie only in the Will, only in rightly dealing with the things of sense, take no more trouble to inquire whether they are father and son or brothers, or comrades of long standing; but, sure of this one thing, pronounce as boldly that they are friends as that they are faithful and just: for where else can Friendship be found than where Modesty is, where there is an interchange of things fair and honest, and of such only?"
      - heading "LXXXIII" [level=3] [ref=e317]
      - paragraph [ref=e318]: No man can rob us of our Will—no man can lord it over that!
      - heading "LXXXIV" [level=3] [ref=e319]
      - paragraph [ref=e320]: When disease and death overtake me, I would fain be found engaged in the task of liberating mine own Will from the assaults of passion, from hindrance, from resentment, from slavery.
  - contentinfo [ref=e321]:
    - generic [ref=e322]:
      - text: Copyright © 2026
      - link "The Aurelius Fund" [ref=e323] [cursor=pointer]:
        - /url: "#"
      - text: "| All Rights Reserved"
```

# Test source

```ts
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
  277 |         await expect(page).toHaveScreenshot('modal-desktop.png', { maxDiffPixels: 200 });
  278 |     });
  279 | 
  280 |     test('work modal at mobile viewport', async ({ page }) => {
  281 |         await page.setViewportSize({ width: 375, height: 812 });
  282 |         await waitForQuote(page);
  283 |         await openWorkModal(page);
> 284 |         await expect(page).toHaveScreenshot('modal-mobile.png', { maxDiffPixels: 200 });
      |                            ^ Error: expect(page).toHaveScreenshot(expected) failed
  285 |     });
  286 | });
  287 | 
```