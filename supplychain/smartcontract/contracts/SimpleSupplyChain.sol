pragma solidity ^0.4.10;

contract SimpleSupplyChain {

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

  function SimpleSupplyChain(string data) {
    RawMaterialProvider = msg.sender;
    RawMaterialAddedTimeStamp = now;
    State = SupplyChainStates.RawMaterial;
    Data[0] = keccak256(data); 
    StateChanged("addedRawMaterial", msg.sender, data);
  }

  function receivedBySupplier(string data) {
    Supplier = msg.sender;
    State = SupplyChainStates.WithSupplier;
    Data[1] = keccak256(data); 
    StateChanged("receivedBySupplier", msg.sender, data);
  }

  function manufacturingComplete(string data) {
    Manufacturer = msg.sender;
    State = SupplyChainStates.Manufactured;
    Data[2] = keccak256(data); 
    StateChanged("manufacturingComplete", msg.sender, data);
  }

  function receivedByDistributor(string data) {
    Distributor = msg.sender;
    State = SupplyChainStates.WithDistributor;
    Data[3] = keccak256(data); 
    StateChanged("receivedByDistributor", msg.sender, data);
  }

  function receivedByRetailer(string data) { 
    Retailer = msg.sender; 
    State = SupplyChainStates.InDisplay;
    Data[4] = keccak256(data);
    StateChanged("receivedByRetailer", msg.sender, data);
  }

  function purchasedByCustomer(string customerId, string data) {
    if (msg.sender != Retailer) {
      revert();
    }
    CustomerIdentifier = customerId;
    CustomerPurchasedTimeStamp = now;
    State = SupplyChainStates.Purchased;
    Data[5] = keccak256(data);
    StateChanged("purchasedByCustomer", msg.sender, data);
  }

  function getAssetState() returns (uint8) {
    return uint8(State);
  }
}

