# Setup PoA Ethereum Network using Docker

#### Prerequisites

- Install Docker

- Install Git Bash (for Windows)

- Update `~/.bash_profile` file for the [path format workaround on Windows](https://github.com/docker/toolbox/issues/673)
    - Add `export MSYS_NO_PATHCONV=1` in the `~/.bash_profile` file

#### Run Scripts

- `./setupbootnode.sh`

- `./setupnodes.sh <number of nodes>`

- `./startnode.sh 1`

# Setup PoA Ethereum Network without Docker

#### Steps to setup PoA Ethereum network

- `mkdir node1, node2`
- `echo "password" > node1/password.txt`
- `echo "password" > node2/password.txt`
- `geth --datadir node1/ account new --password node1/password.txt`   (Copy the address)
- `geth --datadir node2/ account new --password node1/password.txt`   (Copy the address)   
- `echo "1dcb034cfce6e4198da71310a0a0907989132124" >> accounts.txt`
- `echo "a70037836c5110510013cbfc8df1ed1d265780d5" >> accounts.txt`

- `puppeth`  (to generate the genesis file)

- `geth --datadir node1/ init genesis.json`
- `geth --datadir node2/ init genesis.json`

- `bootnode -genkey boot.key`

#### Start the nodes

- `bootnode -nodekey boot.key -verbosity 9 -addr :30310`

- `geth --datadir node1/ --syncmode 'full' --port 30311 --rpc --rpcaddr 'localhost' --rpcport 8501 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes 'enode://ef44b38fc9db110d18154dc7a243767d6793ed4e116b8d5be05432c3c9c4c4519e2dd3b9978b78f7684d48e3c2639d3e10f1464f7cdb19ffbc63f04cc1f98ee7@127.0.0.1:30310' --networkid 9999 --gasprice '1' -unlock '0x21dad2b5f8b55db1546bd2a8ba782b9cd4f1c6ad' --password node1/password.txt --mine`

- `geth --datadir node2/ --syncmode 'full' --port 30313 --rpc --rpcaddr 'localhost' --rpcport 8502 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes 'enode://ef44b38fc9db110d18154dc7a243767d6793ed4e116b8d5be05432c3c9c4c4519e2dd3b9978b78f7684d48e3c2639d3e10f1464f7cdb19ffbc63f04cc1f98ee7@127.0.0.1:30310' --networkid 9999 --gasprice '0' -unlock '0x01f385b9dc61250990b9e60d93081cc53cbd1f04' --password node2/password.txt --ipcdisable --mine`

#### Testing using Javascript Console

- `geth attach 'http://localhost:8501'`
- `> net.version`
- `> eth.sendTransaction({'from':eth.coinbase, 'to':'0x01f385b9dc61250990b9e60d93081cc53cbd1f04', 'value':web3.toWei(3, 'ether')})`
- `> eth.getTransactionReceipt("0xc58be0eb0a46fe904a99d03572aa354753ce5f2a71d8d8e34d030b890b174f68")`