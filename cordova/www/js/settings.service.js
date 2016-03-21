(function () {
  "use strict";

  angular.module('app')
    .factory('SettingsService', SettingsService);

  var TTS_ENABLED_KEY = "TTS_ENABLED";

  SettingsService.$inject = ['localStorageService'];

  function SettingsService(localStorageService) {
    var service = {
      setTTSEnabled: function (ttsEnabled) {
        localStorageService.set(TTS_ENABLED_KEY, ttsEnabled);
      },

      isTTSEnabled: function () {
        var isEnabled = localStorageService.get(TTS_ENABLED_KEY);

        // this library returns null, not undefined!
        if (isEnabled === null) {
          service.setTTSEnabled(true);
          return true;
        }
        else {
          return isEnabled;
        }
      }
    };

    return service;
  }
})();
