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

    describe("when there is one word", function () {
        it("should generate sentence for score > 0.95", function (done) {
            var suggestions = [
                {description: "pet", score: 0.98}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is a pet. Pet is something cool.")
                .notify(done);
        });

        it("should generate sentence for 0.95 > score > 0.8", function (done) {
            var suggestions = [
                {description: "pet", score: 0.90}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That should be a pet. Pet is something cool.")
                .notify(done);
        });

        it("should generate sentence for 0.8 > score > 0.6", function (done) {
            var suggestions = [
                {description: "pet", score: 0.65}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is probably a pet. Pet is something cool.")
                .notify(done);
        });

        it("should generate sentence for score < 0.6", function (done) {
            var suggestions = [
                {description: "pet", score: 0.5}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That might be a pet. Pet is something cool.")
                .notify(done);
        });

    });

    describe("when at least one word have > 0.95", function () {
        it("should return 2 words with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.98},
                {description: "dog", score: 0.97},
                {description: "mammal", score: 0.96},
                {description: "animal", score: 0.95},
                {description: "vertebrate", score: 0.89}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is a pet or a dog. Pet is something cool.")
                .notify(done);
        });

        it("should return 2 words one with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.98},
                {description: "dog", score: 0.87},
                {description: "mammal", score: 0.86},
                {description: "animal", score: 0.85},
                {description: "vertebrate", score: 0.79}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is a pet. It can be a dog as well. Pet is something cool.")
                .notify(done);
        });

    });

    describe("when at least one word have > 0.8 but all have < 0.95", function () {
        it("should return 2 words with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.93},
                {description: "dog", score: 0.92},
                {description: "mammal", score: 0.96},
                {description: "animal", score: 0.95},
                {description: "vertebrate", score: 0.89}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That should be a pet or a dog. Pet is something cool.")
                .notify(done);
        });

        it("should return 2 words one with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.93},
                {description: "dog", score: 0.79},
                {description: "mammal", score: 0.78},
                {description: "animal", score: 0.77},
                {description: "vertebrate", score: 0.74}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That should be a pet. It might be a dog as well. Pet is something cool.")
                .notify(done);
        });

    });

    describe("when at least one word have > 0.6 but all have < 0.8", function () {
        it("should return 2 words with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.73},
                {description: "dog", score: 0.72},
                {description: "mammal", score: 0.71},
                {description: "animal", score: 0.70},
                {description: "vertebrate", score: 0.69}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is probably a pet or a dog. Pet is something cool.")
                .notify(done);
        });

        it("should return 2 words one with certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.73},
                {description: "dog", score: 0.52},
                {description: "mammal", score: 0.51},
                {description: "animal", score: 0.50},
                {description: "vertebrate", score: 0.59}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That is probably a pet. It might be a dog as well. Pet is something cool.")
                .notify(done);
        });

    });

    describe("when but all have scores < 0.6", function () {
        it("should return 2 words with no certainty", function (done) {
            var suggestions = [
                {description: "pet", score: 0.53},
                {description: "dog", score: 0.52},
                {description: "mammal", score: 0.51},
                {description: "animal", score: 0.50},
                {description: "vertebrate", score: 0.49}
            ];

            expect(buildText(suggestions)).to.eventually.deep
                .equal("That might be a pet or a dog. Pet is something cool.")
                .notify(done);
        });
    });
});
