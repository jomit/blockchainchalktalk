## Setup Quorum

- Create the [Quorum Demo VM on Azure](https://azuremarketplace.microsoft.com/en-us/marketplace/apps/enterprise-ethereum-alliance.quorum-demo)

- SSH into the VM

    git clone https://github.com/jpmorganchase/quorum-examples.git

    cd quorum-examples/examples/7nodes

    sudo ./raft-init.sh

    sudo ./raft-start.sh

- Test

    geth attach ipc:qdata/dd1/geth.ipc

    eth.accounts

## Enable local truffle and web app connection

- Update `/quorum-examples/examples/7nodes/raft-start.sh`, add `--rpccorsdomain http://localhost` string in the `GLOBAL_ARGS` line 5

    e.g. : GLOBAL_ARGS="--raft --rpc --rpcaddr 0.0.0.0 --rpccorsdomain http://localhost --rpcapi admin,db,eth,debug,miner,net,shh,txpool,personal,web3,quorum --emitcheckpoints"

- Add Inbound Rule in NSG to allow all ports (or ports 22000 - 22006)

## Demo

    update `quorumVmIp` in `quorum-dapp\public\scripts\helper.js`

    cd quorum-dapp

    npm install 
    
    node app.js

    browse `http://localhost` on multiple browsers with different organizations selected to show events and audit section.

## Reset the Demo

- Restart Quorum nodes

    cd quorum-examples/examples/7nodes

    sudo su

    ./stop.sh

    ./raft-init.sh

    ./raft-start.sh

- Clear Browser cache by clicking on the <Blank> space after the word "DApp" in the header





 







