#!/bin/sh

# Creates a bootnode container
mkdir $(pwd)/data
IMAGENAME="ethereum/client-go:alltools-v1.8.12"
BOOTNODEPATH=$(pwd)/data/.bootnode
mkdir -p $BOOTNODEPATH

docker run --rm -v /$BOOTNODEPATH:/opt/bootnode $IMAGENAME bootnode --genkey /opt/bootnode/boot.key
docker run -d --name ethereum-bootnode -v $BOOTNODEPATH:/opt/bootnode $IMAGENAME bootnode --nodekey /opt/bootnode/boot.key --verbosity=9
#docker logs ethereum-bootnode