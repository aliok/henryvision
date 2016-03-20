'use strict';

var myApp = angular.module('myApp.controllers', ['fhcloud']);

myApp.controller('MainCtrl', function($scope, $q, fhcloud) {
  // add function to pass userInput to cloud via
  // $fh.cloud call to controller scope
  $scope.sayHello = function() {
    var userInput = $scope.userInput;

    //Notifying the user that the cloud endpoint is being called.
    $scope.noticeMessage = "Calling Cloud Endpoint";
    $scope.textClassName = "ion-loading-c";

    // check if userInput is defined
    if (userInput) {
      /**
       * Pass the userInput to the service containing the $fh.cloud call.
       *
       * Notice that the defer.resolve and defer.reject functions are passed to the module.
       * One of these functions will be called when the $fh.cloud function has completed successully or encountered
       * an error.
       */
      fhcloud('hello', { hello: userInput })
        .then(function(response){
          // If successful, display the length  of the string.
          if (response.msg != null && typeof(response.msg) !== 'undefined') {
            $scope.noticeMessage = response.msg;
            $scope.textClassName = "ion-checkmark-round";
          } else {
            $scope.noticeMessage  = "Error: Expected a message from $fh.cloud.";
            $scope.textClassName = "ion-close-round";
          }
        })
        .catch(function(msg, err){
          //If the cloud call fails
          $scope.noticeMessage = "$fh.cloud failed. Error: " + JSON.stringify(err);
          $scope.textClassName = "ion-close-round";
        });
    }
  };
});