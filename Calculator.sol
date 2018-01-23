pragma solidity ^0.4.10;

contract Calculator {
  uint result;

  function Calculator(uint initial) public {
    result = initial;
  }

  event ResultUpdated(address indexed caller, uint indexed newNumber, uint indexed newResult);

  function add(uint num) public {
    result += num;
    ResultUpdated(msg.sender, num, result);
  }

  function subtract(uint num) public {
    result -= num;
    ResultUpdated(msg.sender, num, result);
  }

  function getResult() public constant returns (uint) {
    return result;
  }
}