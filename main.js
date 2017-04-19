var redis = require('redis')
var multer  = require('multer')
var express = require('express')
var fs      = require('fs')
var http    = require('http');
var httpProxy = require('http-proxy');
var app = express()
// REDIS
var client = redis.createClient(6379, '127.0.0.1', {})
var portNum=3020;
var serverMap=new Array();




client.del("serverList");
console.log("serverList initialized...");
client.sadd("serverList", "http://104.131.28.221:80");
client.sadd("serverList", "http://104.131.93.107:80");
console.log("both checkboxes are added to serverList...");



// proxy

var proxy = httpProxy.createProxyServer({});

var pServer = http.createServer(function (req, res) {
        client.spop("serverList", function(err, serverInfo) {
                var tval=serverInfo;
                console.log("proxy target serverInfo = " + tval);
                proxy.web(req, res, { target: tval});
                client.sadd("serverList",tval);
        });
        console.log("pserver done...!");
        //res.write("pServer process");
});
pServer.listen(80);
console.log("proxyServer started to listening to port 80...");

///////////// WEB ROUTES

app.get('/', function(req, res) {
  console.log("inside blank method...");
  res.send('hello world');
});


// server

var server= http.createServer(function(req, res) {
        console.log("serverCreated...!!");
        res.write("got connection");
        res.end();
});
server.listen(9000);
