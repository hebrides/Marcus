const fs = require('fs');
const path = require('path');

// Constants
const loremIpsumWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
    "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
    "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
    "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
    "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt",
    "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const SIZES = {
    header: 30,    // h1-h6 tags
    paragraph: 600, // p tags
    span: 100      // span tags (sentences)
};

const termGroups = {
    top: {tags: ['h1','h2','h3'], terms: ['Volume','Book','Part']},
    mid: {tags: ['h4','h5','h6'], terms: ['Chapter','Section','Subsection']},
    low: {tags: ['p','p'], terms: ['Passage','Paragraph']},
    final: {tags: ['p','span'], terms: ['Verse','Sentence']}
};

// Helper functions
function generateLoremIpsumSentence() {
    const sentenceLength = Math.floor(Math.random() * 10) + 5;
    let sentence = [];
    for (let i = 0; i < sentenceLength; i++) {
        sentence.push(loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]);
    }
    sentence[0] = sentence[0].charAt(0).toUpperCase() + sentence[0].slice(1);
    return sentence.join(' ') + '.';
}

function generateLoremIpsumParagraph() {
    const paragraphLength = Math.floor(Math.random() * 5) + 3;
    let paragraph = [];
    for (let i = 0; i < paragraphLength; i++) {
        paragraph.push(generateLoremIpsumSentence());
    }
    return paragraph.join(' ');
}

function generateLoremIpsumTitle() {
    const titleLength = Math.floor(Math.random() * 3) + 2;
    let title = [];
    for (let i = 0; i < titleLength; i++) {
        title.push(loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]);
    }
    title[0] = title[0].charAt(0).toUpperCase() + title[0].slice(1);
    return title.join(' ');
}

function getElementSize(tag) {
    if (tag.startsWith('h')) return SIZES.header;
    if (tag === 'p') return SIZES.paragraph;
    return SIZES.span;
}

// Core functions
function selectRandomTerms(group, min = 1) {
    const count = Math.floor(Math.random() * (group.terms.length - min + 1)) + min;
    const indices = [...Array(group.terms.length).keys()];
    return Array(count).fill().map(() => {
        const idx = indices.splice(Math.floor(Math.random() * indices.length), 1)[0];
        return {term: group.terms[idx], tag: group.tags[idx]};
    });
}

function buildHierarchy() {
    return [
        ...selectRandomTerms(termGroups.top),
        ...selectRandomTerms(termGroups.mid),
        ...selectRandomTerms(termGroups.low),
        ...selectRandomTerms(termGroups.final, 1)
    ];
}

function pruneHierarchy(hierarchy) {
    const targetLength = Math.floor(Math.random() * 5) + 2; // 2-6 levels
    while (hierarchy.length > targetLength) {
        const idx = Math.floor(Math.random() * (hierarchy.length - 1));
        hierarchy.splice(idx, 1);
    }
    return hierarchy;
}

function generateStructure(hierarchy, targetKB) {
    const structure = [];
    const targetBytes = targetKB * 1024;
    const levels = hierarchy.length;
    let currentBytes = 0;
    
    function generateLevel(currentId = [], depth = 0) {
        if (depth >= levels || currentBytes >= targetBytes) return;
        
        const isTop = depth === 0;
        const isBottom = depth === levels - 1;
        const numDivisions = isTop ? 2 + Math.floor(Math.random() * 3) :
                           isBottom ? 4 + Math.floor(Math.random() * 5) :
                           3 + Math.floor(Math.random() * 4);
        
        for (let i = 1; i <= numDivisions && currentBytes < targetBytes; i++) {
            const newId = [...currentId, i];
            const elementSize = getElementSize(hierarchy[depth].tag);
            
            if (currentBytes + elementSize <= targetBytes) {
                structure.push({
                    id: newId.join('.'),
                    tag: hierarchy[depth].tag,
                    term: hierarchy[depth].term,
                    depth: depth
                });
                currentBytes += elementSize;
                
                if (!isBottom) {
                    generateLevel(newId, depth + 1);
                }
            }
        }
    }
    
    generateLevel();
    return structure;
}

function generateContent(tag) {
    switch(tag) {
        case 'h1':
        case 'h2':
        case 'h3':
        case 'h4':
        case 'h5':
        case 'h6':
            return generateLoremIpsumTitle();
        case 'p':
            return generateLoremIpsumParagraph();
        case 'span':
            return generateLoremIpsumSentence();
    }
}

function addHTML(structure) {
    return structure.map(element => {
        const content = generateContent(element.tag);
        const innerHTML = `<${element.tag} id="${element.id}">${content}</${element.tag}>`;
        return { ...element, innerHTML, content };
    });
}

