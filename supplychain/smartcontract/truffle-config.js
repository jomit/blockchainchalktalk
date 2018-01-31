module.exports = {
  networks: {
    development: {
      host: "localhost",
      port: 8545,
      network_id: "*"
    },
    aznode1: {
      host: "<quorum vm ip>",
      port: 22000, // was 8545
      network_id: "*", 
      gasPrice: 0,
      gas: 4500000
    },
    aznode4: {
      host: "<quorum vm ip>",
      port: 22003, // was 8545
      network_id: "*", 
      gasPrice: 0,
      gas: 4500000
    },
    aznode7: {
      host: "<quorum vm ip>",
      port: 22006, // was 8545
      network_id: "*", 
      gasPrice: 0,
      gas: 4500000
    }
  }
};
