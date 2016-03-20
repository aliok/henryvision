"use strict";

var request = require('request-promise');
var Promise = require("bluebird");
var _ = require('underscore');
var s = require('underscore.string');
var winston = require('winston');
var google = require('googleapis');
var vision = google.vision('v1');

var clientEmail = process.env.GOOGLE_VISION_SERVICE_CLIENT_ACCOUNT_EMAIL;
var privateKey = process.env.GOOGLE_VISION_PRIVATE_KEY;
var scope = 'https://www.googleapis.com/auth/cloud-platform';


if (s.isBlank(clientEmail)) {
  throw new Error("Google Cloud Vision Credential service account is not passed. Pass it with 'GOOGLE_VISION_SERVICE_CLIENT_ACCOUNT_EMAIL' env var.");
}

if (s.isBlank(privateKey)) {
  throw new Error("Google Cloud Vision Credential private key is not passed. Pass it with 'GOOGLE_VISION_PRIVATE_KEY' env var.");
}

// when string 'hello \n world' is used as an env var
// it is converted to 'hello \\n world'
// so, lets fix that
if (s.contains(privateKey, "\\n")) {
  privateKey = privateKey.split("\\n").join("\n");
}

function visionRequest(imageData, maxResults) {
  if (s.isBlank(imageData)) {
    return Promise.reject(new Error("Blank image"));
  }

  if (!maxResults || !_.isNumber(maxResults) || _.isNaN(maxResults)) {
    return Promise.reject(new Error("Invalid max results : " + maxResults));
  }

  var jwtClient = new google.auth.JWT(clientEmail, null, privateKey, [scope], null);

  return new Promise(function (fulfill, reject) {
    jwtClient.authorize(function (err) {
      if (err) {
        return reject(err);
      }

      winston.debug("Google auth success");

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

      vision.images.annotate({auth: jwtClient, resource: options}, function (err, data) {
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
  });


}

module.exports = visionRequest;
