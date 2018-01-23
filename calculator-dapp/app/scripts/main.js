
// 1) Get Contract ABI and ByteCode
var calculatorAbiString = '[{"constant":false,"inputs":[{"name":"num","type":"uint256"}],"name":"add","outputs":[],"payable":false,"type":"function"},{"constant":false,"inputs":[{"name":"num","type":"uint256"}],"name":"subtract","outputs":[],"payable":false,"type":"function"},{"constant":true,"inputs":[],"name":"getResult","outputs":[{"name":"","type":"uint256"}],"payable":false,"type":"function"},{"inputs":[{"name":"initial","type":"uint256"}],"payable":false,"type":"constructor"},{"anonymous":false,"inputs":[{"indexed":true,"name":"caller","type":"address"},{"indexed":true,"name":"newNumber","type":"uint256"},{"indexed":true,"name":"newResult","type":"uint256"}],"name":"ResultUpdated","type":"event"}]';
var calculatorByteCode = '0x' + '6060604052341561000f57600080fd5b6040516020806101f2833981016040528080519060200190919050505b806000819055505b505b6101ad806100456000396000f30060606040526000357c0100000000000000000000000000000000000000000000000000000000900463ffffffff1680631003e2d2146100545780631dc05f1714610077578063de2927891461009a575b600080fd5b341561005f57600080fd5b61007560048080359060200190919050506100c3565b005b341561008257600080fd5b610098600480803590602001909190505061011d565b005b34156100a557600080fd5b6100ad610177565b6040518082815260200191505060405180910390f35b806000808282540192505081905550600054813373ffffffffffffffffffffffffffffffffffffffff167f705370d77d36f84d91e5538a9be9db379b7f08de4c788e8f02f2cfe77a7b1a0760405160405180910390a45b50565b806000808282540392505081905550600054813373ffffffffffffffffffffffffffffffffffffffff167f705370d77d36f84d91e5538a9be9db379b7f08de4c788e8f02f2cfe77a7b1a0760405160405180910390a45b50565b6000805490505b905600a165627a7a723058208923c7757e951948f314e8b56568ed4b946d9b2d24bbc67c2c35ce6e6ed04e820029';
var accounts;
var filterWatch;

// 2) Connect and instantiate web3 object
function connect() {
    var provider = document.getElementById('providerUrl').value;
    window.web3 = new Web3(new Web3.providers.HttpProvider(provider));
    getAllAccounts();
}

function getAllAccounts() {
    web3.eth.getAccounts(function (error, result) {
        if (error) {
            setData('accountCount', error);
        } else {
            accounts = result;
            setData('accountCount', "(" + result.length + " accounts found)", false);
            var accountList = document.getElementById("accountList");
            for (var i = 0; i < result.length; i++) {
                var li = document.createElement('li');
                li.innerHTML = result[i];
                accountList.appendChild(li)
            }
            populateDefaults();
        }
    });
}

function populateDefaults() {
    document.getElementById('accountToUnlock').value = accounts[0];
    document.getElementById('contractInterface').value = calculatorAbiString;
    document.getElementById('contractByteCode').value = calculatorByteCode;
}

// 2) Unlock Account to deploy contract

function unlockAccount() {
    var baseAccount = document.getElementById('accountToUnlock').value;
    var password = document.getElementById('accountPassword').value;
    web3.personal.unlockAccount(baseAccount, password, function (error, result) {
        if (error) {
            setData('lock_unlock_result', error, true);
        } else {
            var statusText = '..Unlocked !!';
            if (result) {
                setData('unlockStatus', statusText, false);
            } else {
                // This does not get called - since and error is returned for incorrect password :-)
                statusText = 'Incorrect Password???';
                setData('unlockStatus', statusText, true);
            }
        }
    });
}

// 3) Deploy Contract

