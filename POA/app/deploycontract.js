require("dotenv").load();

const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const accountAddress = process.env.ACCCOUNTADDRESS;
const privateKey = new Buffer(process.env.PRIVATEKEY, 'hex');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPCENDPOINT));

// 1) COMPILE
const input = fs.readFileSync(process.env.CONTRACTNAME + '.sol');
const output = solc.compile(input.toString(), 1);
const bytecode = output.contracts[':' + process.env.CONTRACTNAME].bytecode;
const abi = JSON.parse(output.contracts[':' + process.env.CONTRACTNAME].interface);

const contract = web3.eth.contract(abi);

// 2) CREATE RAW TRANSACTION
const contractData = contract.new.getData({
    data: '0x' + bytecode
});

const gasPrice = web3.eth.gasPrice;
const gasPriceHex = web3.toHex(gasPrice);
const gasLimitHex = web3.toHex(300000);

const nonce = web3.eth.getTransactionCount(accountAddress);
const nonceHex = web3.toHex(nonce);

const rawTx = {
    nonce: nonceHex,
    gasPrice: gasPriceHex,
    gasLimit: gasLimitHex,
    data: contractData,
    from: accountAddress
};
console.log("RAW TX =>" + JSON.stringify(rawTx));


// 3) SIGN THE TRANSACTION
const tx = new Tx(rawTx);
tx.sign(privateKey);
const serializedRawTx = '0x' + tx.serialize().toString('hex');

// 4) SEND RAW TRANSACTION
web3.eth.sendRawTransaction(serializedRawTx, (err, hash) => {
    if (err) { console.log(err); return; }
    console.log('Contract Created => ' + hash);

    // 5) WAIT FOR MINING TO GET THE RECEIPT
    waitForTransactionReceipt(hash);
});

function waitForTransactionReceipt(hash) {
    console.log('Waiting for contract to be mined...');
    const receipt = web3.eth.getTransactionReceipt(hash);
    // Retry in 1 seconds
    if (receipt == null) {
        setTimeout(() => {
            waitForTransactionReceipt(hash);
        }, 1000);
    } else {
        console.log('Contract address => ' + receipt.contractAddress);
    }
}

