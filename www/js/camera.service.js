angular.module('app')
  .factory('CameraService', CameraService);


CameraService.$inject = ['$q', '$http', '$log'];

function CameraService($q, $http, $log) {
  return {
    getPicture: function () {

      // use the sample image if we're not in Cordova
      if (!window.cordova) {
        $log.info("Returning sample image");
        return $http({
          method: 'GET',
          url: 'img/faulkner.txt'
        })
          .then(function (response) {
            return $q.resolve(response.data);
          })
          .catch(function (err) {
            return $q.reject(err);
          });
      }

      return $q(function (fulfill, reject) {
        if (navigator && navigator.camera && navigator.camera.getPicture) {
          $log.info("Starting camera");

          var cameraOptions = {
            quality: 75,
            destinationType: Camera.DestinationType.DATA_URL,
            targetWidth: 1024,
            targetHeight: 1024,
            correctOrientation: true,
            saveToPhotoAlbum: false
          };

          navigator.camera.getPicture(function (result) {
            fulfill(result);
          }, function (err) {
            reject(err);
          }, cameraOptions);
        }
        else {
          reject(new Error("Camera not found"));
        }
      });
    }
  };

}


