'use strict';

var currentAssetId = '';
var currentWorkflowMethod = '';

$(document).ready(function () {
    updateAccountList(currentNodeUrl);
    window.web3 = new Web3(new Web3.providers.HttpProvider(currentNodeUrl));

    currentAssetId = getParameterByName("id");
    $("#assetAddress").html(currentAssetId);
    updateStates();

    var assetDetails = getAssetFromDB(currentAssetId);
    if (assetDetails.transactions.length > 0) {
        updateAssetHistory(assetDetails.transactions);
    }
});

function updateAccountList(currentNodeUrl) {
    var accountFromDB = getFromDB("orgAccount"); //getParameterByName("account");
    $("#accountList").html("");
    getAllAccounts(currentNodeUrl).then(function (accountsList) {
        var htmlString;
        for (var i = 0; i < accountsList.length; i++) {
            htmlString += "<option value='" + accountsList[i] + "'";
            htmlString += (accountFromDB == accountsList[i]) ? "selected >" : ">";
            htmlString += accountsList[i] + "</option>";
        }
        $("#accountList").html(htmlString);
    });
}

function updateStates() {
    getAssetState().then(function (result) {
        var state = "";
        if (result == 0) {
            state = "RawMaterial";
        } else if (result == 1) {
            state = "WithSupplier";
        } else if (result == 2) {
            state = "Manufactured";
        } else if (result == 3) {
            state = "WithDistributor";
        } else if (result == 4) {
            state = "InDisplay";
        } else if (result == 5) {
            state = "Purchased";
        }
        var assetDetails = getAssetFromDB(currentAssetId);
        assetDetails.state = state;
        addAssetToDB(currentAssetId, assetDetails);
        $("#assetState").html(state);
        updateWorkflowState(state);
    });
}

function updateWorkflowState(currentState) {
    var label = "";
    var btnText = "";
    var data = "";
    if (currentState == "RawMaterial") {
        label = "Supplier Data :";
        btnText = "Received By Supplier";
        currentWorkflowMethod = "receivedBySupplier";
        data = '{ batchId : 101, location : "Earth", quality: "R-775" }';
    } else if (currentState == "WithSupplier") {
        label = "Manufacturer Data :";
        btnText = "Received By Manufacturer";
        currentWorkflowMethod = "manufacturingComplete";
        data = '{ lotcode : 7009, quantity : 100 , location: "Asia"}';
    } else if (currentState == "Manufactured") {
        label = "Distributor Data :";
        btnText = "Received By Distributor";
        currentWorkflowMethod = "receivedByDistributor";
        data = '{ shippingId : 2323, shippinglocation : "America"}';
    } else if (currentState == "WithDistributor") {
        label = "Retailer Data :";
        btnText = "Received By Retailer";
        currentWorkflowMethod = "receivedByRetailer";
        data = '{ productId : 64758089, lat : "47.641043", long: " -122.127912" }';
    } else if (currentState == "InDisplay") {
        label = "Customer Data :";
        btnText = "Purchased By Customer";
        currentWorkflowMethod = "purchasedByCustomer";
        data = '{ customerId : "CUST0018794", date : "12/12/2018" }';
    }

    $("#workflowLabel").text(label);
    $("#workflowBtn").text(btnText);
    $("#workflowData").val(data);
    $("#workflowSection").show();
}

function updateAssetHistory(assetTransactions) {
    var htmlString = "";
    for (var i = 0; i < assetTransactions.length; i++) {
        var currentTx = assetTransactions[i];
        //htmlString += '<p>Block # : <strong><span id=' + currentTx.hash + '>' + currentTx.blockNumber + '</span></strong>&nbsp;&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;&nbsp;';
        htmlString += '<p>Transaction Hash : <strong>' + currentTx.hash + '</strong></p>';
        htmlString += '<p>Event : ' + currentTx.event + '&nbsp;&nbsp;|&nbsp;&nbsp;';
        htmlString += 'By : ' + currentTx.from + '</p>';
        htmlString += '<p>Data : ' + currentTx.data + '</p>';
        htmlString += '<hr style="border-top: 1px solid #8c8b8b;"/>';
    }
    $("#assetHistoryList").html(htmlString);
}

