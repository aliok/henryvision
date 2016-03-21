(function () {
  'use strict';

  angular
    .module('app')
    .service('TTSService', TTSService);

  TTSService.$inject = ['$log'];

  function TTSService($log) {
    return {
      speak: function (text) {
        $log.debug("TTS:", text);

        if (!window.speechSynthesis) {
          return;
        }

        if (!text) {
          return;
        }

        var u = new window.SpeechSynthesisUtterance();
        u.text = text;

        // when following is set, a bad TTS voice is used.
        // u.lang = "en";

        u.volume = "1.0";
        u.rate = 0.1; // 0.1 to 10
        u.pitch = 1; //0 to 2

        window.speechSynthesis.speak(u);
      }
    };
  }

})();
