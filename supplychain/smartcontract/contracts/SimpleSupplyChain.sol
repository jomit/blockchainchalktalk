// solium-disable linebreak-style
pragma solidity ^0.4.10;

contract SimpleSupplyChain{

    enum SupplyChainStates {RawMaterial, WithSupplier, Manufactured, WithDistributor, InDisplay, Purchased }

    address RawMaterialProvider;
    uint RawMaterialAddedTimeStamp;
    address Supplier; 

    address Manufacturer;
    address Distributor;
    address Retailer; 
  
    string CustomerIdentifier;
    uint CustomerPurchasedTimeStamp;
  
    SupplyChainStates State;
    bytes32[6] Data;   // 1 data state variable for simplicity.
  
    event StateChanged(string action, address who, string data); 

    constructor(string data) public {
        RawMaterialProvider = msg.sender;
        RawMaterialAddedTimeStamp = now;
        State = SupplyChainStates.RawMaterial;
        Data[0] = keccak256(abi.encodePacked(data)); 
        emit StateChanged("addedRawMaterial", msg.sender, data);
    }

    function receivedBySupplier(string data) public {
        Supplier = msg.sender;
        State = SupplyChainStates.WithSupplier;
        Data[1] = keccak256(abi.encodePacked(data));
        emit StateChanged("receivedBySupplier", msg.sender, data);
    }

    function manufacturingComplete(string data) public {
        Manufacturer = msg.sender;
        State = SupplyChainStates.Manufactured;
        Data[2] = keccak256(abi.encodePacked(data));
        emit StateChanged("manufacturingComplete", msg.sender, data);
    }

    function receivedByDistributor(string data) public {
        Distributor = msg.sender;
        State = SupplyChainStates.WithDistributor;
        Data[3] = keccak256(abi.encodePacked(data));
        emit StateChanged("receivedByDistributor", msg.sender, data);
    }

    function receivedByRetailer(string data) public { 
        Retailer = msg.sender; 
        State = SupplyChainStates.InDisplay;
        Data[4] = keccak256(abi.encodePacked(data));
        emit StateChanged("receivedByRetailer", msg.sender, data);
    }

    function purchasedByCustomer(string customerId, string data) public {
        if (msg.sender != Retailer) {
            revert("Sender should Retainler");
        }
        CustomerIdentifier = customerId;
        CustomerPurchasedTimeStamp = now;
        State = SupplyChainStates.Purchased;
        Data[5] = keccak256(abi.encodePacked(data));
        emit StateChanged("purchasedByCustomer", msg.sender, data);
    }

    function getAssetState() public view returns (uint8)  {
        return uint8(State);
    }
}