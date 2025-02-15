const fs = require('fs');
const path = require('path');

// Get console arguments
const [,, inputFile, charLimit] = process.argv;

// Validate arguments
if (!inputFile || !charLimit) {
  console.error('Usage: node partition.js <inputFile> <charLimit>');
  process.exit(1);
}

// Convert charLimit to a number
const charLimitNum = parseInt(charLimit * 1000, 10);
if (isNaN(charLimitNum) || charLimitNum <= 0) {
  console.error('Character limit must be a positive number.');
  process.exit(1);
}

// Output file path
const outputFile = path.join(path.dirname(inputFile), `${path.basename(inputFile, path.extname(inputFile))}_partitions.js`);

// Read the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the input file:', err);
    return;
  }

  // Remove new lines
  data = data.replace(/\n/g, '');

  // Initialize variables
  let currentPart = '';
  let currentLength = 0;
  let nestingLevel = 0;
  const parts = [];

  // Process the content character by character
  for (let i = 0; i < data.length; i++) {
    currentPart += data[i];
    currentLength++;

    // Update nesting level
    if (data[i] === '<' && data[i + 1] !== '/') {
      nestingLevel++;
    } else if (data[i] === '<' && data[i + 1] === '/') {
      nestingLevel--;
    }

    // Check if the current part exceeds the character limit and we are not inside any nested tags
    if (currentLength >= charLimitNum && nestingLevel === 0 && data.slice(i - 1, i + 1) === '</') {
      // Find the next '>' to ensure we are at the end of the closing tag
      const closingTagIndex = data.indexOf('>', i);
      if (closingTagIndex !== -1) {
        currentPart += data.slice(i + 1, closingTagIndex + 1);
        parts.push(currentPart);
        currentPart = '';
        currentLength = 0;
        i = closingTagIndex; // Move the index to the end of the closing tag
      }
    }
  }

  // Add the remaining part if any
  if (currentPart.length > 0) {
    parts.push(currentPart);
  }

  // Create the JavaScript content
  const jsContent = `const partitions = [\n${parts.map(part => `\`${part}\``).join(',\n')}\n];\n\nexport default partitions;`;

  // Write the output file as a JavaScript file
  fs.writeFile(outputFile, jsContent, 'utf8', err => {
    if (err) {
      console.error('Error writing the output file:', err);
      return;
    }

    console.log('Processing complete. Output written to', outputFile);
  });
});