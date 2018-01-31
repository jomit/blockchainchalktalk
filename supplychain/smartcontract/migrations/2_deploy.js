//var Calculator = artifacts.require("Calculator");
var SimpleSupplyChain = artifacts.require("SimpleSupplyChain");

module.exports = function(deployer) {
  //deployer.deploy(Calculator, 15, { privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]});
  deployer.deploy(SimpleSupplyChain, "{ location: 'Mars', materialType : 'alien' }", { privateFor: ["ROAZBWtSacxXQrOe3FGAqJDyJjFePR5ce4TSIzmJ0Bc="]});
};