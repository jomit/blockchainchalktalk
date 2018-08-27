var SimpleSupplyChain = artifacts.require("./SimpleSupplyChain.sol");

contract('SimpleSupplyChain', function (accounts) {
  it("happy path", function () {
    var supplychain;
    var supplier = accounts[0];
    var manufacturer = accounts[0];
    var distributor = accounts[0];
    var retailer = accounts[0];

    return SimpleSupplyChain.deployed().then(function (instance) {
      supplychain = instance;
      return supplychain.getAssetState.call();
    }).then(function (result) {
      console.log("Asset State =>",result);
      return supplychain.receivedBySupplier("{ containerId : 'CTL911'}", { from: supplier });
    }).then(function (result) {
      logEvents(result);
      return supplychain.getAssetState.call();
    }).then(function (result) {
      console.log("Asset State =>",result);
      return supplychain.manufacturingComplete("{ assetId : 'AP2001', assetName : 'AssetName', lot : 'Lot-9', factoryLocation : 'Asia' }", { from: manufacturer });
    }).then(function (result) {
      logEvents(result);
      return supplychain.getAssetState.call();
    }).then(function (result) {
      console.log("Asset State =>",result);
    }).then(function (result) {
      console.log("Asset State =>",result);
      return supplychain.receivedByDistributor("{ warehouseLocation : 'America' }", { from: distributor });
    }).then(function (result) {
      logEvents(result);
      return supplychain.getAssetState.call();
    }).then(function (result) {
      console.log("Asset State =>",result);
    }).then(function (result) {
      console.log("Asset State =>",result);
      return supplychain.receivedByRetailer("{ shopLocation : 'Seattle' }", { from: retailer });
    }).then(function (result) {
      logEvents(result);
      return supplychain.getAssetState.call();
    }).then(function (result) {
      console.log("Asset State =>",result);
    }).then(function (result) {
      console.log("Asset State =>",result);
      return supplychain.purchasedByCustomer("Customer-999", "{ purchaseDate : '12/25/2020' }", { from: retailer });
    }).then(function (result) {
      logEvents(result);
      return supplychain.getAssetState.call();
    }).then(function (result) {
      console.log("Asset State =>",result);
    });
  });
});

function logEvents(result) {
  for (var i = 0; i < result.logs.length; i++) {
    console.log(result.logs[i].event, '>>', result.logs[i].args.action, ' | ', result.logs[i].args.who, ' | ', result.logs[i].args.data)
  }
}