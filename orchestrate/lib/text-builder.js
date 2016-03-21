"use strict";

var winston = require('winston');
var _ = require("underscore");
var s = require("underscore.string");
var Promise = require('bluebird');

var definition = require('./definition');

function buildText(visionSuggestionList) {
  if (!_.isArray(visionSuggestionList)) {
    winston.debug(typeof visionSuggestionList);
    return Promise.resolve("Sorry, couldn't find anything.");
  }

  winston.debug("Suggestions before filtering", visionSuggestionList);

  if (_.isEmpty(visionSuggestionList)) {
    winston.debug("Suggestions after filtering", visionSuggestionList);
    return Promise.resolve("Sorry, couldn't find anything.");
  }

  var hasAtLeast2Suggestions = visionSuggestionList.length > 1;
  var bestTrustLevel = trustLevel(visionSuggestionList[0].score);

  if (!hasAtLeast2Suggestions) {
    return buildTextSingle(visionSuggestionList[0].description, bestTrustLevel);
  } else {
    return buildTextDouble(visionSuggestionList[0].description, bestTrustLevel,
      visionSuggestionList[1].description, trustLevel(visionSuggestionList[1].score));
  }
}

function buildTextSingle(trustLevel, desc) {
  return Promise.resolve(desc)
    .then(definition)
    .then(function (definition) {
      return "That " + modalVerbFirstWord(trustLevel) + " " + a(desc) + ". "
        + s.capitalize(desc) + " is " + definition + ".";
    })
    .catch(function (err) {
      winston.error(err);
      return "That " + modalVerbFirstWord(trustLevel) + " " + a(desc) + ".";
    });
}

function buildTextDouble(desc0, trustLevel0, desc1, trustLevel1) {
  return Promise.resolve(desc0)
    .then(definition)
    .then(function (definition) {
      if (trustLevel0 === trustLevel1) {
        return "That " + modalVerbFirstWord(trustLevel0) + " " + a(desc0) + " or " + a(desc1) + ". "
          + s.capitalize(desc0) + " is " + definition + ".";
      }
      else {
        return "That " + modalVerbFirstWord(trustLevel0) + " " + a(desc0) + ". " +
          "It " + modalVerbSecondWord(trustLevel1) + " " + a(desc1) + " as well. "
          + s.capitalize(desc0) + " is " + definition + ".";
      }
    })
    .catch(function (err) {
      winston.error(err);
      return "It is a " + desc0 + ".";
    });
}

function modalVerbFirstWord(trustLevel) {
  if (trustLevel === 3) {
    return "is";
  }
  if (trustLevel === 2) {
    return "should be";
  }
  if (trustLevel === 1) {
    return "is probably";
  }

  return "might be";
}

function modalVerbSecondWord(trustLevel) {
  if (trustLevel === 3) {
    return "can be";
  }
  if (trustLevel === 2) {
    return "can be";
  }
  if (trustLevel === 1) {
    return "might be";
  }
  return "might be";
}

function trustLevel(score) {
  if (score > 0.95)
    return 3;
  if (score > 0.8) {
    return 2;
  }
  if (score > 0.6) {
    return 1;
  }
  return 0;
}

// too dumb. returns "an university" or "a hour".
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
