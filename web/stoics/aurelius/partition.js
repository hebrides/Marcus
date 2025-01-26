const fs = require('fs');
const path = require('path');

// Get console arguments
const [,, inputFile, charLimit] = process.argv;

// Validate arguments
if (!inputFile || !charLimit) {
  console.error('Usage: node add_parts.js <inputFile> <charLimit>');
  process.exit(1);
}

// Convert charLimit to a number
const charLimitNum = parseInt(charLimit*1000, 10);
if (isNaN(charLimitNum) || charLimitNum <= 0) {
  console.error('Character limit must be a positive number.');
  process.exit(1);
}

// Output file path
const outputFile = path.join(path.dirname(inputFile), `${path.basename(inputFile, path.extname(inputFile))}_with_parts.html`);

// Read the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the input file:', err);
    return;
  }

  // Initialize variables
  let partNumber = 1;
  let currentPart = '';
  let currentLength = 0;
  const parts = [];

  // Split the file content into lines
  const lines = data.split('\n');

  // Process each line
  lines.forEach(line => {
    // Add the line to the current part
    currentPart += line + '\n';
    currentLength += line.length;

    // Check if the current part exceeds the character limit
    if (currentLength >= charLimitNum) {
      // Close the current part and start a new one
      parts.push(`<part id="p${partNumber}">\n${currentPart}</part>`);
      partNumber++;
      currentPart = '';
      currentLength = 0;
    }
  });

  // Add the remaining part if any
  if (currentPart.length > 0) {
    parts.push(`<part id="p${partNumber}">\n${currentPart}</part>`);
  }

  // Join all parts into a single string
  const outputData = parts.join('\n');

  // Write the output file
  fs.writeFile(outputFile, outputData, 'utf8', err => {
    if (err) {
      console.error('Error writing the output file:', err);
      return;
    }

    console.log('Processing complete. Output written to', outputFile);
  });
});