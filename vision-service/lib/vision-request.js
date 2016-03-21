"use strict";

var request = require('request-promise');
var Promise = require("bluebird");
var _ = require('underscore');
var s = require('underscore.string');
var winston = require('winston');
var google = require('googleapis');
var vision = google.vision('v1');

var apiKey = process.env.GOOGLE_VISION_SERVICE_API_KEY;

if (s.isBlank(apiKey)) {
  throw new Error("Google Cloud Vision API key. Pass it with 'GOOGLE_VISION_SERVICE_API_KEY' env var.");
}

function visionRequest(imageData, maxResults) {
  if (s.isBlank(imageData)) {
    return Promise.reject(new Error("Blank image"));
  }

  if (!maxResults || !_.isNumber(maxResults) || _.isNaN(maxResults)) {
    return Promise.reject(new Error("Invalid max results : " + maxResults));
  }

  return new Promise(function (fulfill, reject) {
    var options = {
      "requests": [
        {
          "image": {
            "content": imageData
          },
          "features": [
            {
              "type": "LABEL_DETECTION",
              "maxResults": maxResults
            }
          ]
        }
      ]
    };

    vision.images.annotate({auth: apiKey, resource: options}, function (err, data) {
      if (err) {
        return reject(err);
      }

      winston.debug("Received response", data);
      // received result is something like following:
      // {"responses":[{"labelAnnotations":[{"mid":"/m/068hy","description":"pet","score":0.98414}]}]}
      if (data && _.isArray(data.responses) && data.responses[0] && _.isArray(data.responses[0].labelAnnotations)) {
        var annotations = data.responses[0].labelAnnotations;
        annotations = _.map(annotations, function (annotation) {
          return _.pick(annotation, 'description', 'score');
        });
        fulfill(annotations);
      }
      else {
        fulfill([]);
      }
    });
  });


}

module.exports = visionRequest;
