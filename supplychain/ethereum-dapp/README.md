## Setup Ethereum

- Create [Ethereum Blockchain on Azure](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/microsoft-azure-blockchain.azure-blockchain-service?tab=Overview)

- Enable `personal` api to unlock accounts remotely (Note: This should only be done for demo environments)

    SSH into the Transaction Nodes (port 3000 for first node, 3001 for second...)

    cd /home/[user]

    edit `start-private-blockchain.sh` add `--rpcapi "eth,web3,personal,net,miner,admin,debug"` on line 54 starting with "nohup geth --datadir..." 

    e.g. : nohup geth --datadir $GETH_HOME -verbosity $VERBOSITY --bootnodes $BOOTNODE_URLS --maxpeers $MAX_PEERS --nat none --networkid $NETWORK_ID --identity $IDENTITY $MINE_OPTIONS $FAST_SYNC --rpc --rpcaddr "$IPADDR" --rpccorsdomain "*" --rpcapi "eth,web3,personal,net,miner,admin,debug" >> $GETH_LOG_FILE_PATH 2>&1 & 

- Restart Transaction Node VM's

## Demo

    update `currentNodeUrl` in `ethereum-dapp\public\scripts\helper.js`

    update `ethAccountPassword` in `ethereum-dapp\public\scripts\helper.js`

    cd ethereum-dapp

    npm install

    node app.js

## Reset the Demo

- Clear Browser cache by clicking on the <Blank> space after the word "DApp" in the header


