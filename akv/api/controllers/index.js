(function (controllers) {
    var accountController = require("./accountController.js");

    controllers.init = function (app) {
        accountController.init(app);
    }
})(module.exports);