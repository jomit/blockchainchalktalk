// solium-disable linebreak-style
pragma solidity ^0.4.18;

contract Ownable {
    address owner;

    event OwnershipTransferred(address indexed previousOwner, address indexed newOwner);

    constructor() public {
        owner = msg.sender;
    }

    modifier onlyOwner() {
        require(msg.sender == owner,"Only owner is allowed to perform this action");
        _;
    }
    
    function transferOwnership(address newOwner) public onlyOwner {
        require(newOwner != address(0),"Newowner is not initialized");
        emit OwnershipTransferred(owner, newOwner); 
        owner = newOwner;
    }

}