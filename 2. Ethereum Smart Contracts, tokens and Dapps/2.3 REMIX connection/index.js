var Web3 = require("web3")
var web3 = new Web3('HTTP://127.0.0.1:7545')

web3.eth.getTransactionCount("0x699E53B51061400234Ea9D889d6f2b57e21D1055").then(console.log);

/**
 * CONNECT ON REMIX.ETHEREUM.ORG
 * 
pragma solidity ^0.4.24;

contract Message {
    string myMessage;

    function setMessage(string x) public {
        myMessage = x;
    }

    function getMessage() public view returns (string) {
        return myMessage;
    }
}
 * 
 * */