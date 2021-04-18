
const FlightSuretyAppABI = require('../../build/contracts/FlightSuretyApp.json');
const Config = require('./config.json');
const Web3 = require('web3');
const express = require('express');
const cors = require('cors');

// WEB3 INTIALIZATION
let web3ProviderWebSocketUrl = Config["localhost"].url.replace('http', 'ws');
let web3 = new Web3(new Web3.providers.WebsocketProvider(web3ProviderWebSocketUrl));
web3.eth.defaultAccount = web3.eth.accounts[0];

// REFERENCE TO DEPLOYED CONTRACT INSTANCE
let flightSuretyApp = new web3.eth.Contract(FlightSuretyAppABI.abi, Config["localhost"].appAddress);

// // LISTEN FOR 'OracleRequest' EVENT
// flightSuretyApp.OracleRequest({}, (error, result) => {
//   if (error) console.error(error);
//   console.log(`ORACLE REQUEST => index: ${result.args.index}, flight: ${result.args.flight}, timestamp: ${result.args.timestamp}\n`);
// });

const flights = [
  { "id": 0, "name": "FLGT001" },
  { "id": 1, "name": "FLGT002" },
  { "id": 2, "name": "FLGT003" },
  { "id": 3, "name": "KL1105" },
  { "id": 4, "name": "KE6419" },
  { "id": 5, "name": "KL1107" },
  { "id": 6, "name": "9W8515" }
]

let oracle_address = [];
let eventIndex = null;


function initOracles() {
  return new Promise((resolve, reject) => {
    web3.eth.getAccounts().then(accounts => {
      let rounds = 22
      let oracles = [];
      flightSuretyApp.methods.REGISTRATION_FEE().call().then(fee => {

        accounts.slice(11, 33).forEach(account => {
          flightSuretyApp.methods.registerOracle().send({
            from: account,
            value: fee,
            gas: 999999,
            gasPrice: 200000000
          }).then(() => {
            flightSuretyApp.methods.getMyIndexes().call({
              from: account
            }).then(result => {
              oracles.push(result);
              oracle_address.push(account);
              console.log(`Oracle Registered: ${result[0]}, ${result[1]}, ${result[2]} at ${account}`);
              rounds -= 1;
              if (!rounds) {
                resolve(oracles);
              }
            }).catch(err => {
              reject(err);
            });
          }).catch(err => {
            reject(err);
          });
        });

      }).catch(err => {
        reject(err);
      });
    }).catch(err => {
      reject(err);
    });
  });
}



initOracles().then(oracles => {
  console.log("All oracles registered");
  initREST();
  flightSuretyApp.methods.SubmitOracleResponse({
    fromBlock: "latest"
  }, (error, event) => {
    if (error) {
      console.log(error)
    }
    console.log(event);

    let airline = event.returnValues.airline;
    let flight = event.returnValues.flight;
    let timestamp = event.returnValues.timestamp;
    let indexes = event.returnValues.indexes;
    let statusCode = event.returnValues.statusCode;

    for (let a = 0; a < oracle_address.length; a++) {
      console.log("Oracle loop ", a);
      flightSuretyApp.methods.submitOracleResponse(indexes, airline, flight, timestamp, statusCode)
        .send({
          from: oracle_address[a]
        }).then(result => {
          console.log(result);
        }).catch(err => {
          console.log("Oracle didn't respond");
        });
    }
  });


  flightSuretyApp.RegisterAirline({ fromBlock: 0 }, (error, event) => {
    if (error) console.log(error)
    console.log(event)
  });

  flightSuretyApp.FundedLines({ fromBlock: 0 }, (error, event) => {
    if (error) console.log(error)
    console.log(event)
  });

  flightSuretyApp.PurchaseInsurance({ fromBlock: 0 }, (error, event) => {
    if (error) console.log(error)
    console.log(event)
  });


  flightSuretyApp.CreditInsurees({ fromBlock: 0 }, (error, event) => {
    if (error) console.log(error)
    console.log(event)
  });


  flightSuretyApp.Withdraw({ fromBlock: 0 }, (error, event) => {
    if (error) console.log(error)
    console.log(event)
  });

  flightSuretyApp.OracleRequest({ fromBlock: 0 }, (error, event) => {
    if (error) console.log(error)

    eventIndex = event.returnValues.index;
    console.log(event)
  });

  flightSuretyApp.OracleReport({ fromBlock: 0 }, (error, event) => {
    if (error) console.log(error)
    console.log(event)
  });

}).catch(err => {
  console.log(err.message);
})



// INITIALIZE EXPRESS
const app = express();

function initREST() {
  app.get('/api', (req, res) => {
    res.send({
      message: 'An API for use with your Dapp!'
    })
  })

  app.get('/flights', (req, res) => {
    res.json({
      result: flights
    })
  })

  app.get('/eventIndex', (req, res) => {
    res.json({
      result: eventIndex
    })
  })
  console.log("App.get defined");
}
app.use(cors());

// START LISTENING FOR API REQUESTS ON 3000
// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Listening at http://localhost:${PORT}`)
// });


export default app;