function callContractMethod() {
    $("#workflowBtn").text("Submitting Transaction...");

    var data = $("#workflowData").val();
    var currentAccount = $("#accountList").val();
    console.log(currentWorkflowMethod + " | " + currentAssetId + " | " + data + " | " + currentAccount);

    var simpleSupplyChainContract = web3.eth.contract(JSON.parse(simpleSupplyChainAbiString));
    var simpleSupplyChainInstance = simpleSupplyChainContract.at(currentAssetId);
    var assetDetails = getAssetFromDB(currentAssetId);
    var privateFor = assetDetails.privateFor;

    var txnObject = {
        from: currentAccount,
        gas: 4700000,
        privateFor: [privateFor]
    }

    //web3.personal.unlockAccount(currentAccount, ethAccountPassword, function (error, result) {
       //if(error){ alert(error); return null;}

        if(currentWorkflowMethod == "receivedBySupplier") {
            receivedBySupplier(simpleSupplyChainInstance, data, txnObject);
        } else if(currentWorkflowMethod == "manufacturingComplete") {
            manufacturingComplete(simpleSupplyChainInstance, data, txnObject);
        } else if(currentWorkflowMethod == "receivedByDistributor") {
            receivedByDistributor(simpleSupplyChainInstance, data, txnObject);
        } else if(currentWorkflowMethod == "receivedByRetailer") {
            receivedByRetailer(simpleSupplyChainInstance, data, txnObject);
        } else if(currentWorkflowMethod == "purchasedByCustomer") {
            purchasedByCustomer(simpleSupplyChainInstance, data, txnObject);
        }
    //});
}

function receivedBySupplier(simpleSupplyChainInstance,data, txnObject) {
    simpleSupplyChainInstance.receivedBySupplier.sendTransaction(data, txnObject, function (error, result) {
        if (error) {
            alert(error);
        } else {
            console.log("receivedBySupplier => " + result);
            updateTransactions(result,data);
        }
    });
}

function manufacturingComplete(simpleSupplyChainInstance,data, txnObject) {
    simpleSupplyChainInstance.manufacturingComplete.sendTransaction(data, txnObject, function (error, result) {
        if (error) {
            alert(error);
        } else {
            console.log("manufacturingComplete => " + result);
            updateTransactions(result,data);
        }
    });
}

function receivedByDistributor(simpleSupplyChainInstance,data, txnObject) {
    simpleSupplyChainInstance.receivedByDistributor.sendTransaction(data, txnObject, function (error, result) {
        if (error) {
            alert(error);
        } else {
            console.log("receivedByDistributor => " + result);
            updateTransactions(result,data);
        }
    });
}

function receivedByRetailer(simpleSupplyChainInstance,data, txnObject) {
    simpleSupplyChainInstance.receivedByRetailer.sendTransaction(data, txnObject, function (error, result) {
        if (error) {
            alert(error);
        } else {
            console.log("receivedByRetailer => " + result);
            updateTransactions(result,data);
        }
    });
}

function purchasedByCustomer(simpleSupplyChainInstance,data, txnObject) {
    simpleSupplyChainInstance.purchasedByCustomer.sendTransaction(data, txnObject, function (error, result) {
        if (error) {
            alert(error);
        } else {
            console.log("purchasedByCustomer => " + result);
            updateTransactions(result,data);
        }
    });
}

function updateTransactions(txHash,data){
    var txReceipt = null;
    // Not a good way to wait for the receipt but its a Demo !!!
    while(!txReceipt) {
        txReceipt = web3.eth.getTransactionReceipt(txHash);
    }
    console.log(JSON.stringify(txReceipt));
    var assetDetails = getAssetFromDB(currentAssetId);
    assetDetails.transactions.push({
        event: currentWorkflowMethod,
        from: txReceipt.from,
        data: data,
        hash: txReceipt.transactionHash,
        blockNumber: txReceipt.blockNumber
    });
    addAssetToDB(currentAssetId, assetDetails);
    updateAssetHistory(assetDetails.transactions);
    updateStates();
}

function getAssetState() {
    return new Promise(function (resolve, reject) {
        var simpleSupplyChainContract = web3.eth.contract(JSON.parse(simpleSupplyChainAbiString));
        var simpleSupplyChainInstance = simpleSupplyChainContract.at(currentAssetId);
        simpleSupplyChainInstance.getAssetState.call({}, web3.eth.defaultBlock, function (error, result) 
        {
            resolve(result);
        });
    });
}
