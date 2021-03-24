const StarNotary = artifacts.require('StarNotary');

let accounts;

contract('StarNotary', (accs) => {
  accounts = accs;
});

it('can Create a Star', async () => {
  const tokenId = 1;
  const instance = await StarNotary.deployed();
  await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] });
  assert.equal(await instance.tokenIdToStarInfo.call(tokenId), 'Awesome Star!');
});

it('lets user1 put up their star for sale', async () => {
  const instance = await StarNotary.deployed();
  const [user1] = accounts;
  const starId = 2;
  const starPrice = web3.utils.toWei('.01', 'ether');
  await instance.createStar('awesome star', starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  assert.equal(await instance.starsForSale.call(starId), starPrice);
});

it('lets user1 get the funds after the sale', async () => {
  const instance = await StarNotary.deployed();
  const [user1, user2] = accounts;
  const starId = 3;
  const starPrice = web3.utils.toWei('.01', 'ether');
  const balance = web3.utils.toWei('.05', 'ether');
  await instance.createStar('awesome star', starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  const balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1);
  await instance.buyStar(starId, { from: user2, value: balance });
  const balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1);
  const value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice);
  const value2 = Number(balanceOfUser1AfterTransaction);
  assert.equal(value1, value2);
});

it('lets user2 buy a star, if it is put up for sale', async () => {
  const instance = await StarNotary.deployed();
  const [user1, user2] = accounts;
  const starId = 4;
  const starPrice = web3.utils.toWei('.01', 'ether');
  const balance = web3.utils.toWei('.05', 'ether');
  await instance.createStar('awesome star', starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  await instance.buyStar(starId, { from: user2, value: balance });
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lets user2 buy a star and decreases its balance in ether', async () => {
  const instance = await StarNotary.deployed();
  const [user1, user2] = accounts;
  const starId = 5;
  const starPrice = web3.utils.toWei('.01', 'ether');
  const balance = web3.utils.toWei('.05', 'ether');
  await instance.createStar('awesome star', starId, { from: user1 });
  await instance.putStarUpForSale(starId, starPrice, { from: user1 });
  const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2);
  await instance.buyStar(starId, { from: user2, value: balance, gasPrice: 0 });
  const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2);
  const value =
    Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar);
  assert.equal(value, starPrice);
});

// Implement Task 2 Add supporting unit tests

it('can add the star name and star symbol properly', async () => {
  const instance = await StarNotary.deployed();

  assert.equal(await instance.name.call(), 'StarCoin');
  assert.equal(await instance.symbol.call(), 'SUN');
});

it('lets 2 users exchange stars', async () => {
  const instance = await StarNotary.deployed();
  const [user1, user2] = accounts;
  const starId1 = 6;
  const starId2 = 7;

  // Create the two stars
  await instance.createStar('Star 1', starId1, { from: user1 });
  await instance.createStar('Star 2', starId2, { from: user2 });

  // Make sure that the owners are correct
  assert.equal(await instance.ownerOf.call(starId1), user1);
  assert.equal(await instance.ownerOf.call(starId2), user2);

  // Exchange the stars
  await instance.exchangeStars(starId1, starId2, { from: user1 });

  // Make sure that the owners have been swapped
  assert.equal(await instance.ownerOf.call(starId1), user2);
  assert.equal(await instance.ownerOf.call(starId2), user1);
});

it('lets a user transfer a star', async () => {
  // 1. create a Star with different tokenId
  // 2. use the transferStar function implemented in the Smart Contract
  // 3. Verify the star owner changed.

  const instance = await StarNotary.deployed();
  const [user1, user2] = accounts;
  const starId = 8;

  // Create the star
  await instance.createStar('Star', starId, { from: user1 });

  // Make sure that the owner is correct
  assert.equal(await instance.ownerOf.call(starId), user1);

  // Transfer the star to user2
  await instance.transferStar(user2, starId, { from: user1 });

  // Make sure that the new owner is user2
  assert.equal(await instance.ownerOf.call(starId), user2);
});

it('lookUptokenIdToStarInfo test', async () => {
  const tokenId = 9;
  const instance = await StarNotary.deployed();
  await instance.createStar('Awesome Star!', tokenId, { from: accounts[0] });
  assert.equal(
    await instance.lookUptokenIdToStarInfo.call(tokenId),
    'Awesome Star!',
  );
});
