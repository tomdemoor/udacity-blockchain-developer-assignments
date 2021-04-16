// npm install js-sha256
// Run with command: node hash.js

const sha256 = require('js-sha256'); // npm install js-sha256

/*
Alice has created a will (legal document) detailing how she would like to distribute her personal assets
upon her death. She wants to record this information to the blockchain for safety, but does not want to
reveal her net work or account addresses to the public. To do this she computes the SHA256 hash of her
document, records the hash to the blockchain and sends the complete document to Bob, her heir.
*/

/*
The super secret document!
*/
const document = 'Give 50 BTC from my wallet 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa to Bob';

/*
Alice computes the hash of her document
*/
const hash = sha256(document); // Result: 4f09ccb54e3074d49bb745d923fcc810e88181c241560b5499bc07919ed30ea7

console.log(`Alice hashes her document and records the following hash value to the blockchain: ${hash}`);

/*
Bob receives a document, which purports to be from Alice. He can compare the document to the hash by
computing the received document's SHA256 and verifying it matches the value he obtains from the blockchain
*/

if (sha256(document) === hash) {
    console.log('Document is legit 👍');
} else {
    console.log("Whoa! That's a fake document");
}

/*
Suppose instead that Bob's sister Eve wanted to inherit Alice's bitcoins, and she distributes a forged will.
Alice and Bob can still communicate with all the reliability as if she'd publicly written her will to the
blockchain itself
*/

const fake = 'Give 50 BTC from my wallet 1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa to Eve';
if (sha256(fake) === hash) {
    console.log('Document is legit 👍');
} else {
    console.log("Whoa! That's a fake document");
}