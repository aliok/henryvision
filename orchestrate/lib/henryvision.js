"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var winston = require('winston');
var _ = require("underscore");
var s = require("underscore.string");
var Promise = require('bluebird');
var fh = require('fh-mbaas-api');

var SERVICE_CALL_TIMEOUT = 10000;

var MAX_VISION_RESULTS = 3;
var VISION_SCORE_CERTAIN = 0.95;
var VISION_SCORE_IGNORE = 0.8;

function henryVisionRoute() {
  var router = new express.Router();
  router.use(cors());

  // since this route receives images, let's increase the payload limit.
  // images can be that big
  router.use(bodyParser.json({limit: '20mb'}));
  router.use(bodyParser.urlencoded({limit: '20mb', extended: true}));


  // POST REST endpoint - note we use 'body-parser' middleware above to parse the request body in this route.
  // This can also be added in application.js
  // See: https://github.com/senchalabs/connect#middleware for a list of Express 4 middleware
  router.post('/', function (req, res) {
    winston.debug(new Date(), 'In henryvision route POST');
    var image = req.body.image;

    if (s.isBlank(image)) {
      winston.debug("Image blank!");
      return returnWithStatus(res, 400, "Passed `image` parameter is blank");
    }

    getVision(image)
      .then(function (suggestionList) {
        winston.debug("suggestionList", suggestionList);
        return Promise.resolve(suggestionList)
          .then(buildText)
          .then(function (text) {
            res.send({text: text, suggestions:suggestionList});
          });
      })
      .catch(function (err) {
        winston.error(err);
        returnWithStatus(res, 500, "Something's wrong dude!");
      });

  });

  return router;
}

function buildText(visionSuggestionList) {
  if (!_.isArray(visionSuggestionList)) {
    winston.debug(typeof visionSuggestionList);
    return Promise.resolve("Sorry, couldn't find anything.");
  }

  winston.debug("Suggestions before filtering", visionSuggestionList);

  visionSuggestionList = _.filter(visionSuggestionList, function (item) {
    return item.score > VISION_SCORE_IGNORE;
  });

  if (_.isEmpty(visionSuggestionList)) {
    winston.debug("Suggestions after filtering", visionSuggestionList);
    return Promise.resolve("Sorry, couldn't find anything.");
  }

  // for now, let's return the first item with its definition
  var desc = visionSuggestionList[0].description;
  return Promise.resolve(desc)
    .then(getDefinition)
    .then(function (definition) {
      return "It is " + a(desc) + ". " + s.capitalize(desc) + " is " + definition;
    })
    .catch(function (err) {
      winston.error(err);
      return "It is a " + desc + ".";
    });
}

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

function returnWithStatus(res, status, message) {
  res.status(status);
  return res.json({
    "status": status,
    "message": message
  });
}

// too dump. returns "an university" or "a hour".
// this is a demo, so, never mind.
function a(word){
  var first = word[0].toLowerCase();
  if(["a", "e", "i", "o", "u"].indexOf(first) !== -1){
    return "an " + word;
  }
  else{
    return "a " + word;
  }
}

module.exports = henryVisionRoute;
