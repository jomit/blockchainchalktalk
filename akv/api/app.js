var express = require('express');
var bodyParser = require('body-parser')
var cors = require('cors')
var app = express();
var controllers = require("./controllers");
var port = process.env.PORT || 8081;

app.use(cors());
app.use(bodyParser.json({limit: '10mb'}));
app.use(bodyParser.urlencoded({limit: '10mb', extended: true}));

controllers.init(app);

var server = app.listen(port, function () {
    var host = server.address().address
    var port = server.address().port
    console.log("API App listening @ http://%s:%s", host, port)
})
