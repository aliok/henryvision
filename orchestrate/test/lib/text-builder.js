"use strict";

var chai = require("chai");
chai.use(require("chai-as-promised"));
var Promise = require("bluebird");
var mockery = require("mockery-next");
var fs = require("fs");

var expect = chai.expect;

var buildText;

describe("wordnet-page-scraper", function () {

    before(function (done) {
        mockery.enable({
            warnOnReplace: false,
            warnOnUnregistered: false,
            useCleanCache: true
        });

        // won't test the integration with definition module.
        // like, when it fails or something.
        // just gonna test the logic of building the text
        mockery.registerMock('../../lib/definition', function () {
            return Promise.resolve("something cool");
        });

        buildText = require('../../lib/text-builder');

        done();
    });

    after(function (done) {
        mockery.disable();
        mockery.deregisterAll();
        done();
    });


    describe("when no suggestion found", function () {
        it("should return sorry", function (done) {
            expect(buildText([])).to.eventually.deep.equal("Sorry, couldn't find anything.").notify(done);
        });
    });

    describe("when at least one word have > 0.95", function () {
        it("should return 2 words with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.98414},
                {description: "dog", score: 0.97904623},
                {description: "mammal", score: 0.96168429},
                {description: "animal", score: 0.95276582},
                {description: "vertebrate", score: 0.89599329}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is a pet or a dog. Pet is something cool.")
                .notify(done);
        });

        it("should return 2 words one with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.98414},
                {description: "dog", score: 0.87904623},
                {description: "mammal", score: 0.86168429},
                {description: "animal", score: 0.85276582},
                {description: "vertebrate", score: 0.79599329}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is a pet. It can be a dog as well. Pet is something cool.")
                .notify(done);
        });

    });

    describe("when at least one word have > 0.8 but all have < 0.95", function () {
        it("should return 2 words with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.93414},
                {description: "dog", score: 0.92904623},
                {description: "mammal", score: 0.96168429},
                {description: "animal", score: 0.95276582},
                {description: "vertebrate", score: 0.89599329}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That should be a pet or a dog. Pet is something cool.")
                .notify(done);
        });

        it("should return 2 words one with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.93414},
                {description: "dog", score: 0.79904623},
                {description: "mammal", score: 0.78168429},
                {description: "animal", score: 0.77276582},
                {description: "vertebrate", score: 0.74599329}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That should be a pet. It might be a dog as well. Pet is something cool.")
                .notify(done);
        });

    });

    describe("when at least one word have > 0.6 but all have < 0.8", function () {
        it("should return 2 words with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.73414},
                {description: "dog", score: 0.72904623},
                {description: "mammal", score: 0.71168429},
                {description: "animal", score: 0.70276582},
                {description: "vertebrate", score: 0.69599329}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is probably a pet or a dog. Pet is something cool.")
                .notify(done);
        });

        it("should return 2 words one with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.73414},
                {description: "dog", score: 0.52904623},
                {description: "mammal", score: 0.51168429},
                {description: "animal", score: 0.50276582},
                {description: "vertebrate", score: 0.59599329}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is probably a pet. It might be a dog as well. Pet is something cool.")
                .notify(done);
        });

    });

    describe("when but all have scores < 0.6", function () {
        it("should return 2 words with no certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.53414},
                {description: "dog", score: 0.52904623},
                {description: "mammal", score: 0.51168429},
                {description: "animal", score: 0.50276582},
                {description: "vertebrate", score: 0.49599329}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That might be a pet or a dog. Pet is something cool.")
                .notify(done);
        });
    });
});
