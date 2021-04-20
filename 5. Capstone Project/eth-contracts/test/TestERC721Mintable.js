var ERC721MintableComplete = artifacts.require('TristarHomesERC721Token');

contract('TestERC721Mintable', accounts => {
  const account_one = accounts[0];    // OWNER
  const account_two = accounts[1];    // TEST ACC
  const base_uri = "https://s3-us-west-2.amazonaws.com/udacity-blockchain/capstone/" 

  describe('match erc721 spec', function () {
    beforeEach(async function () {
      // Initialize Contract
      this.contract = await ERC721MintableComplete.new('TriStarHomes', 'TSH', base_uri, { from: account_one });

      // mint multiple tokens - TriStar Homes - can be minted by contract owner only i.e. account_one
      await this.contract.mint(account_one, 1996, {from: account_one});
      await this.contract.mint(account_one, 2000, {from: account_one});
      await this.contract.mint(account_one, 2008, {from: account_one});
      await this.contract.mint(account_two, 2020, {from: account_one});
    })

    it('should return total supply', async function () {
      const totalMintedTokens = await this.contract.totalSupply.call();
      assert.equal(totalMintedTokens.toNumber(), 4, 'Total minted token supply is not correct');
    })

    it('should get token balance', async function () {
      // Check balance for account_one i.e. owner
      const account_one_tokenBalance = await this.contract.balanceOf.call(account_one);
      const account_two_tokenBalance = await this.contract.balanceOf.call(account_two);
      assert.equal(account_one_tokenBalance.toNumber(), 3, 'Token balance of account_one is incorrect');
      assert.equal(account_two_tokenBalance.toNumber(), 1, 'Token balance of account_one is incorrect');
    })

    // token uri should be complete i.e: 
    it('should return token uri', async function () {
      const tokenUri = await this.contract.tokenURI.call(1996);
      const expectedUri = `${base_uri}1996`;
      assert.equal(tokenUri, expectedUri, 'Minted token uri is set incorrectly');
    })

    it('should transfer token from one owner to another', async function () {
      // Transfer ownership of token id 2008 from account_one to account_two
      await this.contract.transferFrom(account_one, account_two, 2008, {from: account_one});
      // Find out who is new owner of token id 2008 after transfer
      const newTokenOwner = await this.contract.ownerOf.call(2008);
      assert.equal(newTokenOwner, account_two, 'Token id 2008 ownership is not transferred correctly');
    })
  });

  describe('have ownership properties', function () {
    beforeEach(async function () {
      // According to this Contract owner is ACCOUNT_ONE
      this.contract = await ERC721MintableComplete.new('TriStarHomes2', 'TSH2', base_uri, { from: account_one });
    })

    it('should fail when minting when address is not contract owner', async function () {
      try {
        // Trying to mint triStar token with account other than contract owner
        await this.contract.mint(account_one, 1996, {from: account_two});
      } catch (err) {
        // console.log(err.message);
        assert.equal(err.reason, "Caller is not owner of contract", "Token got minted with by account other than owner");
      }
    })

    it('should return contract owner', async function () {
      const contractOwner = await this.contract.getOwner.call();
      assert.equal(contractOwner, account_one, 'Contract owner is not set correctly');
    })

  });
})