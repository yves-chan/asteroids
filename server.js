/**
 * Created by vincentchan on 15-06-08.
 */
var express = require("express");
var app = express();
var cors = require("cors");

var appRoot = require("app-root-path");

//deployment to heroku
var http = require('http');
//Listen to env port or 3000 and set it in express
var port = Number(process.env.PORT || 3000);
var path = require("path");
app.set('port', port);
var server = http.createServer(app);


app.use(cors());
app.use(bodyParser());
app.use(express.static(__dirname +'/public'));

app.use('/', express.static(appRoot + '/public'));

server.listen(port, function() {
    console.log("Node app is running on port:" + port);
});
