[![GitHub](assets/icons/licenseMIT.svg)](LICENSE.md)

# Udacity Blockchain Development Nanodegree

## About Me
Why hello there. I’m Tom 👋 I am a freelance growth marketing consultant working with brands like BMW, ING, Sony Music, Philips, etc. Because of my education in tech, I am always on the lookout of the next big thing. My curioucity drove me to learning blockchain development to understand the core features of blockchain technology. One of the ways to learn was to enroll in Udacity's nanodegree program.

## Nanodegree Projects

- [x] [Chapter 1: Blockchain Fundamentals](#chapter-1)
- [x] [Chapter 2: Build CryptoStar Dapp on Ethereum](#chapter-2)
- [x] [Chapter 3: Blockchain Architecture](#chapter-3)
- [x] [Chapter 4: Dapps with autonomous smart contracts](#chapter-4)
- [x] [Chapter 5: Capstone Project: Real Estate Dapp](#chapter-5)


## Github Repo Structure
This folder structure is a [multi-root workspace](https://code.visualstudio.com/docs/editor/multi-root-workspaces) configured in [Visual Studio Code](https://code.visualstudio.com/).  To open the workspace in VS Code, open the `blockchain-dev-course.code-workspace` file.  Each root folder is a chapter containing a final project for submission and practice exercises building up to the final project. Each project contains a `README.md` file with further instructions on running the project code.

- - - -

## Chapter 1: Blockchain Fundamentals
<img src="assets/icons/project1.svg" width="100"/>

### The Basics of Blockchain
In the first chapter of the course, I learned the basics of blockchain technology, managing transactions, Bitcoin core & testnet to test applications, managing data in lockchain like assets, etc. During this course, code exercises were in order to teach the fundamentals of creating your own private blockchain. These are the subfolders added to the repo. They all build up to eventuelly completing the first assignment.

**Exercises:**
* [Hash Key Introduction](/1.%20Blockchain%20Fundamentals/1.1%20Hash%20Key%20Introduction): hashing information with crypto-js.
* [Javascript Promises Introduction](/1.%20Blockchain%20Fundamentals/1.2%20Javascript%20Promises%20Introduction): Introduction to working with the 'promises' method.
* [Blockchain Practice Block](/1.%20Blockchain%20Fundamentals/1.3%20Blockchain%20Practice%20Block): Creating your first block with data.
* [Block Data Model](/1.%20Blockchain%20Fundamentals/1.4%20Block%20Data%20Model): Creating a simple blockchain with block data.
* [Encode Decode Files](/1.%20Blockchain%20Fundamentals/1.5%20Encode%20Decode%20Files): Encode and decode assets like images and add this data in a block to the blockchain.
* [ExpressJS Introduction](/1.%20Blockchain%20Fundamentals/1.6%20ExpressJS): An introduction to using [ExpressJS](https://expressjs.com/) to run your blockchain.

### Assignment: Create Your Own Private Blockchain
In this project, I created a private blockchain to record ownership of stars.  Built as an `express.js` app, I implemented the code in `src/block.js` and `src/blockchain.js` that provides the functionality of validating a block on the blockchain, decoding the block, and constructing a chain of blocks that can be signed with an Bitcore wallet.  The project also exposes endpoints to search for blocks by block height, block hash, and by the address of the wallet that signed the block. I tested the application with API calls in POSTMAN.

More information about this project is available in the project folder: [Blockchain Fundamentals](/1.%20Blockchain%20Fundamentals/Project%201%20-%20Private%20Blockchain%20Assignment).

- - - -

## Chapter 2: Ethereum Smart Contracts, Tokens and Dapps
<img src="assets/icons/project2.svg" width="100"/>

### Build CryptoStar Dapp on Ethereum
The purpose of this project is to develop familiarity with building a decentralized app (dApp) on Ethereum.  

This project is build cryptostar dapp that implements a star notary smart contract, where the information about people's favorite stars in the sky can be managed by means of the blockchain.

### Sample Transaction of Star & Token Info

* Name: `StarCoin`
* Symbol: `SUN`

* Token & Contract Address: [`0x469E00808fd3F96D3Aaed508973B7c42A1867BeC`] https://rinkeby.etherscan.io/address/0x469E00808fd3F96D3Aaed508973B7c42A1867BeC
* Sample star creation transaction hash: [`0x841e3b8828e7d2989a3d8f2e439127547f78c39936d16da254c2ce3d786f5ebd`](https://rinkeby.etherscan.io/tx/0x841e3b8828e7d2989a3d8f2e439127547f78c39936d16da254c2ce3d786f5ebd)
* Contract decoded: (https://rinkeby.etherscan.io/bytecode-decompiler?a=0xdf7a49a99732465ad617ca3b6b0eb858afa74647)

More information about this project is available in the project folder: [Ethereum Smart Contracts, Tokens and Dapps](https://github.com/tomdemoor/udacity-blockchain-developer-assignments/tree/master/2.%20Ethereum%20Smart%20Contracts%2C%20tokens%20and%20Dapps).

- - - -

## Chapter 3: Blockchain Architecture

### Coffee Supply Chain Dapp

This repository containts an **Ethereum DApp** that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A **Seller** can add items to the inventory system stored in the blockchain. A **Buyer** can purchase such items from the inventory system. Additionally a Seller can mark an item as **Shipped**, and similarly a Buyer can mark an item as **Received**.

 The coffee beans are harvested by the farmers, are then sold to the distributors, and the distributors then distribute them to the retailers, and finally, the consumer purchases them.

### Contract Address & Transaction Details
Contract has been deployed on rinkeby test network:
[0x61f6e2cca26d016272f56525d20ea6740558265c](https://rinkeby.etherscan.io/address/0x61f6e2cca26d016272f56525d20ea6740558265c)
Transaction Details:
[0x1195c69cfe27ebdf4d8aba99603a8d6b808d53677fdbf84202e6fb1772b119cc](https://rinkeby.etherscan.io/tx/0x1195c69cfe27ebdf4d8aba99603a8d6b808d53677fdbf84202e6fb1772b119cc)

More information about this project is available in the project folder: [Blockchain Architecture](https://github.com/tomdemoor/udacity-blockchain-developer-assignments/tree/master/3.%20Blockchain%20Architecture).

- - - -

## Chapter 4: Dapps with autonomous smart contracts

FlightSurety is a project for Udacity's Blockchain course on flight insurance. This project is based on the ethereum blockchain.

Features:
* Passengers can buy flight insurance
   * If flight is delayed they are credited 1.5 times the cost of the insurance. 
* 2 smart contracts
* 1 interface contract
* Multi-party consesus implementation
* Seperation of concerns as architectual pattern

> NOTE : The starter code of this project was modified so it functions with the latest Truffle & Web3 configurations. It follows an updated Solidity Compiler 0.6.5

More information about this project is available in the project folder: [Dapp with autonomous smart contracts and oracles](https://github.com/tomdemoor/udacity-blockchain-developer-assignments/tree/master/4.%20Dapp%20with%20autonomous%20smart%20contracts%20and%20oracles).

- - - -

## Chapter 5: Capstone Project: Real Estate Dapp

This project teaches to mint your own tokens that represent your title to the properties. Before minting a token, you need verified ownership of the property. This will be done by using zk-SNARKs to create a verification system to prove ownership without revealing specific information of that property. Zk-SNARKS provides privacy. Once the token is verified it is placed on the Rinkeby blockchain testnet and on blockchain market place OpenSea's testnet.

OpenSea is a decentralized marketplace that is used for selling for crypto assets. On OpenSea, you can buy or sell any of these items through a smart contract, meaning that no central authority ever holds custody of your items. 

### Smart contract & transaction details

| Verifier Contract           | [0xfE3A8F76b0c044ACd8Ff4b85a426FCb0DE8BDAb3](https://rinkeby.etherscan.io/address/0xfE3A8F76b0c044ACd8Ff4b85a426FCb0DE8BDAb3) |
| --------------------------- | ------------------------------------------------------------ |
| SolnSquareVerifier Contract | [0x9d55d11E608829Aa25810187Df7fb82e8dDbD1B8](https://rinkeby.etherscan.io/address/0x9d55d11E608829Aa25810187Df7fb82e8dDbD1B8) |

tokenID5 - https://rinkeby.etherscan.io/tx/0x199a0374edae5640f69298ccacef0506eb26b3be7545ebe05599eb17149cbf17