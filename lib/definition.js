"use strict";

var express = require('express');
var bodyParser = require('body-parser');
var cors = require('cors');
var winston = require('winston');
var _ = require("underscore");
var s = require("underscore.string");

var scraper = require("./wordnet-page-scraper");

function definitionRoute() {
  var router = new express.Router();
  router.use(cors());
  router.use(bodyParser.json());
  router.use(bodyParser.urlencoded({
    extended: true
  }));


  // GET REST endpoint - query params may or may not be populated
  router.get('/', function (req, res) {
    winston.debug(new Date(), 'In definition route GET / req.query=', req.query);

    if (!req.query) {
      return returnWithStatus(res, 400, "No `word` parameter passed");
    }

    var word = req.query.word;

    if (!_.isString(word)) {
      return returnWithStatus(res, 400, "Passed `word` parameter is not a string");
    }

    if (s.isBlank(word)) {
      return returnWithStatus(res, 400, "Passed `word` parameter is blank");
    }

    scraper(word)
      .then(function (definitionList) {
        if (_.isEmpty(definitionList)) {
          res.json({});
        }
        else {
          var definitionStr = extractBestDefinition(definitionList);
          res.send({definition: definitionStr});
        }
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

function extractBestDefinition(definitionList) {
  var nounDefs = _.filter(definitionList, function (def) {
    return def.type === "noun";
  });
  if (!_.isEmpty(nounDefs)) {
    return nounDefs[0].definition;
  }

  return definitionList[0].definition;
}


module.exports = definitionRoute;
