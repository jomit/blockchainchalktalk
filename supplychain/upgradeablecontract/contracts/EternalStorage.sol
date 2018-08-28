// solium-disable linebreak-style
pragma solidity ^0.4.18;

contract EternalStorage {

    //mapping(address => mapping(bytes32 => uint256)) uintStorage;
    mapping(address => mapping(bytes32 => string)) stringStorage;
    mapping(address => mapping(bytes32 => address)) addressStorage;
    //mapping(address => mapping(bytes32 => bytes)) bytesStorage;
    //mapping(address => mapping(bytes32 => bool)) boolStorage;
    //mapping(address => mapping(bytes32 => int256)) intStorage;

    // msg.sender = proxy contract address
    function getString(bytes32 key) public view returns (string) {
        return stringStorage[msg.sender][key];
    }

    function getAddress(bytes32 key) public view returns (address) {
        return addressStorage[msg.sender][key];
    }

    function setString(bytes32 key, string value) public {
        stringStorage[msg.sender][key] = value;
    }

    function setAddress(bytes32 key, address value) public {
        addressStorage[msg.sender][key] = value;
    }
}