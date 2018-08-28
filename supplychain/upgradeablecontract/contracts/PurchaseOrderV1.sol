// solium-disable linebreak-style
pragma solidity ^0.4.18;

import "./SafeMath.sol";
import "./StorageState.sol";

contract PurchaseOrderV1 is StorageState {
    using SafeMath for uint256;

    event StateChanged(string action, address who, bytes32 dataHash);
    
    function create(string data) public {
        bytes32 dataHash = keccak256(abi.encodePacked(data));
        _storage.setString("createdata", data);
        _storage.setString("state", "Received");
        //_storage.setAddress("owner", msg.sender);
        emit StateChanged("create", msg.sender, dataHash);
    }

    function getState() public view returns (string) {
        return _storage.getString("state");
    }
}

