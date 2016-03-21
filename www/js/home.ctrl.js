(function () {
  "use strict";

  angular.module('app').controller('HomeCtrl', HomeController);

  HomeController.$inject = ['CameraService', 'CloudService', '$log'];

  function HomeController(CameraService, CloudService, $log) {
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

      CameraService.getPicture()
        .then(function (imageData) {
          image.src = "data:image/png;base64," + imageData;

          // add to beginning of the array
          vm.images.unshift(image);

          return imageData;
        })
        .then(CloudService.getTextForImage)
        .then(function (response) {
          image.text = response ? response.text : undefined;
          image.status = undefined;
          image.inProgress = false;
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
