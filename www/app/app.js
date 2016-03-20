'use strict';

var myApp = angular.module('myApp', ['ionic', 'ngRoute',
    'ngSanitize',
    'myApp.controllers',
    'myApp.directives',
    'myApp.services',
    'myApp.filters',
    'fhcloud'
]);

myApp.config(function($routeProvider) {

    $routeProvider
        .when('/', {
            templateUrl: 'views/example.html',
            controller: 'MainCtrl'
        })
});