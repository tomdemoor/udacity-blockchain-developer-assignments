/*##########################
CONFIGURATION
##########################*/

var Web3 = require("web3")
var EthereumTransaction = require("ethereumjs-tx").Transaction
var web3 = new Web3('HTTP://127.0.0.1:8545')

// Set Addresses
var sendingAddress = '0x699E53B51061400234Ea9D889d6f2b57e21D1055' 
var receivingAddress = '0x0264e6eC3419d8814D05FBdb5cb9C7c0ad6184AF'

web3.eth.getBalance(sendingAddress).then(console.log)
web3.eth.getBalance(receivingAddress).then(console.log)
      
/*##########################
CREATE A TRANSACTION
##########################*/

var rawTransaction = {
    nonce: 0,
    to: receivingAddress,
    gasPrice: 20000000,
    gasLimit: 30000,
    value: 1,
    data: ""
}

/*##########################
Sign the Transaction
##########################*/

var privateKeySender = 'a60a7061f51d17571644cab2e10f1386b97746916e012cd4d942dcbb0a65a631' 
var privateKeySenderHex = new Buffer(privateKeySender, 'hex')
var transaction = new EthereumTransaction(rawTransaction)
transaction.sign(privateKeySenderHex)

var serializedTransaction = transaction.serialize();
web3.eth.sendSignedTransaction(serializedTransaction);

//https://ethstats.net/

/*##########################
Gas Prices
##########################*/

//web3.eth.getGasPrice([callback])
//eb3.eth.getUncle(blockHashOrBlockNumber, uncleIndex [, returnTransactionObjects] [, callback])
//web3.eth.getBlockTransactionCount(blockHashOrBlockNumber [, callback])