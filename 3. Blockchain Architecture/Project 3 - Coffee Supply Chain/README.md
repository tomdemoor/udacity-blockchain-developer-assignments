# Coffee Supply Chain Dapp
This repository containts an **Ethereum DApp** that demonstrates a Supply Chain flow between a Seller and Buyer. The user story is similar to any commonly used supply chain process. A **Seller** can add items to the inventory system stored in the blockchain. A **Buyer** can purchase such items from the inventory system. Additionally a Seller can mark an item as **Shipped**, and similarly a Buyer can mark an item as **Received**.

 The coffee beans are harvested by the farmers, are then sold to the distributors, and the distributors then distribute them to the retailers, and finally, the consumer purchases them.

## Contract Address & Transaction Details
Contract has been deployed on rinkeby test network:
[0x61f6e2cca26d016272f56525d20ea6740558265c](https://rinkeby.etherscan.io/address/0x61f6e2cca26d016272f56525d20ea6740558265c)
Transaction Details:
[0x1195c69cfe27ebdf4d8aba99603a8d6b808d53677fdbf84202e6fb1772b119cc](https://rinkeby.etherscan.io/tx/0x1195c69cfe27ebdf4d8aba99603a8d6b808d53677fdbf84202e6fb1772b119cc)

## Libraries
* Truffle : `v5.2.5`: A development environment, testing framework and asset pipeline for blockchains using the Ethereum Virtual Machine (EVM), aiming to make life as a developer easier
* Web3.js: `v1.2.1`: A collection of libraries that allow you to interact with a local or remote ethereum node using HTTP, IPC or WebSocket.

## UML Diagrams
### Activity Diagram
![Activity diagram.](/uml/activity.png)

### Sequence Diagram
![Sequence diagram.](/uml/sequence.png?raw=true)

### State Diagram
![State diagram.](/uml/state.png?raw=true)

### Class (Data Model) Diagram
![Model diagram.](/uml/model.png?raw=true)

## Docs
### Requirements
1. ganache-cli
2. truffle
3. metamask
4. infura account

### Installation
Install dependencies:
```
npm i -g truffle ganache-cli
```
Clone this repository:
```sh
git clone https://github.com/muratgozel/blockchain-nanodegree-project-3.git
```
Enter project directory and install the project:
```sh
cd blockchain-nanodegree-project-3
npm install
```
Finally, update `infuraKey` and `mnemonic` constants inside the `truffle.js` config file according to your own values.
1. `mnemonic` is the recovery text that metamask gave you on your initial metamask setup.
2. `infuraKey` can be obtained from infura.io site by creating a new project.

### Usage
To start developing and making changes on the contract, run:
```sh
truffle compile
```
and:
```sh
truffle test
```
to test your changes.

A user interface is also available and can be accessed at `http://localhost:3000` after you initiated the local server:
```sh
npm run dev
```

When you are done and ready to deploy, deploy to the rinkeby network:
```sh
truffle migrate --network rinkeby
```
