const fs = require('fs');
const path = require('path');

// Command line configuration with validation
const args = process.argv.slice(2);
const CONFIG = {
    numAuthors: Math.max(1, Math.min(10, parseInt(args[0]) || 3)),
    numWorks: Math.max(1, Math.min(20, parseInt(args[1]) || 5)),
    minKB: Math.max(100, Math.min(1000, parseInt(args[2]) || 100)),
    maxKB: Math.max(200, Math.min(2000, parseInt(args[3]) || 500)),
    partitionKB: Math.max(8, Math.min(64, parseInt(args[4]) || 16)),
    bioSizeKB: Math.max(2, Math.min(5, parseInt(args[5]) || 3)),
};

// Validate ranges with logging
if (CONFIG.maxKB <= CONFIG.minKB) {
    console.log('Warning: Adjusting maxKB to ensure valid range');
    CONFIG.maxKB = CONFIG.minKB + 100;
}

console.log('Configuration:', CONFIG);

// Content generation constants
const loremIpsumWords = [
    "lorem", "ipsum", "dolor", "sit", "amet", "consectetur", "adipiscing", 
    // ... existing words array ...
];

// Size constraints for different content types
const SIZES = {
    header: {min: 30, max: 60},    // h1-h6 tags
    paragraph: {min: 600, max: 2400}, // p tags
    span: {min: 100, max: 300}     // span tags (sentences)
};

// Term hierarchy definition
const termGroups = {
    top: {tags: ['h1','h2','h3'], terms: ['Volume','Book','Part']},
    mid: {tags: ['h4','h5','h6'], terms: ['Chapter','Section','Subsection']},
    low: {tags: ['p','p'], terms: ['Passage','Paragraph']},
    final: {tags: ['p','span'], terms: ['Verse','Sentence']}
};

/**
 * Generate author metadata
 * @param {number} count Number of authors to generate
 * @returns {Array} Array of author objects
 */
function generateAuthors(count) {
    console.log(`\nGenerating ${count} authors...`);
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

/**
 * Generate work metadata
 * @param {number} count Number of works to generate
 * @param {Array} authors Array of author objects
 * @returns {Array} Array of work objects
 */
function generateWorks(count, authors) {
    console.log(`\nGenerating ${count} works...`);
    return Array(count).fill().map((_, i) => ({
        id: (i + 1).toString(),
        authorId: authors[i % authors.length].id,
        title: `Fake Stoic Work ${i + 1}`,
        locationSyntax: [],
        dataUri: `stoics/author${Math.floor(i / authors.length) + 1}/work${i + 1}.json`,
        data: null,
        version: "1.0.0"
    }));
}

// Content generation helpers with enhanced logging
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
    const sentenceCount = Math.floor(Math.random() * 7) + 5; // 5-11 sentences
    const paragraph = [];
    for (let i = 0; i < sentenceCount; i++) {
        paragraph.push(generateLoremIpsumSentence());
    }
    return paragraph.join(' ');
}

function generateLoremIpsumTitle() {
    const titleLength = Math.floor(Math.random() * 3) + 2;
    const title = [];
    for (let i = 0; i < titleLength; i++) {
        title.push(loremIpsumWords[Math.floor(Math.random() * loremIpsumWords.length)]);
    }
    title[0] = title[0].charAt(0).toUpperCase() + title[0].slice(1);
    return title.join(' ');
}

/**
 * Build initial hierarchy from term groups
 * @returns {Array} Array of hierarchy objects
 */
function buildHierarchy() {
    const hierarchy = [
        ...selectRandomTerms(termGroups.top),
        ...selectRandomTerms(termGroups.mid),
        ...selectRandomTerms(termGroups.low),
        ...selectRandomTerms(termGroups.final, 1)
    ];
    console.log('Built hierarchy:', hierarchy.map(x => x.term).join(' → '));
    return hierarchy;
}

function selectRandomTerms(group, min = 1) {
    const count = Math.floor(Math.random() * (group.terms.length - min + 1)) + min;
    const indices = [...Array(group.terms.length).keys()];
    return Array(count).fill().map(() => {
        const idx = indices.splice(Math.floor(Math.random() * indices.length), 1)[0];
        return {term: group.terms[idx], tag: group.tags[idx]};
    });
}

/**
 * Prune hierarchy to target depth with safety check
 * @param {Array} hierarchy Initial hierarchy
 * @returns {Array} Pruned hierarchy
 */
