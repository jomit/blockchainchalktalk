#!/bin/sh
#
#  STARTS A NODE
#

if [ ! $1 ]; then
    echo "Please provide Node Number."
    exit
fi

NODENAME=node$1
IMGNAME="ethereum/client-go"
DATADIR=$(pwd)/data/.ethereum_$NODENAME
GENESISFILE=$(pwd)/genesis.json
PASSWORDFILE=$(pwd)/password.txt

echo  "docker run --rm -v $DATADIR:/root/.ethereum -v $GENESISFILE:/opt/genesis.json $IMGNAME --datadir $DATADIR init /opt/genesis.json"
docker run --rm -v $DATADIR:/root/.ethereum -v $GENESISFILE:/opt/genesis.json $IMGNAME --datadir $DATADIR init /opt/genesis.json

# Get bootnode url
CONTAINERIP=$(docker exec ethereum-bootnode ifconfig eth0 | awk '/inet addr/{print substr($2,6)}')
ENODEURL=$(docker logs ethereum-bootnode 2>&1 | grep enode | head -n 1)
ENODEURL=$(echo $ENODEURL | sed "s/127\.0\.0\.1/$CONTAINERIP/g" | sed "s/\[\:\:\]/$CONTAINERIP/g")
BOOTNODEURL="enode:${ENODEURL#*enode:}"
#echo $BOOTNODEURL

# Starting the node
CONTAINERNAME="ethereum-$NODENAME"
DOCKERPORTS=' -p 30304:30304/udp -p 127.0.0.1:8501:8545/tcp'

# --cache=512 --verbosity=4 --maxpeers=3
echo "docker run -d --name $CONTAINERNAME -v $DATADIR:/root/.ethereum -v $PASSWORDFILE:/opt/password.txt $DOCKERPORTS $IMGNAME --bootnodes $BOOTNODEURL --datadir $DATADIR --syncmode "full" --port 30311 --rpc --rpcaddr 0.0.0.0 --rpcport 8545 --rpcapi "personal,db,eth,net,web3,txpool,miner" --networkid 9999 --gasprice "1" --unlock 0 --password /opt/password.txt --mine --ipcdisable --cache=512"
docker run -d --name $CONTAINERNAME -v $DATADIR:/root/.ethereum -v $PASSWORDFILE:/opt/password.txt $DOCKERPORTS $IMGNAME --bootnodes $BOOTNODEURL --syncmode "full" --port 30311 --rpc --rpcaddr 0.0.0.0 --rpcport 8545 --rpcapi "personal,db,eth,net,web3,txpool,miner" --networkid 9999 --gasprice "1" --unlock 0 --password /opt/password.txt --mine --ipcdisable --cache=512
docker logs $CONTAINERNAME


