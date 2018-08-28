var PurchaseOrder = artifacts.require("./PurchaseOrder.sol");

contract('PurchaseOrder', function (accounts) {
  it("happy path", function () {
    var po;

    return PurchaseOrder.deployed().then(function (instance) {
      po = instance;
      return po.getState.call();
    }).then(function (result) {
      console.log("PO State =>", result);
      return po.sendPOAck("{ accepted: true }");
    }).then(function (result) {
      logEvents(result);
      return po.getState.call();
    }).then(function (result) {
      console.log("PO State =>", result);
    });

  });
});

function logEvents(result) {
  for (var i = 0; i < result.logs.length; i++) {
    console.log(result.logs[i].event, '>>', result.logs[i].args.action, ' | ', result.logs[i].args.who, ' | ', result.logs[i].args.dataHash)
  }
}