pragma solidity >=0.5.0 <0.5.3;

import "./Verifier.sol";
import "./ERC721Mintable.sol";

// define another contract named SolnSquareVerifier that inherits from your ERC721Mintable class
contract SolnSquareVerifier is TristarHomesERC721Token {
  
  // define a contract call to the zokrates generated solidity contract <Verifier> or <renamedVerifier>
  // ++ instantiated inside CONSTRUCTOR
  Verifier verifier;

  constructor(
    address solVerifier,
    string memory _name, string memory _symbol, string memory _baseTokenURI
  ) public TristarHomesERC721Token(_name, _symbol, _baseTokenURI) {
    verifier = Verifier(solVerifier);
  }

  // define a solutions struct that can hold an index & an address
  struct Solution {
    uint256 index;
    address solVerifiedUser;
  }

  // define an array of the above struct
  Solution[] addedSolutions;


  // define a mapping to store unique solutions submitted
  mapping(bytes32 => Solution) uniqueSolutions;


  // Create an event to emit when a solution is added
  event NewSolutionAdded(uint256 index, address solVerifiedUser, bytes32 hashKey);


  // Create a function to add the solutions to the array and emit the event
  function addNewSolution(uint256 index, address solVerifiedUser, bytes32 hashKey) public {
    Solution memory newSolution = Solution(index, solVerifiedUser);

    // Add Solution struct instance to addedSolutions array
    addedSolutions.push(newSolution);

    // Add new Solution struct instance to map
    uniqueSolutions[hashKey] = newSolution;

    // Emit Event
    emit NewSolutionAdded(index, solVerifiedUser, hashKey);
  }


  // Create a function to mint new NFT only after the solution has been verified
  function verifiedMint(
    address solVerifiedUser,
    uint256 tokenId,
    uint256[2] memory a,
    uint256[2][2] memory b,
    uint256[2] memory c,
    uint256[2] memory input
    ) public returns(bool isMinted) {
      isMinted = false;
      bytes32 hashKey = keccak256(abi.encodePacked(a, b, c, input));

      //  - make sure the solution is unique (has not been used before)
      require(uniqueSolutions[hashKey].solVerifiedUser == address(0), "Solution for computed hashkey has been used before");

      // Verify Tx Proof
      bool isVerified = verifier.verifyTx(a, b, c, input);
      require(isVerified, "Proof for Tx is invalid");

      //  msg-sender for adding solution to mint token for address -> solVerifiedUser
      mint(solVerifiedUser, tokenId);
      addNewSolution(tokenId, msg.sender, hashKey);
    }

}