pragma solidity >=0.6.0 <0.8.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

contract FlightSuretyData {
  using SafeMath for uint256;

  //==========================================
  // DATA VARIABLES
  //==========================================

  struct Airlines {
    bool isRegistered;    // true when airline is added
    bool isOperational;   // true when seed amount is deposited
  }

  struct Insurance {
    address passenger;
    uint256 amount;
  }

  struct Fund {
    uint256 amount;
  }

  struct Voters {
    bool status;
  }

  // Acc used to deploy contract
  address private contractOwner;
  bool private operational = true;

  mapping(address => Airlines) airlines;
  mapping(address => Insurance) insurance;
  mapping(address => Fund) fund;
  mapping(address => Voters) voters;
  mapping(address => uint256) private authorizedCaller;
  mapping(address => uint256) private voteCount;
  mapping(address => uint256) balances;

  address[] multiCalls = new address[](0);


  //==========================================
  // EVENTS
  //==========================================

  event AuthorizedContract(address authContract);
  event DeAuthorizedContract(address authContract);


  //==========================================
  // MODIFIERS
  //==========================================

  modifier requireIsOperational() {
    require(operational, "Contract is currently not operational");
    _;
  }

  modifier requireContractOwner() {
    require(msg.sender == contractOwner, "Caller is not contract owner");
    _;
  }


  //==========================================
  // CONSTRUCTOR & UTILITY
  //==========================================
  
  constructor() public {
    contractOwner = msg.sender;
  }

  function isOperational() public view returns(bool){
    return operational;
  }

  function setOperatingStatus(bool mode) external requireContractOwner{
    operational = mode;
  }

  function authorizeCaller(address newContractAddress) external requireContractOwner {
    authorizedCaller[newContractAddress] = 1;
    emit AuthorizedContract(newContractAddress);
  }

  function deAuthorizeContract(address prevContractAddress) external requireContractOwner {
    delete authorizedCaller[prevContractAddress];
    emit DeAuthorizedContract(prevContractAddress);
  }


  //====================================================================================
  //                            SMART CONTRACT FUNCTIONS
  //====================================================================================

  //==========================================
  // Getters & Setters for Airline Struct

  // Add an airline to the registration queue
  // Can only be called from FlightSuretyApp contract  
 function _registerAirline(address account, bool airlineOpStatus) external requireIsOperational {
   airlines[account] = Airlines({
    isRegistered: true,
    isOperational: airlineOpStatus
   });
   setmultiCalls(account);
 }

  function getAirlineOperatingStatus(address account) external view requireIsOperational returns(bool) {
    return airlines[account].isOperational;
  }

  function setAirlineOperatingStatus(address account, bool status) external requireIsOperational {
    airlines[account].isOperational = status;
  }

  function getAirlineRegistrationStatus(address account) external view requireIsOperational returns(bool){
    return airlines[account].isRegistered;
  }

  function fundAirline(address airline, uint256 amount) external requireIsOperational {
    fund[airline] = Fund({
      amount: amount
    });
  }

  function getAirlineFunding(address airline) external view requireIsOperational returns(uint256) {
    return fund[airline].amount;
  }

  function isAirline(address airline) external view returns(bool) {
    require(airline != address(0), "requested airline is invalid");
    return airlines[airline].isRegistered;
  }
  
  //==========================================
  // Getters & Setters for voteCount mapping & Voters Struct

  function getVoteCounter(address account) external requireIsOperational view returns(uint) {
    return voteCount[account];
  }

  function addVoterCounter(address airline, uint count) external requireIsOperational {
    uint256 votes = voteCount[airline];
    voteCount[airline] = votes.add(count);
  }

  function resetVoteCounter(address account) external requireIsOperational {
    delete voteCount[account];
  }

  function getVoterStatus(address voter) external requireIsOperational view returns(bool) {
    return voters[voter].status;
  }

  function addVoters(address voter) external requireIsOperational {
    voters[voter] = Voters({
      status: true
    });
  }

  //==========================================
  // Passenger & Insurance related functions

  function registerInsurance(address airline, address passenger, uint256 amount) external requireIsOperational {
    insurance[airline] = Insurance({
      passenger: passenger,
      amount: amount
    });
    // Add Insurance Funds to airline
    uint256 airlineFund = fund[airline].amount;
    fund[airline].amount = airlineFund.add(amount);
  }

  // Credits payouts to insurees
  function creditInsurees(address airline, address passenger, uint256 amount) external requireIsOperational {
    // Check Validations
    require(passenger != address(0) && airline != address(0), "requested airline or passenger is invalid");
    require(insurance[airline].passenger == passenger, "Requested Passenger is not insured");
    
    uint256 insuranceAmount = insurance[airline].amount.div(2).mul(3);
    require(insuranceAmount == amount, "Requested insurance amount is invalid");

    // Transfer insurance fund to passenger's balance
    balances[passenger] = amount;
  }

  function getInsuredPassenger_amount(address airline) external requireIsOperational view returns(address, uint256) {
    return (insurance[airline].passenger, insurance[airline].amount);
  }

  function getPassengerCredit(address passenger) external requireIsOperational view returns(uint256) {
    return balances[passenger];
  }

  function withdraw(address passenger) external requireIsOperational returns(uint256) {
    uint256 amountToWithdraw = balances[passenger];
    delete balances[passenger];

    return amountToWithdraw;
  }


  //==========================================
  // Utility multicalls

  function multiCallsLength() external requireIsOperational view returns (uint){
      return multiCalls.length;
  }

  function setmultiCalls(address account) private {
      multiCalls.push(account);
  }


  function getFlightKey(address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32) {
    return keccak256(abi.encodePacked(airline, flight, timestamp));
  }

  // Initial funding for the insurance. Unless there are too many delayed flights
  // resulting in insurance payouts, the contract should be self-sustaining
  // function fund() public payable {
  // }
  // // Fallback function for funding smart contract.
  // fallback() external payable {
  //   fund();
  // }
}