function pruneHierarchy(hierarchy) {
    const targetLength = Math.min(
        Math.floor(Math.random() * 3) + 3,
        hierarchy.length
    );
    const maxIterations = hierarchy.length * 2;
    let iterations = 0;
    
    while (hierarchy.length > targetLength && iterations < maxIterations) {
        const idx = Math.floor(Math.random() * (hierarchy.length - 1));
        hierarchy.splice(idx, 1);
        iterations++;
    }
    
    if (iterations >= maxIterations) {
        console.warn('Warning: Max iterations reached in pruneHierarchy');
        return hierarchy.slice(0, targetLength);
    }
    
    console.log('Pruned hierarchy:', hierarchy.map(x => x.term).join(' → '));
    return hierarchy;
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
        default:
            console.warn(`Warning: Unknown tag type ${tag}`);
            return generateLoremIpsumSentence();
    }
}

/**
 * Generate content structure with inline HTML
 * @param {Array} hierarchy Term hierarchy
 * @param {number} targetKB Target size in KB
 * @returns {Array} Structure with content and HTML
 */
function generateStructure(hierarchy, targetKB) {
    console.log(`\nGenerating structure targeting ${targetKB}KB...`);
    const structure = [];
    const minBytes = CONFIG.minKB * 1024;
    const targetBytes = targetKB * 1024;
    let currentBytes = 0;
    let currentId = [1];
    let depth = 0;
    
    while (currentBytes < targetBytes) {
        // Generate header first
        if (depth < hierarchy.length - 2) {  // Skip headers for bottom two levels
            const headerContent = generateContent(hierarchy[depth].tag);
            const headerHTML = `<${hierarchy[depth].tag} id="${currentId.join('.')}">${headerContent}</${hierarchy[depth].tag}>`;
            
            structure.push({
                id: currentId.join('.'),
                tag: hierarchy[depth].tag,
                term: hierarchy[depth].term,
                depth: depth,
                content: headerContent,
                innerHTML: headerHTML
            });
            
            currentBytes += Buffer.byteLength(headerHTML, 'utf8');
        }
        
        // Generate content (p/span)
        const contentCount = 4 + Math.floor(Math.random() * 3);
        for (let i = 1; i <= contentCount && currentBytes < targetBytes; i++) {
            const contentId = [...currentId, i];
            const tag = hierarchy[hierarchy.length - 1].tag;
            const content = generateContent(tag);
            const innerHTML = `<${tag} id="${contentId.join('.')}">${content}</${tag}>`;
            
            structure.push({
                id: contentId.join('.'),
                tag: tag,
                term: hierarchy[hierarchy.length - 1].term,
                depth: hierarchy.length - 1,
                content,
                innerHTML
            });
            
            currentBytes += Buffer.byteLength(innerHTML, 'utf8');
        }
        
        // Move to next section
        currentId[0]++;
        
        if (currentBytes < minBytes) {
            console.log(`Current size ${Math.round(currentBytes/1024)}KB is below minimum, generating more...`);
        } else {
            console.log(`Reached ${Math.round(currentBytes/1024)}KB, filling to target...`);
        }
    }
    
    console.log(`Generated ${structure.length} elements, ${Math.round(currentBytes/1024)}KB / ${targetKB}KB`);
    return structure;
}

/**
 * Extract quotes from bottom-level elements
 * @param {Object} work Work metadata
 * @param {Array} content Content structure
 * @returns {Array} Extracted quotes
 */
