var SimpleSupplyChain = artifacts.require("SimpleSupplyChain");
var PurchaseOrder = artifacts.require("PurchaseOrder");

module.exports = function(deployer) {
  //deployer.deploy(SimpleSupplyChain, "{ location: 'Mars', materialType : 'alien' }", { privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]});
  deployer.deploy(PurchaseOrder, "{ itemId : 10, quantity: 100, price : 5 }");
};