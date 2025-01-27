const fs = require('fs');
const path = require('path');

// Input and output file paths
const inputFile = path.join(__dirname, 'meditations.html');
const outputFile = path.join(__dirname, 'meditations_with_ids.html');

// Read the input file
fs.readFile(inputFile, 'utf8', (err, data) => {
  if (err) {
    console.error('Error reading the input file:', err);
    return;
  }

  // Initialize counters
  let bookNumber = 1;
  let verseNumber = 1;

  // Split the file content into lines
  const lines = data.split('\n');

  // Process each line
  const processedLines = lines.map(line => {
    // Check if the line contains a <h2> tag indicating a new book
    if (line.includes('<h2')) {
      line = line.replace('<h2>', `<h2 id="${bookNumber}">`);
      bookVerseNumber = bookNumber;
      bookNumber++;
      verseNumber = 1;
    }

    // Check if the line contains a <p> tag
    if (line.includes('<p>')) {
      // Add the id attribute to the <p> tag
      line = line.replace('<p>', `<p id="${bookVerseNumber}.${verseNumber}">`);
      verseNumber++;
    }

    return line;
  });

  // Join the processed lines back into a single string
  const outputData = processedLines.join('\n');

  // Write the output file
  fs.writeFile(outputFile, outputData, 'utf8', err => {
    if (err) {
      console.error('Error writing the output file:', err);
      return;
    }

    console.log('Processing complete. Output written to', outputFile);
  });
});