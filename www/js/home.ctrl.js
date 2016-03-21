(function () {
  "use strict";

  angular.module('app').controller('HomeCtrl', HomeController);

  HomeController.$inject = ['CameraService', 'CloudService', 'SettingsService', 'TTSService', '$log'];

  function HomeController(cameraService, cloudService, settingsService,ttsService, $log) {
    var vm = this;

    vm.images = [];

    vm.takePhoto = function () {

      var image = {
        date: new Date(),
        src: undefined,
        text: undefined,
        inProgress: true,
        error: undefined
      };

      cameraService.getPicture()
        .then(function (imageData) {
          image.src = "data:image/png;base64," + imageData;

          // add to beginning of the array
          vm.images.unshift(image);

          return imageData;
        })
        .then(cloudService.getTextForImage)
        .then(function (response) {
          image.text = response ? response.text : undefined;
          image.status = undefined;
          image.inProgress = false;
          return image.text;
        })
        .then(function(text){
          if(settingsService.isTTSEnabled()){
            ttsService.speak(text);
          }
        })
        .catch(function (err) {
          $log.error(err);
          if (err.message) {
            image.error = err.message;
          }
          else {
            image.error = "An error occurred.";
          }
          image.inProgress = false;
        });
    };

  }

})();
