/*Require Crypto-js functionalities*/

const crypto = require("crypto");

/*Check imported functions*/ 
//console.log(crypto.getHashes());
//console.log(crypto.getCiphers());

/*Create first hash*/

var hash = crypto.createHash('sha256')
    .update('data1')
    .digest('hex');

/*Show me the hash!*/

console.log(hash);
