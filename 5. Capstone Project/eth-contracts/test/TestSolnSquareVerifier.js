var Verifier = artifacts.require('Verifier');
var SolnSquareVerifier = artifacts.require('SolnSquareVerifier');

// - use the contents from proof.json generated from zokrates steps
var proof = require('../../zokrates/code/square/proof.json');

contract('TestSolnSquareVerifier', accounts => {
  const account_one = accounts[0];    // OWNER
  const account_two = accounts[1];    // TEST ACC
  const proofComputedHashKey = "0x0d40154b95ce2a4104cf32ef7d3ab4117477726f84de6d52d05c9c933292a714";

  describe('Adding New Verified Solution', function () {
    beforeEach(async function () {
      // Initialize Contract
      this.verifierContract = await Verifier.new({ from: account_one });
      this.contract = await SolnSquareVerifier.new(
        this.verifierContract.address,
        'TriStarHomes',
        'TSH',
        'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/',
        { from: account_one });
    });

    
    it('Test if a new solution can be added for contract', async function () {
      const fnLogs = await this.contract.addNewSolution(2021, account_one, proofComputedHashKey);
      // console.log(fnLogs.logs[0].event);
      assert.equal(fnLogs.logs[0].event, 'NewSolutionAdded', "New Solution was not added");
    });
  });

  describe('Minting New Verified Token', function () {
    beforeEach(async function () {
      // Initialize Contract
      this.verifierContract = await Verifier.new({ from: account_one });
      this.contract = await SolnSquareVerifier.new(
        this.verifierContract.address,
        'TriStarHomes',
        'TSH',
        'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/',
        { from: account_one });
    });

    it('Test if an ERC721 token can be minted for contract', async function () {
      var fnLogs = await this.contract.verifiedMint(account_one, 2021, proof.proof.a, proof.proof.b, proof.proof.c, proof.inputs);

      assert.equal(fnLogs.logs[1].event, "NewSolutionAdded",'Verifier solution was not added successfully');
      assert.equal(fnLogs.logs[0].event, "Transfer", 'ERC721 was not transfered to account_one');
    });
  });
})
