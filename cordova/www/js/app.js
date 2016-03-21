(function () {
  "use strict";

  angular.module('app', ['ionic', 'LocalStorageModule'])
    .run(run);

  run.$inject = ['$ionicPlatform', '$log'];
  function run($ionicPlatform, $log) {
    $ionicPlatform.ready(function () {
      $log.debug("Device ready...");

      if (window.device) {
        $log.info("Cordova version: " + window.device.cordova);
        $log.info("Device: " + window.device.model + " " + window.device.model.version);
        $log.info("Platform: " + window.device.platform);
        $log.info("window.device: " + JSON.stringify(window.device), window.device);
      }

      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  }

})();
