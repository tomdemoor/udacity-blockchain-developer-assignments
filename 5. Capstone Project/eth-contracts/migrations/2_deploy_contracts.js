// migrating the appropriate contracts
var Verifier = artifacts.require("Verifier");
var SolnSquareVerifier = artifacts.require("SolnSquareVerifier");

module.exports = async function(deployer) {
  await deployer.deploy(Verifier);
  await deployer.deploy(
    SolnSquareVerifier,
    Verifier.address,
    'TriStarHomes',
    'TSH',
    'https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/',
  );
};
