pragma solidity >=0.6.0 <0.8.0;

abstract contract FlightSuretyDataInterface {
  // AIRLINE
  function _registerAirline(address account, bool isOperational) virtual external;
  function getAirlineOperatingStatus(address account) virtual external returns(bool);
  function setAirlineOperatingStatus(address account, bool status) virtual external;
  function getAirlineRegistrationStatus(address account) virtual external returns(bool);
  function fundAirline(address airline, uint256 amount) virtual external;
  function getAirlineFunding(address airline) virtual external returns(uint256);

  // MULTI-PARTY CONSENSUS
  function getVoteCounter(address account) virtual external  returns(uint);
  function addVoterCounter(address airline, uint count) virtual external;
  function resetVoteCounter(address account) virtual external;
  function getVoterStatus(address voter) virtual external returns(bool);
  function addVoters(address voter) virtual external;

  // PASSENGER
  function registerInsurance(address airline, address passenger, uint256 amount) virtual external;
  function creditInsurees(address airline, address passenger, uint256 amount) virtual external;
  function getInsuredPassenger_amount(address airline) virtual external returns(address, uint256);
  function getPassengerCredit(address passenger) virtual external returns(uint256);
  function withdraw(address passenger) virtual external returns(uint256);

  // UTILITY
  function multiCallsLength() virtual external returns(uint);
}