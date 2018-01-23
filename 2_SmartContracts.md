## Initialize truffle 

    md smartcontracts
    cd smartcontracts
    
    truffle init

    del truffle.js

    truffle compile

# Create new contract

    truffle create contract Calculator

    (add constructor and function code)

    truffle compile

# Setup the dev network

    ganache-cli

    (update truffle-config.js)

    module.exports = {
        networks: {
            development: {
                host: "localhost",
                port: 8545,
                network_id: "*"
            }
        }
    };

# Deploy the contract to dev network

    truffle create migration calculator

    (update the migrations\###########_calculator.js file)

    var Calculator = artifacts.require("./Calculator.sol");

    module.exports = function(deployer) {
        deployer.deploy(Calculator,10);
    };

    truffle migrate

# Test the contract

    truffle create test calculator

    (updated test\calculator.js)

    var Calculator = artifacts.require("./Calculator.sol");

    contract('calculator', function(accounts) {
        it("should initialized correctly", function(done) {
            var calculator = Calculator.deployed()
            calculator.then(function(contract){
            return contract.getResult.call();
            }).then(function (result) {
                assert.equal(result.valueOf(), 10, "Contract initialized with value equal to 10!!!");
                console.log("Result =>" + result.valueOf());
                done();
            });
        });
    });

    truffle test ./test/calculator.js

