var express = require('express');
var request = require('request-promise');
var Promise = require("bluebird");
var _ = require('underscore');
var s = require('underscore.string');
var jsdom = require('jsdom');
var fs = require('fs');
var winston = require('winston');

function scraper(word) {
  // call looks like this
  // http://wordnetweb.princeton.edu/perl/webwn?s=apple&sub=Search+WordNet&o2=&o0=1&o8=1&o1=1&o7=&o5=&o9=&o6=&o3=&o4=&h=0

  if (!_.isString(word)) {
    return Promise.reject(new Error("Passed word is not a string : " + word));
  }

  if (s.isBlank(word)) {
    return Promise.reject(new Error("Blank word"));
  }

  var params = {
    's': word,
    'sub': 'Search WordNet',
    'o0': '1',
    'o8': '1',
    'o1': '1',
    'h': '0'
  };

  var url = 'http://wordnetweb.princeton.edu/perl/webwn';

  return request({url: url, qs: params})
    .then(function (response) {
      console.log("Gonna parse response");
      return new Promise(function(fulfill, reject){
        jsdom.env(
          response.toString(),
          ["http://code.jquery.com/jquery-2.2.2.min.js"],
          function (err, window) {
            if (err) {
              reject(err);
            }

            var $ = window.$;
            var results = [];
            $("div.form h3").each(function () {
              var $wordType = $(this);

              // trim and make it lowercase.
              var wordType = s($wordType.text()).trim().toLowerCase().value();

              var $definitionList = $wordType.next("ul");
              $definitionList.find("li").each(function(){

                // this is a single definition:
                // <li>
                //   <a href="...">S:</a>
                //   <a class="pos"> (n) </a>
                //   <b>laptop</b>
                //   ,
                //   <a href="...">laptop computer</a>
                //   (a portable computer small enough to use in your lap)
                // </li>
                var $definitionRow = $(this);

                // get the first <b>. it is the word itself
                var $word = $definitionRow.find("b").first();

                // trim and lowercase the word
                var word = s($word.text()).trim().toLowerCase().value();

                // get all text nodes
                var $textElements = $definitionRow
                  .contents()
                  .filter(function() {
                    return this.nodeType === 3; //Node.TEXT_NODE
                  });

                //
                var $textNode = $textElements.last().text();

                // remove the brackets around
                var definition = s($textNode).trim().slice(1, -1).value();
                results.push({
                  type: wordType,
                  word: word,
                  definition: definition
                });
              });
            });

            fulfill(results);
          }
        );
      });
    })
    .catch(function (err) {
      console.log(err);
      return Promise.reject(err);
    });


  // jsdom.env(body,["http://code.jquery.com/jquery.js"], function (errors, window) {
  //   var $ = window.$;
  //   var currentSearches = [];
  //   // The span with id 'currentsearches' contains a list of <a> tags which have the current searches
  //   $('#currentsearches').children('a').each(function () {
  //     console.log('this = ', this.innerHTML);
  //     // Iterate over each child element of type <a> and store the value in the currentSearches array
  //     currentSearches.push(this.innerHTML)
  //   });
  //   return res.json(currentSearches);
  // });
}

module.exports = scraper;
