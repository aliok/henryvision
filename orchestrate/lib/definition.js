"use strict";

var s = require("underscore.string");
var Promise = require('bluebird');
var fh = require('fh-mbaas-api');

var SERVICE_CALL_TIMEOUT = 10000;

function getDefinition(word) {
  return new Promise(function (fulfill, reject) {
    fh.service({
      "guid": "jndexd635x46k6etfvwvtu7t",
      "path": "/definition",
      "method": "GET",
      "params": {
        "word": word
      },
      "timeout": SERVICE_CALL_TIMEOUT,
      headers: {
        "Content-Type": "application/json"
      }
    }, function (err, body) {
      if (err) {
        return reject(err);
      } else {
        if (s.isBlank(body.definition)) {
          return new Error("No definition found");
        }
        else {
          return fulfill(body.definition);
        }
      }
    });
  });
}

module.exports = getDefinition;
