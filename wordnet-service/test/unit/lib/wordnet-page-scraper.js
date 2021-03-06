"use strict";

var chai = require("chai");
chai.use(require("chai-as-promised"));
var Promise = require("bluebird");
var mockery = require("mockery-next");
var fs = require("fs");

var expect = chai.expect;

var scraper;

describe("wordnet-page-scraper", function () {

    before(function (done) {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        // we shouldn't actually go and do an HTTP request to Wordnet in unittests.
        // we should mock it.
        //
        // we cannot just intercept and mock the HTTP requests because of `request-promise` module.
        // we need to mock the entire `request-promise` module to do that.
        // see https://github.com/request/request-promise/issues/55
        //
        // this means, return the contents of a file.
        // if word to search for is 'coffee', return the contents of 'wornet_coffee.html'.
        mockery.registerMock('request-promise', function (options) {
            var response = fs.readFileSync(__dirname + '/wordnet_' + options.qs.s + ".html", 'utf8');
            return Promise.resolve(response.trim());
        });

        scraper = require('../../../lib/wordnet-page-scraper');

        done();
    });

    after(function (done) {
        mockery.disable();
        mockery.deregisterAll();
        done();
    });


    describe("when word is not valid", function () {
        it("should not make the request to Wordnet for non-string", function (done) {
            expect(scraper(new Date())).to.be.rejected.notify(done);
        });
        it("should not make the request to Wordnet for object", function (done) {
            expect(scraper({a:1})).to.be.rejected.notify(done);
        });
        it("should not make the request to Wordnet for number", function (done) {
            expect(scraper(1)).to.be.rejected.notify(done);
        });

        it("should not make the request to Wordnet for empty word", function (done) {
            expect(scraper("")).to.be.rejected.notify(done);
        });
        it("should not make the request to Wordnet for blank word", function (done) {
            expect(scraper("  ")).to.be.rejected.notify(done);
        });
    });

    describe("when word is valid", function () {
        it("should return a single definition when there is single definition", function (done) {
            Promise.resolve("laptop")
                .then(scraper)
                .then(function(results){
                    expect(results).to.be.an('array')
                        .and.to.have.length(1);
                    expect(results[0]).to.be.deep.equal({
                        type: "noun",
                        word: "laptop",
                        definition: "a portable computer small enough to use in your lap"
                    });
                    done();
                })
                .catch(done);
        });

        it("it should return all results when there is multiple definitions", function (done) {
            Promise.resolve("coffee")
                .then(scraper)
                .then(function(results){
                    expect(results).to.be.an('array')
                        .and.to.have.length(4);
                    expect(results[0]).to.be.deep.equal({
                        type: "noun",
                        word: "coffee",
                        definition: "a beverage consisting of an infusion of ground coffee beans"
                    });
                    expect(results[1]).to.be.deep.equal({
                        type: "noun",
                        word: "coffee",
                        definition: "any of several small trees and shrubs native to the tropical Old World yielding coffee beans"
                    });
                    expect(results[2]).to.be.deep.equal({
                        type: "noun",
                        word: "coffee",
                        definition: "a seed of the coffee tree; ground to make coffee"
                    });
                    expect(results[3]).to.be.deep.equal({
                        type: "noun",
                        word: "coffee",
                        definition: "a medium brown to dark-brown color"
                    });
                    done();
                })
                .catch(done);
        });

        it("it should return empty array when nothing found", function (done) {
            Promise.resolve("pluralizr")
                .then(scraper)
                .then(function(results){
                    expect(results).to.be.an('array')
                        .and.to.have.length(0);
                    done();
                })
                .catch(done);
        });
    });
});
