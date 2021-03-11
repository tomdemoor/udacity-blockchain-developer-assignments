[![GitHub](assets/icons/licenseMIT.svg)](LICENSE.md)

# Udacity Blockchain Development Nanodegree

## About Me
Why hello there. I’m Tom 👋 I am a freelance growth marketing consultant working with brands like BMW, ING, Sony Music, Philips, etc. Because of my education in tech, I am always on the lookout of the next big thing. My curioucity drove me to learning blockchain development to understand the core features of blockchain technology. One of the ways to learn was to enroll in Udacity's nanodegree program.

## Nanodegree Projects

- [x] [Chapter 1: Blockchain Fundamentals](#chapter-1)
- [x] [Chapter 2: Build CryptoStar Dapp on Ethereum](#chapter-2)
(4 more chapters to come.)


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

More information will soon be available.