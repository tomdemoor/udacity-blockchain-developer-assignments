// Require file system access
fs = require('fs');

// Read file buffer 
imgReadBuffer = fs.readFileSync('scottie-clone.jpg');


// Encode image buffer to hex
imgHexEncode = new Buffer(imgReadBuffer).toString('hex');

// Output encoded data to console
console.log(imgHexEncode);