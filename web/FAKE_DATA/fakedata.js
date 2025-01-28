const fs = require('fs');
const path = require('path');

// Simple lorem ipsum generator
const loremIpsumWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", "elit", "sed", "do",
    "eiusmod", "tempor", "incididunt", "ut", "labore", "et", "dolore", "magna", "aliqua", "ut",
    "enim", "ad", "minim", "veniam", "quis", "nostrud", "exercitation", "ullamco", "laboris",
    "nisi", "ut", "aliquip", "ex", "ea", "commodo", "consequat", "duis", "aute", "irure", "dolor",
    "in", "reprehenderit", "in", "voluptate", "velit", "esse", "cillum", "dolore", "eu", "fugiat",
    "nulla", "pariatur", "excepteur", "sint", "occaecat", "cupidatat", "non", "proident", "sunt",
    "in", "culpa", "qui", "officia", "deserunt", "mollit", "anim", "id", "est", "laborum"
];

const locationSyntaxes = [
    ["Book", "Chapter", "Section"],
    ["Part", "Paragraph"],
    ["Volume", "Chapter", "Verse"],
    ["Section", "Subsection", "Paragraph"],
    ["Book", "Chapter", "Section", "Paragraph"],
    ["Volume", "Part", "Chapter", "Section"],
    ["Book", "Chapter", "Section", "Subsection", "Paragraph"]
];

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

// Generate fake stoic works data
async function generateTestData(numAuthors, numWorks, minSizeKB, maxSizeKB) {
    console.log(`Generating data for ${numAuthors} authors and ${numWorks} works...`);

    const authors = [];
    for (let i = 0; i < numAuthors; i++) {
        authors.push({
            id: (i + 1).toString(),
            name: `Fake Stoic Author ${i + 1}`,
            bioUri: `fakeStoicAuthorBio${i + 1}.txt`,
            imgUri: `fakeStoicAuthor${i + 1}.jpg`
        });
    }

    const works = [];
    for (let i = 0; i < numWorks; i++) {
        works.push({
            id: (i + 1).toString(),
            authorId: (Math.floor(Math.random() * numAuthors) + 1).toString(),
            title: `Fake Stoic Work ${i + 1}`,
            dataUri: `fakeStoicWork${i + 1}.json`,
            locationSyntax: locationSyntaxes[Math.floor(Math.random() * locationSyntaxes.length)]
        });
    }

    const metaData = { authors, works };

    // Generate fake content for works
    function generateWorkData(locationSyntax, targetSizeKB) {
        const indexList = [];
        const partitions = [];
        let currentId = [];
        const partitionSize = 5; // Number of sections per partition
        let currentSizeKB = 0;

        while (currentSizeKB < targetSizeKB) {
            const i = indexList.length * partitionSize;
            currentId = [...currentId.slice(0, locationSyntax.length - 1), i + 1];
            if (i % partitionSize === 0) {
                indexList.push(currentId.join('.'));
            }
            const tag = currentId.length < 6 ? `h${currentId.length + 1}` : 'p';
            const content = tag.startsWith('h') ? generateLoremIpsumTitle() : generateLoremIpsumParagraph();
            const partition = `<${tag} id='${currentId.join('.')}'>${content}</${tag}>`;
            partitions.push(partition);
            currentSizeKB = Buffer.byteLength(JSON.stringify(partitions), 'utf8') / 1024;
        }

        return [indexList, partitions];
    }

    const fakeWorksData = works.map(work => {
        const targetSizeKB = Math.random() * (maxSizeKB - minSizeKB) + minSizeKB;
        console.log(`Generating work "${work.title}" with target size ${targetSizeKB.toFixed(2)} KB...`);
        return generateWorkData(work.locationSyntax, targetSizeKB);
    });

    // Generate fake quotes
    const fakeQuotes = [];
    for (let i = 0; i < numWorks; i++) {
        fakeQuotes.push({
            quote: generateLoremIpsumSentence(),
            location: "1.1.1",
            workId: (i + 1).toString()
        });
    }

    // Write data to files
    console.log('Writing data to files...');
    fs.writeFileSync(path.join(__dirname, 'data-meta.json'), JSON.stringify(metaData, null, 2));
    fakeWorksData.forEach((workData, index) => {
        fs.writeFileSync(path.join(__dirname, `fakeStoicWork${index + 1}.json`), JSON.stringify(workData, null, 2));
    });
    fs.writeFileSync(path.join(__dirname, 'data-all-quotes.json'), JSON.stringify(fakeQuotes, null, 2));

    // Generate and write author bios
    authors.forEach((author, index) => {
        const authorBio = generateLoremIpsumParagraph();
        fs.writeFileSync(path.join(__dirname, `fakeStoicAuthorBio${index + 1}.txt`), authorBio);
    });

    // Calculate and log the rough size of each work in KB
    fakeWorksData.forEach((workData, index) => {
        const workSize = Buffer.byteLength(JSON.stringify(workData), 'utf8') / 1024;
        console.log(`Size of Fake Stoic Work ${index + 1}: ${workSize.toFixed(2)} KB`);
    });

    console.log('Test data generated successfully.');
}

// Get user input for number of authors, works, min size, and max size
const numAuthors = parseInt(process.argv[2], 10) || 1;
const numWorks = parseInt(process.argv[3], 10) || 1;
const minSizeKB = parseFloat(process.argv[4]) || 10;
const maxSizeKB = parseFloat(process.argv[5]) || 50;

generateTestData(numAuthors, numWorks, minSizeKB, maxSizeKB);