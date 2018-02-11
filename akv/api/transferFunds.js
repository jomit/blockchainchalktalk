function transferFunds(toAccount, ethValue) {
    var from = eth.accounts[0];
    var to = toAccount;
    var value = web3.toWei(ethValue, "ether");
    var txn = { from : from, to: to, value : value };
    personal.unlockAccount(eth.accounts[0],"password")
    eth.sendTransaction(txn);
    console.log( etherValue + " ether transfered to => " + toAccount);
};