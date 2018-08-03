#!/bin/sh

if [ ! $1 ]; then
    echo "Please provide node name."
    exit
fi

# Creating initial account
IMGNAME="ethereum/client-go:v1.8.12"
NODENAME=$1
DATADIR=$(pwd)/data/.ethereum_$NODENAME
mkdir $DATADIR
PASSWORDFILE=$(pwd)/password.txt

#ACCOUNTADDRESS=$(docker run --rm -v $DATADIR:/root/.ethereum -v $PASSWORDFILE:/opt/password.txt $IMGNAME account new --password /opt/password.txt | cut -d '{' -f 2 | cut -d '}' -f 1)
ACCOUNTADDRESS="abc123"
#echo $ACCOUNTADDRESS

# Initializing the genesis block
GENESISFILE=$(pwd)/genesis.json

sed -i.bak "s/#ACCOUNTADDRESS/$ACCOUNTADDRESS/g" $GENESISFILE

#docker run --rm -v $DATADIR:/root/.ethereum -v $GENESISFILE:/opt/genesis.json $IMGNAME init /opt/genesis.json

# # Get bootnode url
# CONTAINERIP=$(docker exec ethereum-bootnode ifconfig eth0 | awk '/inet addr/{print substr($2,6)}')
# ENODEURL=$(docker logs ethereum-bootnode 2>&1 | grep enode | head -n 1)
# ENODEURL=$(echo $ENODEURL | sed "s/127\.0\.0\.1/$CONTAINERIP/g" | sed "s/\[\:\:\]/$CONTAINERIP/g")
# BOOTNODEURL="enode:${ENODEURL#*enode:}"
# #echo $BOOTNODEURL

# # Starting the node
# CONTAINERNAME="ethereum-$NODENAME"
# GETHARGS=" --syncmode 'full' --port 30311 --rpc --rpcaddr 'localhost' --rpcport 8545 --rpcapi 'personal,db,eth,net,web3,txpool,miner' --bootnodes $BOOTNODEURL --networkid 9999 --gasprice '1' --unlock '0x5e691639cdbe21cae47d9a64240eb1cc37fda1c7' --password /opt/password.txt --mine"
# DOCKERPORTS=" -p 30311:30311 -p 8540:8545"


# echo "docker run -d --name $CONTAINERNAME -v $DATADIR:/root/.ethereum -v $PASSWORDFILE:/opt/password.txt" \
#     $DOCKERPORTS $IMGNAME $GETHARGS

# #--cache=512 --verbosity=4 --maxpeers=3 ${@:2} 



