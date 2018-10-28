var DesignFabrication = artifacts.require("./DesignFabrication.sol");

contract('DesignFabrication', function (accounts) {
  it("happy path", function () {
    var designFab;
    var designer = accounts[0];
    var projectManager = accounts[1];
    var factorySupervisor = accounts[2];
    var siteForeman = accounts[3];

    return DesignFabrication.deployed().then(function (instance) {
      designFab = instance;
      return designFab.getMEPState.call();
    }).then(function (result) {
      console.log("MEP State =>",result);
      return designFab.CompleteDesign("design completed", { from: designer });
    }).then(function (result) {
      return designFab.getMEPState.call();
    }).then(function (result) {
      console.log("MEP State =>",result);
      return designFab.ApproveDesign("design approved", { from: projectManager });
    }).then(function (result) {
      return designFab.getMEPState.call();
    }).then(function (result) {
      console.log("MEP State =>",result);
    });
  });
});