"use strict";

var winston = require('winston');
var _ = require("underscore");
var s = require("underscore.string");
var Promise = require('bluebird');

var definition = require('./definition');

var VISION_SCORE_CERTAIN = 0.95;
var VISION_SCORE_IGNORE = 0.8;

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
    .then(definition)
    .then(function (definition) {
      return "It is " + a(desc) + ". " + s.capitalize(desc) + " is " + definition + ".";
    })
    .catch(function (err) {
      winston.error(err);
      return "It is a " + desc + ".";
    });
}

// too dump. returns "an university" or "a hour".
// this is a demo, so, never mind.
function a(word) {
  var first = word[0].toLowerCase();
  if (["a", "e", "i", "o", "u"].indexOf(first) !== -1) {
    return "an " + word;
  }
  else {
    return "a " + word;
  }
}

module.exports = buildText;
