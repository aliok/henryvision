"use strict";
var winston = require("winston");

winston.level = process.env.LOG_LEVEL || "info";

console.log("Application log level is " + winston.level);

var app = require("./application");
app.start();
