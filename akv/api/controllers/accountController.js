(function (accountController) {
    var KeyVault = require('azure-keyvault');
    var AuthenticationContext = require('adal-node').AuthenticationContext;
    var Crypto = require('crypto');
    var ethUtil = require('ethereumjs-util');
    var EthereumTransaction = require('ethereumjs-tx');
    var Web3 = require('web3');

    var clientId = "";
    var clientSecret = "";
    var vaultUri = "";

    var rpcUrl = "http://localhost:8545";
    accountController.init = function (app) {

        var credentials = new KeyVault.KeyVaultCredentials(accountController.getAuthenticator());
        var client = new KeyVault.KeyVaultClient(credentials);

        app.post('/registerAccount', function (req, res) {

            // Get keyname from UPN
            var keyName = accountController.getKeyName(req.body.userPrincipalName);

            var attributes = { expires: new Date('2050-02-02T08:00:00.000Z'), notBefore: new Date('2016-01-01T08:00:00.000Z') };
            var keyOperations = ['sign', 'verify'];
            var keyOptions = {
                keyOps: keyOperations,
                keyAttributes: attributes,
                curve: "SECP256K1"
            };

            // Generate new key in KeyVault
            client.createKey(vaultUri, keyName, 'EC-HSM', keyOptions, function (err, keyBundle) {
                if (err) throw err;

                // Generate ethereum account account address from the 
                var publicKey = Buffer.concat([keyBundle.key.x, keyBundle.key.y]);
                var publicKeyHash = ethUtil.bufferToHex(publicKey);

                var publicKeyDigest = ethUtil.bufferToHex(ethUtil.sha3(publicKeyHash));
                var ethAccountAddress = publicKeyDigest.substr(publicKeyDigest.length - 40);

                res.json({
                    keyName: keyName,
                    ethAccountAddress: ethAccountAddress
                });
            });
        });

        app.post('/sendEther', function (req, res) {

            var toAccount = "0x" + req.body.toAccount;

            // Get keyname from UPN
            var keyName = accountController.getKeyName(req.body.fromUPN);

            // Get eth account Address from keyname
            accountController.getAccountDetails(keyName, client, function (accountDetails) {
                
                var fromAccount = "0x" + accountDetails.ethAccountAddress;

                // Create new transaction object
                var web3 = new Web3(new Web3.providers.HttpProvider(rpcUrl));
                var nonce = web3.eth.getTransactionCount(fromAccount);

                var rawTransaction = {
                    nonce: nonce,
                    from: fromAccount,
                    to: toAccount,
                    value: web3.toHex(web3.toWei(req.body.value, 'ether'))
                };

                var estimatedGas = web3.eth.estimateGas(rawTransaction);
                var gasPrice = web3.eth.gasPrice.toNumber();
                var gasLimit = estimatedGas * 5;

                rawTransaction.gasLimit = web3.toHex(gasLimit);
                rawTransaction.gasPrice = web3.toHex(gasPrice);

                var ethTransaction = new EthereumTransaction(rawTransaction);

                // Save raw transaction for later use
                var rawTx = ethTransaction.raw;

                // Get transaction hash for signing
                var rawHash = ethTransaction.hash(false);

                client.sign(vaultUri, keyName, "", "ECDSA256", rawHash, function (err, keyOperation) {

                    // 0 nonce
                    // 1 gasPrice
                    // 2 gasLimit
                    // 3 to
                    // 4 value
                    // 5 data
                    // 6 v
                    // 7 r
                    // 8 s

                    // Update r value in the raw transaction 
                    var r = keyOperation.result.slice(0, 32);
                    rawTx[7] = r;

                    // Update s value in the raw transaction 
                    var s = keyOperation.result.slice(32, 64);
                    rawTx[8] = s;

                    // Update v value in the raw transaction 
                    var pubKey = Buffer.concat([accountDetails.keyBundle.key.x, accountDetails.keyBundle.key.y]);

                    var recoverPubKey = ethUtil.ecrecover(rawHash,27,r,s);
                    if(Buffer.compare(pubKey, recoverPubKey) == 0){
                        rawTx[6] = new Buffer([0x1b]);
                    } else {
                        rawTx[6] = new Buffer([0x1c]);
                    }

                    // Get the rlp encoded hash of the signed transaction
                    var signedTx = ethUtil.bufferToHex(ethUtil.rlp.encode(rawTx));

                    // Submit the raw transaction
                    var transactionHash = web3.eth.sendRawTransaction(signedTx);  // TODO : Debug "invalid sender" error 
                    res.json({
                        transactionHash: transactionHash,
                        estimatedGas: estimatedGas,
                        gasPrice: gasPrice,
                        gasLimit: gasLimit
                    });
                });
            });
        });

        app.post('/getAccount', function (req, res) {
            var keyName = accountController.getKeyName(req.body.userPrincipalName);
            accountController.getAccountDetails(keyName, client, function (accountDetails) {
                res.json(accountDetails);
            });
        });
    };

    accountController.getAccountDetails = function (keyName, keyVaultClient, callback) {
        keyVaultClient.getKey(vaultUri, keyName, "", function (err, keyBundle) {
            //console.log(keyBundle);
            var publicKey = Buffer.concat([keyBundle.key.x, keyBundle.key.y]);
            var publicKeyHash = ethUtil.bufferToHex(publicKey);
            //console.log(publicKeyHash);   

            var publicKeyDigest = ethUtil.bufferToHex(ethUtil.sha3(publicKeyHash));
            var ethAccountAddress = publicKeyDigest.substr(publicKeyDigest.length - 40);
            //console.log("Account Address => 0x" + ethAccountAddress);
            callback({
                keyName: keyName,
                //keyId : keyBundle.key.kid,
                keyBundle: keyBundle,
                ethAccountAddress: ethAccountAddress
            });
        });
    };

    accountController.getAuthenticator = function () {
        var authenticator = function (challenge, callback) {
            var context = new AuthenticationContext(challenge.authorization);
            return context.acquireTokenWithClientCredentials(challenge.resource, clientId, clientSecret, function (err, tokenResponse) {
                if (err) throw err;
                var authorizationValue = tokenResponse.tokenType + ' ' + tokenResponse.accessToken;
                return callback(null, authorizationValue);
            });
        };
        return authenticator;
    };

    accountController.getKeyName = function (userPrincipalName) {
        var keyName = userPrincipalName;
        return keyName.replace(/[^a-z0-9]/g, '');
    };
})(module.exports);




