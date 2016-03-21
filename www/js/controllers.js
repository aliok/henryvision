angular.module('app.controllers', ['app.services'])

  .controller('HenryVisionCtrl', ['$scope', '$q', 'Camera', 'HenryVision', function ($scope, $q, Camera, HenryVision) {
    var vm = this;

    vm.images = [];

    vm.takePhoto = function () {

      var image = {
        date: new Date(),
        src: undefined,
        text: undefined,
        inProgress: "true",
        error: undefined
      };

      Camera.getPicture()
        .then(function (imageData) {
          image.src = "data:image/png;base64," + imageData;

          // add to beginning of the array
          vm.images.unshift(image);

          return imageData;
        })
        .then(HenryVision.getTextForImage)
        .then(function (response) {
          console.log(response);
          image.text = response ? response.text : undefined;
          image.status = undefined;
          image.inProgress = false;
        })
        .catch(function (err) {
          console.error(err);
          if (err.message) {
            image.error = err.message;
          }
          else {
            image.error = "An error occurred.";
          }
          image.inProgress = false;
        });
    };

  }])

  .controller('settingsCtrl', ['$scope'], function ($scope) {

  });
