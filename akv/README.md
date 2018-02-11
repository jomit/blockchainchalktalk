# Demo - Using Azure KeyVault to manage Ethereum keys

## Setup

- Azure AAD

    - Create New AAD App ([ Instructions ](https://docs.microsoft.com/en-us/azure/azure-resource-manager/resource-group-create-service-principal-portal#create-an-azure-active-directory-application))

- Azure KeyVault

    - Create a new KeyVault (use Premium Pricing Tier)

    - Add new "Access Policies" and select the AAD App created above with full permissions

- Configure and Run Backend API

    - Update `clientId`, `clientSecret` and `vaultUri` in `akv\api\controllers\accountController.js`

    - Update `rpcUrl` with your ethereum network rpc url or use `http://localhost:8545` if you are running `geth` locally.

    - Make sure `geth` is running 

    - `cd akv\api`

    - `npm install`

    - `node app.js`

## Register new Account

- HTTP POST
    - `Url: http://localhost:8081/registerAccount` 
    - `Body : { "userPrincipalName" : "<e.g. : user@domain.onmicrosoft.com>" }`

- It should return the `keyName` and the `ethAccountAddress`. Make sure to copy these as we will need this later.

## Transfer funds to new Account

- Open `geth` console

- Use `transferFunds.js` helper script to transfer 100 Ether to the new account address (returned from the registerAccount)

## Execute transaction

- HTTP POST
    - `Url: http://localhost:8081/sendEther` 
    - `Body : { "fromUPN" : "<e.g. : user@domain.onmicrosoft.com>", "toAccount" : "12890d2cce102216644c59dae5baed380d84830c", "value" : 1 }`

- It should return the `transactionHash`