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

const gasPrice = web3.eth.gasPrice;
const gasPriceHex = web3.toHex(gasPrice);
const gasLimitHex = web3.toHex(300000);

const nonce = web3.eth.getTransactionCount(accountAddress);
const nonceHex = web3.toHex(nonce);

web3.eth.getTransactionCount(accountAddress, function (err, nonce) {
    var data = web3.eth.contract(abi).at(contractAddress).postMsg.getData("Welcome to Mars !!!");
    var rawTx = {
        nonce: nonce,
        gasPrice: gasPriceHex,
        gasLimit: gasLimitHex,
        to: contractAddress,
        //value: '0x00',
        data: data
    }
    const tx = new Tx(rawTx);

    tx.sign(privateKey);

    var rawTx = '0x' + tx.serialize().toString('hex');
    web3.eth.sendRawTransaction(rawTx, function (txErr, transactionHash) {
        console.log("Transaction Hash => " + transactionHash);
        console.log("Error => " + txErr);
    });
});
