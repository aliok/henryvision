(function () {
  "use strict";

  angular.module('app')
    .factory('SettingsService', SettingsService);

  var TTS_ENABLED_KEY = "TTS_ENABLED";

  SettingsService.$inject = ['localStorageService'];

  function SettingsService(localStorageService) {
    return {
      setTTSEnabled: function (ttsEnabled) {
        localStorageService.set(TTS_ENABLED_KEY, ttsEnabled);
      },

      isTTSEnabled: function () {
        return localStorageService.get(TTS_ENABLED_KEY);
      }
    };

  }
})();
