pragma solidity ^0.4.10;

contract PostBox {

    string message;

    function postMsg(string text) public {
        message = text; 
    }
    function getMsg() public view returns (string) {
        return message;
    }
}