//require('dotenv').config(); //load local env files

const HDWalletProvider = require('truffle-hdwallet-provider');
const infuraKey = "enter here";

//create .env file in root folder with string of your seed phrase. -> MNEMONIC=”word1 word2 ...”
const mnemonic = process.env.MNEMONIC;

module.exports = {
  compilers: {
    solc: {
      version: "^0.4.23"
    }
  },
  networks: {
    development: {
      host: "127.0.0.1", // Localhost (default: none)
      port: 8545, 
      network_id: "*" // Any network (default: none)
    },
    rinkeby: {
      provider: () => new HDWalletProvider(mnemonic, `https://rinkeby.infura.io/v3/${infuraKey}`),
      network_id: 4, // Rinkeby Network ID
      gas: 6800000, // Rinkeby has a lower block limit than mainnet
      gasPrice: 1000000000 //1 gwei (in wei) (default: 100 gwei)
    }
  }
};