function partitionContent(content, partitionSize = 16) {
    const indexList = [];
    const partitions = [];
    let currentPartition = [];
    let currentSize = 0;

    content.forEach((element) => {
        const elementSize = Buffer.byteLength(element.innerHTML, 'utf8') / 1024;
        
        if (currentSize + elementSize > partitionSize && currentPartition.length > 0) {
            partitions.push(currentPartition);
            currentPartition = [];
            currentSize = 0;
            indexList.push(element.id);
        }
        
        currentPartition.push(element.innerHTML);
        currentSize += elementSize;
    });
    
    if (currentPartition.length) {
        partitions.push(currentPartition);
    }

    return [indexList, partitions];
}

function generateAuthors(count) {
    return Array(count).fill().map((_, i) => ({
        id: (i + 1).toString(),
        name: `Fake Stoic Author ${i + 1}`,
        imgUri: `stoics/author${i + 1}/author${i + 1}.jpg`,
        image: null,
        bioUri: `stoics/author${i + 1}/bio${i + 1}.html`,
        bio: null,
        quotesUri: null,
        version: "1.0.0"
    }));
}

function generateWorks(count, authors) {
    return Array(count).fill().map((_, i) => ({
        id: (i + 1).toString(),
        authorId: authors[i % authors.length].id,
        title: `Fake Stoic Work ${i + 1}`,
        locationSyntax: [], // Will be filled from pruned hierarchy
        dataUri: `stoics/author${Math.floor(i / authors.length) + 1}/work${i + 1}.json`,
        data: null,
        version: "1.0.0"
    }));
}

function generateWorkData(work, targetKB) {
    console.log(`\nGenerating work ${work.id} (${targetKB}KB):`);
    
    const initial = buildHierarchy();
    console.log('Initial hierarchy:', initial.map(x => x.term).join(' → '));
    
    const pruned = pruneHierarchy([...initial]);
    console.log('Pruned hierarchy:', pruned.map(x => x.term).join(' → '));
    work.locationSyntax = pruned.map(x => x.term);
    
    const structure = generateStructure(pruned, targetKB);
    console.log(`Generated structure: ${structure.length} elements`);
    
    const withHTML = addHTML(structure);
    console.log('Sample HTML:', withHTML[0].innerHTML.substring(0, 100) + '...');
    
    const [indexList, partitions] = partitionContent(withHTML);
    
    return {
        content: withHTML,
        indexList,
        partitions
    };
}

function extractQuotes(work, content) {
    console.log(`\nExtracting quotes for work ${work.id}:`);
    
    const bottomElements = content.filter(el => 
        el.tag === 'span' || (el.tag === 'p' && el.term === 'Verse'));
    
    console.log(`Found ${bottomElements.length} bottom elements`);
    console.log('Sample element:', bottomElements[0]);
    
    const numQuotes = 5 + Math.floor(Math.random() * 10);
    const quotes = [];
    
    for (let i = 0; i < numQuotes; i++) {
        const element = bottomElements[Math.floor(Math.random() * bottomElements.length)];
        if (!element || !element.id || !element.content) {
            console.log('Invalid element found, skipping...');
            continue;
        }
        
        quotes.push({
            workId: work.id,
            location: element.id,
            quote: element.content.trim()
        });
    }
    
    console.log(`Generated ${quotes.length} quotes`);
    return quotes;
}


function generateTestData() {
    const authors = generateAuthors(3);
    const works = generateWorks(5, authors);
    const quotes = [];
    
    console.log('Generating work content...');
    works.forEach(work => {
        const targetKB = Math.floor(Math.random() * 200) + 100;
        const {content, indexList, partitions} = generateWorkData(work, targetKB);
        
        quotes.push(...extractQuotes(work, content));
        
        fs.writeFileSync(
            path.join(__dirname, `stoicwork${work.id}.json`),
            JSON.stringify({indexList, partitions}, null, 2)
        );
        
        console.log(`Generated work ${work.id}: ${partitions.length} partitions`);
    });
    
    // Write author bios
    authors.forEach((author, i) => {
        const bio = generateLoremIpsumParagraph();
        fs.writeFileSync(path.join(__dirname, `stoicbio${i + 1}.txt`), bio);
    });
    
    // Write meta data
    const metaData = {
        description: "Generated Stoic Works",
        license: "CC BY-SA 4.0",
        licenseUri: "https://creativecommons.org/licenses/by-sa/4.0/",
        authors,
        works,
        quotes: {
            version: "1.0.0",
            allQuotesUri: "data-all-quotes.json",
            allQuotes: null,
            favorites: null
        }
    };
    
    fs.writeFileSync(path.join(__dirname, 'data-meta.json'), 
        JSON.stringify(metaData, null, 2));
    fs.writeFileSync(path.join(__dirname, 'data-all-quotes.json'), 
        JSON.stringify(quotes, null, 2));
    
    console.log(`\nGenerated ${works.length} works for ${authors.length} authors`);
    console.log(`Extracted ${quotes.length} quotes`);
}

// Run generator
generateTestData();