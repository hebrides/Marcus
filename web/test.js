/* Display process arguments */

process.argv.forEach(function (val, index, array) {
  console.log(index + ': ' + val);
});

if (process.argv[2] === "rotated") {
 console.log("Rotated Quote Selected!!\n");
} else {
 console.log("Random Quote \n");
}

console.log(__dirname);
