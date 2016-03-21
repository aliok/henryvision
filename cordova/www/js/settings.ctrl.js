(function () {
  "use strict";

  angular.module('app').controller('SettingsCtrl', SettingsController);

  SettingsController.$inject = ['SettingsService', '$log'];

  function SettingsController(settingsService, $log) {
    var vm = this;

    vm.ttsEnabled = settingsService.isTTSEnabled();

    vm.ttsChanged = ttsChanged;


    function ttsChanged() {
      $log.info("ttsChanged to ", vm.ttsEnabled);
      settingsService.setTTSEnabled(vm.ttsEnabled);
    }

  }

})();
