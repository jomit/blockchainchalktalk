## Prereq

- Download [Geth](https://geth.ethereum.org/downloads/)

## Create a genesis account

    md node1
    cd node1
    
    geth --datadir "./data" account new

## Initialize the network with a genesis block

    copy ..\genesis.json genesis.json

    (update account address, give it 10 trillion ethers)

    geth --datadir "./data" init genesis.json

## Start the network

    geth --networkid 112233 --datadir "./data" --rpc --rpccorsdomain "*" --verbosity 3 console

    (connect Metamask to private network)

    admin.nodeInfo.enode

## Transfer some ethers to a new account

    personal.newAccount("password")
    web3.fromWei(eth.getBalance(eth.accounts[0]),"ether")

    from = eth.accounts[0]
    to = eth.accounts[1]
    value = web3.toWei(1, "ether")
    txn = { from : from, to: to, value : value }
    eth.sendTransaction(txn)
    personal.unlockAccount(eth.accounts[0])

    eth.pendingTransactions
    (copy the transaction hash)

    geth attach
    miner.start()
    
## See permanent record

    eth.getTransactionReceipt("")

## Load Custom Script

    loadScript("balances.js")
    balances()


