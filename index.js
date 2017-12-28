var http = require('http');
const uuidv1 = require('uuid/v4');
const APIResponseBaseModel = require('./APIResponseModel/APIResponseBaseModel');
const ServerConstant = require("./common/ServerConstant.js");

http.createServer(function (req, res) {

    var a = new APIResponseBaseModel(200);

    res.writeHead(200, {'Content-Type': 'text/html'});
    res.end(JSON.stringify(a));
}).listen(8080);