function extractQuotes(work, content) {
    console.log(`\nExtracting quotes for work ${work.id}:`);
    
    const bottomElements = content.filter(el => 
        el && ((el.tag === 'span') || (el.tag === 'p' && el.term === 'Verse'))
    );
    
    if (bottomElements.length === 0) {
        console.warn('Warning: No bottom elements found for quotes');
        return [];
    }
    
    console.log(`Found ${bottomElements.length} bottom elements`);
    const numQuotes = 5 + Math.floor(Math.random() * 10);
    const quotes = [];
    
    for (let i = 0; i < numQuotes && bottomElements.length > 0; i++) {
        const element = bottomElements[Math.floor(Math.random() * bottomElements.length)];
        if (!element || !element.id || !element.content) {
            console.warn('Warning: Invalid element found, skipping...');
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

/**
 * Partition content into chunks with size tracking
 * @param {Array} content Content structure
 * @param {number} partitionSize Max partition size in KB
 * @returns {Array} [indexList, partitions]
 */
function partitionContent(content, partitionSize = CONFIG.partitionKB) {
    console.log(`\nPartitioning content (max ${partitionSize}KB per partition)...`);
    
    const indexList = [];
    const partitions = [];
    let currentPartition = [];
    let currentSize = 0;

    // Process each complete element
    content.forEach((element) => {
        const elementHTML = element.innerHTML;
        const elementSize = Buffer.byteLength(elementHTML, 'utf8') / 1024;
        
        // Start new partition if current would exceed size
        if (currentSize + elementSize > partitionSize && currentPartition.length > 0) {
            partitions.push(currentPartition);
            currentPartition = [];
            currentSize = 0;
            indexList.push(element.id);
        }
        
        currentPartition += elementHTML;
        currentSize += elementSize;
    });
    
    // Add final partition
    if (currentPartition.length) {
        partitions.push(currentPartition);
    }

    console.log(`Created ${partitions.length} partitions`);
    return [indexList, partitions];
}

/**
 * Generate complete test data set
 */
function generateTestData() {
    try {
        const authors = generateAuthors(CONFIG.numAuthors);
        const works = generateWorks(CONFIG.numWorks, authors);
        const quotes = [];
        
        console.log('\nGenerating work content...');
        
        for (const work of works) {
            try {
                const range = CONFIG.maxKB - CONFIG.minKB;
                const targetKB = CONFIG.minKB + Math.floor(Math.random() * range);
                console.log(`\nProcessing work ${work.id} (target: ${targetKB}KB):`);
                
                const initial = buildHierarchy();
                const pruned = pruneHierarchy([...initial]);
                work.locationSyntax = pruned.map(x => x.term);
                
                const structure = generateStructure(pruned, targetKB);
                const workQuotes = extractQuotes(work, structure);
                quotes.push(...workQuotes);
                
                const [indexList, partitions] = partitionContent(structure);
                
                fs.writeFileSync(
                    path.join(__dirname, `work${work.id}.json`),
                    JSON.stringify({indexList, partitions}, null, 2)
                );
                console.log(`Wrote work${work.id}.json (${partitions.length} partitions)`);
            } catch (err) {
                console.error(`Error processing work ${work.id}:`, err);
            }
        }
        
        // Generate enhanced bios
        for (const author of authors) {
            try {
                const paragraphs = [];
                // Generate 4-5 paragraphs for 2-3KB total
                const numParagraphs = 4 + Math.floor(Math.random() * 2);
                for (let i = 0; i < numParagraphs; i++) {
                    paragraphs.push(`<p>${generateLoremIpsumParagraph()}</p>`);
                }
                
                fs.writeFileSync(
                    path.join(__dirname, `bio${author.id}.html`),
                    paragraphs.join('\n\n')
                );
                console.log(`Wrote bio${author.id}.html`);
            } catch (err) {
                console.error(`Error writing bio for author ${author.id}:`, err);
            }
        } 
    
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
        // Write metadata file with error handling
        try {
            fs.writeFileSync(
                path.join(__dirname, 'data-meta.json'),
                JSON.stringify(metaData, null, 2)
            );
            console.log('Wrote data-meta.json');
        } catch (err) {
            console.error('Error writing data-meta.json:', err);
            process.exit(1);
        }

        // Write quotes file with error handling
        try {
            fs.writeFileSync(
                path.join(__dirname, 'data-all-quotes.json'),
                JSON.stringify(quotes, null, 2)
            );
            console.log('Wrote data-all-quotes.json');
        } catch (err) {
            console.error('Error writing data-all-quotes.json:', err);
            process.exit(1);
        }

        // Output final statistics
        console.log(`\nGeneration complete:`);
        console.log(`- ${authors.length} authors`);
        console.log(`- ${works.length} works`);
        console.log(`- ${quotes.length} quotes`);
        console.log(`- Size range: ${CONFIG.minKB}-${CONFIG.maxKB}KB`);
        console.log(`- Partition size: ${CONFIG.partitionKB}KB`);


    } catch (err) {
        console.error('Fatal error during data generation:', err);
        process.exit(1);
    } // End main try.. catch block for generateTestData

} // End of generateTestData

// Execute with error handling
try {
    generateTestData();
} catch (err) {
    console.error('Fatal error during data generation:', err);
    process.exit(1);
}



