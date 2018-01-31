'use strict';

var currentAssetId;

$(document).ready(function () {
    var currentNodeUrl = getFromDB("org");
    window.web3 = new Web3(new Web3.providers.HttpProvider(currentNodeUrl));

    currentAssetId = getParameterByName("id");
    $("#assetAddress").html(currentAssetId);
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
        $("#assetState").html(state);
    });
    //watchContractEvents();

    watchEvents();  // temporary due to the private contract log issue with Quorum  
});

function getAssetState() {
    return new Promise(function (resolve, reject) {
        var simpleSupplyChainContract = web3.eth.contract(JSON.parse(simpleSupplyChainAbiString));
        var simpleSupplyChainInstance = simpleSupplyChainContract.at(currentAssetId);
        simpleSupplyChainInstance.getAssetState.call({}, web3.eth.defaultBlock, function (error, result) {
            resolve(result);
        });
    });
}

function watchContractEvents(){
    var contract = web3.eth.contract(JSON.parse(simpleSupplyChainAbiString));
    var contractInstance = contract.at(currentAssetId);

    var stateChangedEvent = contractInstance.StateChanged({});
    stateChangedEvent.watch(function (error, result) {
        if (error) {
            alert(error);
        } else {
            console.log('stateChangedEvent =>' + JSON.stringify(result));
            var htmlString = '<p>Transaction Hash : <strong>' + result.transactionHash + '</strong></p>';
            htmlString += 'By : ' + result.args.who + '</p>';
            htmlString += '<p>Data : ' + result.args.data + '</p>';
            htmlString += '<hr style="border-top: 1px solid #8c8b8b;"/>';
            var existingHtml = $("#assetHistoryList").html();
            $("#assetHistoryList").html(existingHtml + htmlString);
        }
        //stateChangedEvent.stopWatching();
    });
}


function watchEvents() {
    var stateChangedEvent = web3.eth.filter({fromBlock: 1, toBlock: 'latest'}); //web3.eth.filter(null);
    stateChangedEvent.watch(function (error, result) {
        if (error) {
            alert(error);
        } else {
            var txReceipt = web3.eth.getTransactionReceipt(result.transactionHash);
            if (txReceipt.contractAddress ==  currentAssetId || txReceipt.to ==  currentAssetId) {
                console.log("Event | Contract  => " + JSON.stringify(txReceipt));
                var htmlString = '<p>Transaction Hash : <strong>' + txReceipt.transactionHash + '</strong></p>';
                //htmlString += 'By : ' + txReceipt.from + '</p>';
                htmlString += '<p>Data : ' + '' + '</p>';
                htmlString += '<hr style="border-top: 1px solid #8c8b8b;"/>';
                var existingHtml = $("#assetHistoryList").html();
                $("#assetHistoryList").html(existingHtml + htmlString);
            }
        }
        //stateChangedEvent.stopWatching();
    });
}
