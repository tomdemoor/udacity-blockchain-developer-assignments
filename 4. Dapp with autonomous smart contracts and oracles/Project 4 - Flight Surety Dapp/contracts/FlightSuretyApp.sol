pragma solidity >=0.6.0 <0.8.0;

import "../node_modules/@openzeppelin/contracts/math/SafeMath.sol";

import "./DataInterfaceContract.sol";

contract FlightSuretyApp {
  using SafeMath for uint256;


  //==========================================
  // DATA VARIABLES
  //==========================================

  // Flight status codees
  uint8 private constant STATUS_CODE_UNKNOWN = 0;
  uint8 private constant STATUS_CODE_ON_TIME = 10;
  uint8 private constant STATUS_CODE_LATE_AIRLINE = 20;
  uint8 private constant STATUS_CODE_LATE_WEATHER = 30;
  uint8 private constant STATUS_CODE_LATE_TECHNICAL = 40;
  uint8 private constant STATUS_CODE_LATE_OTHER = 50;

  // Acc used to deploy contract
  address private contractOwner;

  // DataInterfaceContract Instance
  FlightSuretyDataInterface flightSuretyData;

  uint256 constant M = 4;
  bool private voteStatus = false;
  bool private operational = true;

  struct Flight {
    bool isRegistered;
    uint8 statusCode;
    uint256 updatedTimestamp;
    address airline;
  }

  mapping(bytes32 => Flight) private flights;


  //==========================================
  // EVENTS
  //==========================================

  event RegisterAirline(address account);
  event FundedAirlines(address funded, uint256 value);

  event PurchaseInsurance(address airline, address sender, uint256 amount);
  event CreditInsurees(address airline, address passenger, uint256 credit);  
  event Withdraw(address sender,uint256 amount);
  
  event SubmitOracleResponse(uint8 indexes, address airline, string flight, uint256 timestamp, uint8 statusCode);


  //==========================================
  // MODIFIERS
  //==========================================

  modifier requireIsOperational() {
    require(true, "Contract is currently not operational");
    _;
  }

  modifier requireContractOwner() {
    require(msg.sender == contractOwner, "Caller is not contract owner");
    _;
  }


  //==========================================
  // CONSTRUCTOR & UTILITY
  //==========================================
  
  constructor(address dataContract) public {
    contractOwner = msg.sender;
    flightSuretyData = FlightSuretyDataInterface(dataContract);
    flightSuretyData._registerAirline(contractOwner, true);
    emit RegisterAirline(contractOwner);
  }

  function isOperational() public view returns(bool) {
    return operational;
  }


  //==========================================
  // SMART CONTRACT FUNCTIONS
  //==========================================

  function registerAirline(address airline) external returns(bool, bool) {
    require(airline != address(0), "requested airline is invalid");
    require(!flightSuretyData.getAirlineRegistrationStatus(airline), "Airline is already registered");
    require(flightSuretyData.getAirlineOperatingStatus(msg.sender), "Airline is already operational");

    uint256 multicall_Length = flightSuretyData.multiCallsLength();

    if (multicall_Length < M){
        // Register airline directly in this case
        flightSuretyData._registerAirline(airline, false);
        emit RegisterAirline(airline);
        return(true, false);  // Registered without a vote
    } else {
      if(voteStatus){
        uint voteCount = flightSuretyData.getVoteCounter(airline);

        if(voteCount >= multicall_Length/2){
          // Airline has been voted in
          flightSuretyData._registerAirline(airline, false);

          voteStatus = false;
          flightSuretyData.resetVoteCounter(airline);

          emit RegisterAirline(airline);
          return(true, true);             

        } else {
          // Airline has been voted out
          flightSuretyData.resetVoteCounter(airline);
          return(false, true); 
        }
      } else {
        // Requesting for a vote
        return(false,false);                 
      }
    }
  }


  // Approve registration of fifth and subsequent airlines
  function approveAirlineRegistration(address airline, bool airline_vote) public requireIsOperational {
    
    require(!flightSuretyData.getAirlineRegistrationStatus(airline),"airline already registered");
    require(flightSuretyData.getAirlineOperatingStatus(msg.sender),"airline not operational");
    
    if(airline_vote == true){
      // Check and avoid duplicate vote for the same airline
      bool isDuplicate = false;
      uint incrementVote = 1;
      isDuplicate = flightSuretyData.getVoterStatus(msg.sender);

      // Check to avoid registering same airline multiple times
      require(!isDuplicate, "Caller has already voted.");
      flightSuretyData.addVoters(msg.sender);
      flightSuretyData.addVoterCounter(airline, incrementVote);
    }
    voteStatus = true;
  }


  function fund() public payable requireIsOperational {
    require(msg.value == 10 ether,"Ether should be 10");
    require(!flightSuretyData.getAirlineOperatingStatus(msg.sender),"airline already operational");

    flightSuretyData.fundAirline(msg.sender, msg.value);

    flightSuretyData.setAirlineOperatingStatus(msg.sender, true);

    emit FundedAirlines(msg.sender, msg.value);   
  }

  function processFlightStatus(address airline, uint8 statusCode) public {
    address passenger;
    uint256 amountPaid;
    (passenger, amountPaid) = flightSuretyData.getInsuredPassenger_amount(airline);

    require((passenger != address(0)) && (airline != address(0)), "'accounts' must be  valid address.");
    require(amountPaid > 0, "Passenger is not insured");

    // Only credit if flight delay is airline fault (airline late and late due to technical)
    if((statusCode == STATUS_CODE_LATE_AIRLINE) || (statusCode == STATUS_CODE_LATE_TECHNICAL)){
      uint256 credit = amountPaid.mul(3).div(2);

      flightSuretyData.creditInsurees(airline, passenger, credit);
      emit CreditInsurees(airline, passenger, credit);
    }
  }

  // Generate Flight Status Request for Registered Oracles
  function fetchFlightStatus(address airline, string calldata flight, uint256 timestamp) external {
    // Generate Random Index to determine which set of oracles to request.
    uint8 index = getRandomIndex(msg.sender);

    // Generate a unique key for storing the request
    bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
    oracleResponses[key] = ResponseInfo({
      requester: msg.sender,
      isOpen: true
    });
    
    // Notify Registered Oracles having index for New Open Request to fetch flight status
    emit OracleRequest(index, airline, flight, timestamp);
  }


  function buy(address airline) external payable requireIsOperational {
    // Check if airline is operational
    require(flightSuretyData.getAirlineOperatingStatus(airline), "airline not operational");
    
    // Check if amount range is greater than 0 ether and less than 1 ether.
    require((msg.value > 0 ether) && (msg.value <= 1 ether), "Insurance amount is not in 0 to 1 ETH range");

    // Register insurance in database
    flightSuretyData.registerInsurance(airline, msg.sender, msg.value);
    emit PurchaseInsurance(airline, msg.sender, msg.value);
  }


  function getPassenger_CreditedAmount() external returns(uint256) {
    uint256 credit = flightSuretyData.getPassengerCredit(msg.sender);
    return credit;
  }

    
  function withdraw() external requireIsOperational {
    require(flightSuretyData.getPassengerCredit(msg.sender) > 0, "Insufficient funds to withdraw");

    uint256 withdraw_value = flightSuretyData.withdraw(msg.sender);
    // Transfer credit to passenger wallet
    msg.sender.transfer(withdraw_value);
    
    emit Withdraw(msg.sender,withdraw_value);
  }


  //==========================================
  // ORACLE MANAGEMENT
  //==========================================

  // Incremented to add pseudo-randomness at various points
  uint8 private nonce = 0;    

  // Fee to be paid when registering oracle
  uint256 public constant REGISTRATION_FEE = 1 ether;

  // Number of oracles that must respond for valid status
  uint256 private constant MIN_RESPONSES = 3;

  struct Oracle {
    bool isRegistered;
    uint8[3] indexes;        
  }

  // Data Structure for response from Oracle
  struct ResponseInfo {
    address requester;
    bool isOpen;
    // Mapping key : status reported
    // Mapping value : array of address of oracles returned same status
    mapping(uint8 => address[]) responses;
  }

  // Track all registered oracles
  mapping(address => Oracle) private oracles;

  // Track all oracle responses
  // key = hash(index, flight, timestamp)
  mapping(bytes32 => ResponseInfo) private oracleResponses;


  // Event fired each time an oracle submits a response
  event FlightStatusInfo(address airline,string flight,uint256 timestamp,uint8 status);
  
  event OracleReport(address airline, string flight, uint256 timestamp, uint8 status);

  // Event fired when flight status request is submitted
  // Oracles track this and if they have a matching index they fetch data and submit a response
  event OracleRequest(uint8 index, address airline, string flight, uint256 timestamp);


  // Returns a random uint8 number
  function getRandomIndex(address account) internal returns (uint8) {
    uint8 maxValue = 10;
    // Pseudo random number...the incrementing nonce adds variation
    uint8 random = uint8(uint256(keccak256(abi.encodePacked(blockhash(block.number - nonce++), account))) % maxValue);
    if (nonce > 250) {
      nonce = 0;
    }
    return random;
  }

  // Returns array of three non-duplicating integers from 0-9
  function generateIndexes(address account) internal returns (uint8[3] memory){
    uint8[3] memory indexes;
    indexes[0] = getRandomIndex(account);

    indexes[1] = indexes[0];
    while (indexes[1] == indexes[0]) {
      indexes[1] = getRandomIndex(account);
    }
    indexes[2] = indexes[1];
    while ((indexes[2] == indexes[0]) || (indexes[2] == indexes[1])) {
      indexes[2] = getRandomIndex(account);
    }
    return indexes;
  }


  // Step 1 : Oracle register with smart contract
  // (an oracle will call this function to get registered with this smart contract)
  function registerOracle() external payable {
    // Check if oracle reg fee paid
    require(msg.value >= REGISTRATION_FEE, "Insufficient Oracle Registeration funds");

    // create 3 random numbers array
    uint8[3] memory indexes = generateIndexes(msg.sender);

    // register oracle
    oracles[msg.sender] = Oracle({
      isRegistered: true,
      indexes: indexes
    });
  }

  // Utility : In case contract owner wants to preview registered oracle info store
  function getMyIndexes() external view returns(uint8[3] memory) {
    require(oracles[msg.sender].isRegistered, "Not registered as an oracle");

    return oracles[msg.sender].indexes;
  }


  // Step 3 : Receive Response from Registered & Authorised Oracles 
  function submitOracleResponse(uint8 index, address airline, string calldata flight, uint timestamp, uint8 statusCode) external {
    require(
      oracles[msg.sender].indexes[0] == index ||
      oracles[msg.sender].indexes[1] == index ||
      oracles[msg.sender].indexes[2] == index, "Oracle is not authorised to submit response"
    );

    // Require that the response is being submitted for a request that is still open
    bytes32 key = keccak256(abi.encodePacked(index, airline, flight, timestamp));
    require(oracleResponses[key].isOpen == true, "Contract is no more accepting responses");

    oracleResponses[key].responses[statusCode].push(msg.sender);

    // Information isn't considered verified until at least MIN_RESPONSES
    // oracles respond with the same information
    emit OracleReport(airline, flight, timestamp, statusCode);
    if(oracleResponses[key].responses[statusCode].length >= MIN_RESPONSES){
      // Prevent any more responses since MIN_RESPONSE threshold has been reached
      // Announce to the world that verified flight status information is available
      oracleResponses[key].isOpen = false;
      emit FlightStatusInfo(airline, flight, timestamp, statusCode);

      // Handle flight status as appropriate
      processFlightStatus(airline, statusCode);
    }
  }

  function getFlightKey(address airline, string memory flight, uint256 timestamp) pure internal returns(bytes32) {
    return keccak256(abi.encodePacked(airline, flight, timestamp));
  }

  // function() external payable {
  //   fund();
  // }
}