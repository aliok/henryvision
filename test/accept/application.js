"use strict";

/*
 * Integration test for the application.
 * /test/unit/lib/wordnet-page-scraper.js test has the detailed
 * tests for the scraping. thus here I won't test base cases again.
 * That test was not really hitting the Wordnet website.
 * This one does! So that the build breaks when Wordnet changes their
 * HTML structure.
 */

var chai = require("chai");
var request = require("request-promise");
var expect = chai.expect;
chai.use(require("chai-as-promised"));
chai.use(require("chai-string"));

var port = process.env.FH_PORT || process.env.OPENSHIFT_NODEJS_PORT || 8001;
var host = process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0';
var baseUrl = "http://" + host + ":" + port;

describe("/definition", function () {
    before(function (done) {
        startServer(done);
    });

    after(function (done) {
        stopServer(done);
    });

    it("should respond with error when word is not valid", function (done) {
        var url = baseUrl + "/definition";
        var params = {
            word: ""
        };

        var promise = request({url: url, qs: params});
        expect(promise).to.be.rejected
            .then(function (err) {
                expect(err).to.have.property("statusCode", 400);
            })
            .then(done);
    });

    it("should respond with definition of coffee", function (done) {
        var url = baseUrl + "/definition";
        var params = {
            word: "coffee"
        };

        request({url: url, qs: params, json: true})
            .then(function (response) {
                expect(response.definition).to.equal("a beverage consisting of an infusion of ground coffee beans");
            })
            .then(done)
            .catch(done);
    });

    it("should respond with definition of laptop", function (done) {
        var url = baseUrl + "/definition";
        var params = {
            word: "laptop"
        };

        request({url: url, qs: params, json: true})
            .then(function (response) {
                expect(response.definition).to.equal("a portable computer small enough to use in your lap");
            })
            .then(done)
            .catch(done);
    });

    it("should respond with definition of pluralizr", function (done) {
        var url = baseUrl + "/definition";
        var params = {
            word: "pluralizr"
        };

        request({url: url, qs: params, json: true})
            .then(function (response) {
                expect(response).to.deep.equal({});
            })
            .then(done)
            .catch(done);

    });

});

function startServer(done) {
    var app = require("../../server");
    app.start()
        .then(done)
        .catch(done);
}

function stopServer(done) {
    var app = require("../../server");
    app.stop()
        .then(done)
        .catch(done);
}
