"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var winston = require('winston');
var _ = require("underscore");
var s = require("underscore.string");
var Promise = require('bluebird');
var fh = require('fh-mbaas-api');

var textBuilder = require('./text-builder');
var vision = require('./vision');

function henryVisionRoute() {
  var router = new express.Router();
  router.use(cors());

  // since this route receives images, let's increase the payload limit.
  // images can be that big
  router.use(bodyParser.json({limit: '20mb'}));
  router.use(bodyParser.urlencoded({limit: '20mb', extended: true}));


  router.post('/', function (req, res) {
    winston.debug(new Date(), 'In henryvision route POST');
    var image = req.body.image;

    if (s.isBlank(image)) {
      winston.debug("Image blank!");
      return returnWithStatus(res, 400, "Passed `image` parameter is blank");
    }

    vision(image)
      .then(function (suggestionList) {
        winston.debug("suggestionList", suggestionList);
        return Promise.resolve(suggestionList)
          .then(textBuilder)
          .then(function (text) {
            res.send({text: text, suggestions: suggestionList});
          });
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

module.exports = henryVisionRoute;
