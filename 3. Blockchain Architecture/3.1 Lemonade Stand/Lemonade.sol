pragma solidity ^0.4.24;

// Define a contract 'Lemonade Stand'
contract LemonadeStand {

    // Variable: Owner
    address owner;

    // Variable: SKU count
    uint skuCount;

    // Event: 'State' with value 'ForSale'
    enum State { ForSale, Sold }

    // Struct: Item. name, sku, price, state, seller, buyer
    struct Item {
        string  name;
        uint  sku;
        uint  price;
        State  state;
        address  seller;
        address  buyer;
    }

    // Define a public mapping 'items' that maps the SKU (a number) to an Item.
    mapping (uint => Item) items;

    // Events
    event ForSale(uint skuCount);
    event Sold(uint sku);

    // Modifier: Only Owner see if msg.sender == owner of the contract
    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    // Define a modifier that verifies the Caller
    modifier verifyCaller (address _address) {
        require(msg.sender == _address);
        _;
    }

    // Define a modifier that checks if the paid amount is sufficient to cover the price
    modifier paidEnough(uint _price) {
        require(msg.value >= _price);
        _;
    }

    // Define a modifier that checks if an item.state of a sku is ForSale
    modifier forSale(uint _sku) {
        require(items[_sku].state == State.ForSale);
        _;
    }

    // Define a modifier that checks if an item.state of a sku is Sold
    modifier sold(uint _sku) {
        require(items[_sku].state == State.Sold);
        _;
    }

    constructor() public payable {
        owner = msg.sender;
        skuCount = 0;
    }

    function addItem(string _name, uint _price) onlyOwner public {
        // Increment sku
        skuCount = skuCount + 1;

        // Emit the appropriate event
        emit ForSale(skuCount);

        // Add the new item into inventory and mark it for sale
        items[skuCount] = Item({name: _name, sku: skuCount, price: _price, state: State.ForSale, seller: msg.sender, buyer: 0});
    }

    function buyItem(uint sku) forSale(sku) paidEnough(items[sku].price) public payable{
        address buyer = msg.sender;
        uint price = items[sku].price;

        // Update Buyer
        items[sku].buyer = buyer;

        // Update State
        items[sku].state = State.Sold;

        // Transfer money to seller
        items[sku].seller.transfer(price);

        // Emit the appropriate event
        emit Sold(sku);
    }

    function fetchItem(uint _sku) public view returns (string name, uint sku, uint price, string stateIs, address seller, address buyer) {
        uint state;
        name = items[_sku].name;
        sku = items[_sku].sku;
        price = items[_sku].price;
        state = uint(items[_sku].state);

        if( state == 0) {
            stateIs = "For Sale";
        }

        if( state == 1) {
            stateIs = "Sold";
        }

        seller = items[_sku].seller;
        buyer = items[_sku].buyer;
    }

// Define a modifier that checks the price and refunds the remaining balance
modifier checkValue(uint _sku) {
    _;
    uint _price = items[_sku].price;
    uint amountToRefund = msg.value - _price;
    items[_sku].buyer.transfer(amountToRefund);
}

// Define a function 'buyItem' that allows one to purchase an item from the inventory
function buyItem(uint sku) public payable
    // Call modifier to check if sku is for sale
    forSale(sku)
    // Call modifer to check if buyer has paid enough
    paidEnough(items[sku].price)
    // Call modifer to send any excess ether back to buyer
    checkValue(sku) {
    address buyer = msg.sender;
    uint  price = items[sku].price;
    // Update buyer
    items[sku].buyer = buyer;
    // Update state
    items[sku].state = State.Sold;
    // Transfer money to seller
    items[sku].seller.transfer(price);
    // emit the appropriate event
    emit Sold(sku);
    }

}