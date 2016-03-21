"use strict";

var winston = require('winston');
var Promise = require('bluebird');
var fh = require('fh-mbaas-api');

var SERVICE_CALL_TIMEOUT = 10000;

var MAX_VISION_RESULTS = 5;

function getVision(image) {
  return new Promise(function (fulfill, reject) {
    fh.service({
      "guid": "nvssok5suaw3fgf3w7fppt3a",
      "path": "/vision",
      "method": "POST",
      "timeout": SERVICE_CALL_TIMEOUT,
      headers: {
        "Content-Type": "application/json"
      },
      "params": {
        "maxResults": MAX_VISION_RESULTS,
        "image": image
      }
    }, function (err, body) {
      if (err) {
        return reject(err);
      } else {
        return fulfill(body);
      }
    });
  });
}

module.exports = getVision;
