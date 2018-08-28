const EternalStorage = artifacts.require('EternalStorage');
const PurchaseOrderV1 = artifacts.require('PurchaseOrderV1');
const PurchaseOrderV2 = artifacts.require('PurchaseOrderV2');
const Proxy = artifacts.require('Proxy');

contract('PurchaseOrder', async (accounts) => {
    it('should upgrade purchase order', async () => {
        var proxyOwner = accounts[0];
        var manufacturer = accounts[1];
        var buyer = accounts[2];
        console.log("Proxy Owner => " + proxyOwner);
        console.log("Manufacturer => " + manufacturer);
        console.log("Buyer => " + buyer);

        // Deploy EternalStorage and Proxy contracts
        const eternalStorage = await EternalStorage.new();
        let proxy = await Proxy.new(eternalStorage.address, proxyOwner);

        // Deploy PurchaseOrder V1
        const purchaseOrderV1 = await PurchaseOrderV1.new();
        var result = await proxy.upgradeTo(purchaseOrderV1.address);
        logEvents(result);
        proxy = _.extend(proxy, PurchaseOrderV1.at(proxy.address));

        result = await proxy.create("{ itemId : 10, quantity: 100, price : 5 }", { from: manufacturer });
        logEvents(result);
        let currentStateV1 = await proxy.getState();
        console.log(currentStateV1);

        // Upgrade to PurchaseOrder V2
        const purchaseOrderV2 = await PurchaseOrderV2.new();
        result = await proxy.upgradeTo(purchaseOrderV2.address);
        logEvents(result);

        proxy = PurchaseOrderV2.at(proxy.address);
        let previousState = await proxy.getState();
        console.log(previousState);
        result = await proxy.sendack("{ accepted: true }", { from: buyer });
        logEvents(result);

        let currentStateV2 = await proxy.getState();
        console.log(currentStateV2);

    });
});

function logEvents(result) {
    for (var i = 0; i < result.logs.length; i++) {
        if(result.logs[i].event == "Upgraded"){
            console.log(result.logs[i].event, '>>', result.logs[i].args.implementation)
        } else {
            console.log(result.logs[i].event, '>>', result.logs[i].args.action, ' | ', result.logs[i].args.who, ' | ', result.logs[i].args.dataHash)
        }
    }
  }