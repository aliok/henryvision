"use strict";

var mbaasApi = require('fh-mbaas-api');
var express = require('express');
var mbaasExpress = mbaasApi.mbaasExpress();
var cors = require('cors');
var winston = require("winston");
var Promise = require("bluebird");

// list the endpoints which you want to make securable here
var securableEndpoints;
securableEndpoints = ['/vision'];

var app = express();

// Enable CORS for all requests
app.use(cors());

// Note: the order which we add middleware to Express here is important!
app.use('/sys', mbaasExpress.sys(securableEndpoints));
app.use('/mbaas', mbaasExpress.mbaas);

// allow serving of static files from the public directory
app.use(express.static(__dirname + '/public'));

// Note: important that this is added just before your own Routes
app.use(mbaasExpress.fhmiddleware());

app.use('/vision', require('./lib/vision.js')());

// Important that this is last!
app.use(mbaasExpress.errorHandler());

module.exports = {};

var server;

module.exports.start = function () {
    return new Promise(function (fulfill, reject) {
        var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8002;
        var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';

        server = app.listen(port, host, function (err) {
            if (err) {
                return reject(err);
            }
            else {
                winston.info("App started at: " + new Date() + " on port: " + port);
                return fulfill();
            }
        });

    });
};

module.exports.stop = function () {
    return new Promise(function (fulfill, reject) {
        server.close(function (err) {
            if (err) {
                return reject(err);
            }
            else {
                return fulfill();
            }
        });
    });
};
