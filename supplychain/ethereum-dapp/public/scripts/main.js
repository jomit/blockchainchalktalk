"use strict";

$(document).ready(function () {
    $("#accountList").html("");
    $("#assetList").html("");
    getAllAccounts(currentNodeUrl).then(function (accountsList) {
        var htmlString;
        for (var i = 0; i < accountsList.length; i++) {
            htmlString += "<option value='" + accountsList[i] + "'>";
            htmlString += accountsList[i] + "</option>";
        }
        $("#accountList").html(htmlString);
    });
    window.web3 = new Web3(new Web3.providers.HttpProvider(currentNodeUrl));
    watchEvents();
});

function addRawMaterial() {
    var currentAccount = $("#accountList").val();
    web3.personal.unlockAccount(currentAccount, ethAccountPassword, function (error, result) {
        if(error){ alert(error); return null;}
        $("#addRawMaterialBtn").text("Creating asset...");

        var currentAccount = $("#accountList").val();
        var materialData = $("#rawMaterialsData").val();

        var gas = 4700000;
        var params = {
            from: currentAccount,
            data: simpleSupplyChainByteCode,
            gas: gas
        };
        console.log(params);
        var contract = web3.eth.contract(JSON.parse(simpleSupplyChainAbiString));
        contract.new(materialData, params, function (error, result) {
            if (error) {
                alert(error);
            } else {
                if (result.address) {
                    console.log("RESULT =>" + JSON.stringify(result));
                    addAssetToDB(result.address, {
                        id: result.address, state: "RawMaterial",
                        transactions: [
                            {
                                event: "addRawMaterial",
                                from: currentAccount,
                                data: materialData,
                                hash: result.transactionHash
                                //blockNumber: result.blockNumber
                            }
                        ]
                    });
                    $("#addRawMaterialBtn").text("Add Raw Material");
                } else {
                    console.log("Transaction Hash => " + result.transactionHash);
                }
            }
        });
    });
}

function updateAssetList(assetContractAddress, state) {
    var htmlString = '<p>Asset Id : <a href="assetdetails.html?id=' + assetContractAddress + '">' + assetContractAddress + '</a>&nbsp;&nbsp;&nbsp;</p>';
    htmlString += '<hr style="border-top: 1px solid #8c8b8b;" />';

    var existingHtml = $("#assetList").html();
    $("#assetList").html(existingHtml + htmlString);
}

function watchEvents() {
    var stateChangedEvent = web3.eth.filter({fromBlock: 1, toBlock: 'latest'}); //web3.eth.filter(null);
    stateChangedEvent.watch(function (error, result) {
        if (error) {
            alert(error);
        } else {
            var txReceipt = web3.eth.getTransactionReceipt(result.transactionHash);
            if (txReceipt.contractAddress) {
                updateAssetList(txReceipt.contractAddress, "")
                console.log("Event | Contract  => " + JSON.stringify(txReceipt));
            }else{
                console.log("Event | Receipt => " + JSON.stringify(txReceipt));
            }
        }
        //stateChangedEvent.stopWatching();
    });
}
