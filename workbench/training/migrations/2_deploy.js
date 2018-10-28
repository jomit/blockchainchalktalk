var DesignFabrication = artifacts.require("DesignFabrication");

module.exports = function(deployer) {
  deployer.deploy(DesignFabrication, "test design info");
};