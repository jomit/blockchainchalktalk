require("dotenv").load();

const fs = require('fs');
const solc = require('solc');
const Web3 = require('web3');
const Tx = require('ethereumjs-tx');

const accountAddress = process.env.ACCCOUNTADDRESS;
const privateKey = new Buffer(process.env.PRIVATEKEY, 'hex');
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.RPCENDPOINT));
const contractAddress = process.argv[2]

const input = fs.readFileSync(process.env.CONTRACTNAME + '.sol');
const output = solc.compile(input.toString(), 1);
const abi = JSON.parse(output.contracts[':' + process.env.CONTRACTNAME].interface);

const nonce = web3.eth.getTransactionCount(accountAddress);
const gasPrice = web3.eth.gasPrice;
const gasPriceHex = web3.toHex(gasPrice);
const gasLimitHex = web3.toHex(300000);

postMessage("Hey");

function postMessage(msg) {
    var data = web3.eth.contract(abi).at(contractAddress).postMsg.getData(msg);
    var rawTx = {
        nonce: nonce,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        to: contractAddress,
        //value: '0x00',
        data: data
        //privateFor: ["pwiUUN2N8gjc/6uKcrgGrECarfv5jZaoPKXXoMWtMCI="]
    }
    const tx = new Tx(rawTx);

    tx.sign(privateKey);

    var rawTx = '0x' + tx.serialize().toString('hex');
    web3.eth.sendRawTransaction(rawTx, function (txErr, transactionHash) {
        console.log("Transaction Hash => " + transactionHash);
        if (txErr) console.log("Error => " + txErr);
        getMessage();
    });
}

function getMessage() {
    var contract = web3.eth.contract(abi).at(contractAddress);
    var result = contract.getMsg.call();
    console.log("Message => " + result);
}