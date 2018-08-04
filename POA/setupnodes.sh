#!/bin/sh
#
#  CREATES NODE ACCOUNTS AND ADDS THE ACCOUNTS IN GENESIS FILE WITH PREFUND
#

if [ ! $1 ]; then
    echo "Please provide number of nodes to setup."
    exit
fi

IMGNAME="ethereum/client-go"
PASSWORDFILE=$(pwd)/password.txt
GENESISTEMPLATEFILE=$(pwd)/genesis.json.template

NUMBEROFNODES=$1
COUNTER=1
ACCOUNTALLOC=""
while [ $COUNTER -le $NUMBEROFNODES ]
do
    # Creating initial account    
    NODENAME=node$COUNTER
    DATADIR=$(pwd)/data/.ethereum_$NODENAME
    mkdir $DATADIR
    
    ACCOUNTADDRESS=$(docker run --rm -v $DATADIR:/root/.ethereum -v $PASSWORDFILE:/opt/password.txt $IMGNAME account new --password /opt/password.txt | cut -d '{' -f 2 | cut -d '}' -f 1)

    ACCOUNTALLOC+='"'
    ACCOUNTALLOC+=$ACCOUNTADDRESS
    ACCOUNTALLOC+='" : {"balance": "0x200000000000000000000000000000000000000000000000000000000000000"},'

    ((COUNTER++))
done

# Initializing the genesis block
sed "s/#ACCOUNTALLOC/${ACCOUNTALLOC%?}/g" $GENESISTEMPLATEFILE > genesis.json
cat genesis.json
