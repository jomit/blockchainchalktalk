"use strict";

$(document).ready(function () {
    var allOrgs = getAllOrganizations();
    allOrgs.forEach(element => {
        var currentString = $("#orgList").html();
        $("#orgList").html(currentString + "<option value='" + element.nodeUrl + "'>" + element.name + "</option>");
    });

    allOrgs.forEach(element => {
        var currentString = $("#privateForOrgList").html();
        $("#privateForOrgList").html(currentString + "<option value='" + element.publicKey + "'>" + element.name + "</option>");
    });

    var nodeUrl = getFromDB("org");
    if (nodeUrl) {
        document.getElementById("orgList").value = nodeUrl;
        updateAccountList();
    }
});

function updateAccountList() {
    var currentNodeUrl = document.getElementById("orgList").value;
    addToDB("org",currentNodeUrl);
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
}

function unlockAccount() {
    return new Promise(function (resolve, reject) {
        var baseAccount = $("#accountList").val();
        var password = "";
        web3.personal.unlockAccount(baseAccount, password, function (error, result) {
            if (error) {
                reject(error);
            } else {
                resolve(result);
            }
        });
    });
}

function addRawMaterial() {
    unlockAccount().then(function (result) {
        $("#addRawMaterialBtn").text("Creating asset...");

        var currentAccount = $("#accountList").val();
        var materialData = $("#rawMaterialsData").val();
        var privateFor = document.getElementById("privateForOrgList").value;

        var gas = 4700000;
        var params = {
            from: currentAccount,
            data: simpleSupplyChainByteCode,
            gas: gas,
            privateFor: [privateFor]  //only allowing 1 public key for now
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
                        id: result.address, state: "RawMaterial", privateFor : privateFor,
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
    var htmlString = '<p>Asset Id : ' + assetContractAddress + '&nbsp;&nbsp;&nbsp;';
    htmlString += '<a href="assetdetails.html?id=' + assetContractAddress + '">Asset History</a>&nbsp;&nbsp;&nbsp;|&nbsp;&nbsp;&nbsp;';
    htmlString += '<a href="audit.html?id=' + assetContractAddress + '">Audit</a></p>';
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