function deployContract() {
    var gas = 4700000;
    var initialValue = document.getElementById('initialNumber').value;
    var params = {
        from: web3.eth.coinbase,
        data: calculatorByteCode,
        gas: gas
    }
    var contract = web3.eth.contract(JSON.parse(calculatorAbiString));
    contract.new(initialValue, params, function (error, result) {
        if (error) {
            setData('contractAddress', 'Deployment Failed: ' + error, true);
        } else {
            if (result.address) {
                document.getElementById('contractAddress').value = result.address;
            } else {
                setData('contractDeployResult', result.transactionHash);
            }
        }
    });
}

// 4) Invoke Contract Methods

function add() {
    var contractAddress = document.getElementById('contractAddress').value;
    var numberToAdd = document.getElementById('numberToAdd').value;
    var calculatorContract = web3.eth.contract(JSON.parse(calculatorAbiString));
    var calculatorInstance = calculatorContract.at(contractAddress);

    var txnObject = {
        from: accounts[0],
        gas: 4700000
    }

    calculatorInstance.add.sendTransaction(numberToAdd, txnObject, function (error, result) {
        if (error) {
            setData('functionCallResult', error);
        } else {
            setData('functionCallResult', result);
        }
    });
    watchEvents();
}

function subtract() {
    var contractAddress = document.getElementById('contractAddress').value;
    var numberToSubtract = document.getElementById('numberToSubtract').value;
    var calculatorContract = web3.eth.contract(JSON.parse(calculatorAbiString));
    var calculatorInstance = calculatorContract.at(contractAddress);

    var txnObject = {
        from: accounts[0],
        gas: 4700000
    }

    calculatorInstance.subtract.sendTransaction(numberToSubtract, txnObject, function (error, result) {
        if (error) {
            setData('functionCallResult', error);
        } else {
            setData('functionCallResult', result);
        }
    });
    watchEvents();
}

function showResultValue() {
    var contractAddress = document.getElementById('contractAddress').value;
    var calculatorContract = web3.eth.contract(JSON.parse(calculatorAbiString));
    var calculatorInstance = calculatorContract.at(contractAddress);
    calculatorInstance.getResult.call({}, web3.eth.defaultBlock, function (error, result) {
        setData('contractResultValue', result);
    });
}

// 5) Watch Contract Events
function watchEvents() {
    // http://solidity.readthedocs.io/en/develop/contracts.html#events
    var contractAddress = document.getElementById('contractAddress').value;
    var calculatorContract = web3.eth.contract(JSON.parse(calculatorAbiString));
    var calculatorInstance = calculatorContract.at(contractAddress);

    var resultUpdatedEvent = calculatorInstance.ResultUpdated({});
    resultUpdatedEvent.watch(function (error, result) {
        if (error) {
            setData('resultUpdatedEvent', 'Filter Watch Error: ' + error);
        } else {
            setData('resultUpdatedEvent', 'Event: ' + JSON.stringify(result));
        }
        resultUpdatedEvent.stopWatching();
    });

    // if (filterWatch) {
    //     filterWatch.stopWatching();
    //     filterWatch = undefined;
    //     setData('resultUpdatedEvent', '--');
    // }
    // var options = {};
    // options['address'] = document.getElementById('contractAddress').value;
    // options["fromBlock"] = "latest";
    // options["topics"] = [getEventSignatureHash("ResultUpdated(address,bytes32,bytes32)")];

    // filterWatch = web3.eth.filter(options);
    // filterWatch.watch(function(error,result){
    //     if(error){
    //         setData('resultUpdatedEvent','Filter Watch Error: ' + error);
    //     } else {
    //         setData('resultUpdatedEvent','Event: ' + JSON.stringify(result));
    //     }
    // });

    // filterWatch.get(function(error,logs){
    //     if(error){
    //         setData('resultUpdatedEvent','Filter Watch Error: ' + error);
    //     } else {
    //         setData('resultUpdatedEvent','Logs : ' + JSON.stringify(logs));
    //     }
    // });
}


// Helper Functions
function setData(elementId, html) {
    document.getElementById(elementId).innerHTML = html;
}

function getEventSignatureHash(eventSignature) {
    return web3.sha3(eventSignature)
}


