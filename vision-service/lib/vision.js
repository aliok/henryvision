"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var winston = require('winston');
var _ = require("underscore");
var s = require("underscore.string");

var visionRequest = require('./vision-request');

function visionRoute() {
  var router = new express.Router();
  router.use(cors());

  // since this route receives images, let's increase the payload limit.
  // images can be that big
  router.use(bodyParser.json({limit: '20mb'}));
  router.use(bodyParser.urlencoded({limit: '20mb', extended: true}));

  router.post('/', function (req, res) {
    winston.debug(new Date(), 'In definition route POST');
    var image = req.body.image;
    var maxResults = req.body.maxResults || 3;

    if(s.isBlank(image)){
      return returnWithStatus(res, 400, "Passed `image` parameter is blank");
    }

    visionRequest(image, maxResults)
      .then(function(suggestionList){
        res.send(suggestionList);
      })
      .catch(function (err) {
        winston.error(err);
        returnWithStatus(res, 500, "Something's wrong dude!");
      });

  });

  return router;
}

function returnWithStatus(res, status, message) {
  res.status(status);
  return res.json({
    "status": status,
    "message": message
  });
}

module.exports = visionRoute;
