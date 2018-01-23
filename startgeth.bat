RD /S /Q %~dp0\data\geth\chainData
RD /S /Q %~dp0\data\geth\lightchainData
RD /S /Q %~dp0\data\geth\dapp
RD /S /Q %~dp0\data\geth\nodes
del %~dp0\data\geth\nodekey

geth.exe --datadir=data init genesis.json

geth.exe --rpc --networkid=112233 --datadir "./data" --rpccorsdomain "*" --rpcapi "eth,web3,personal,net,miner,admin,debug" --verbosity 3 --nodiscover console
