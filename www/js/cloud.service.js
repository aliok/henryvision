angular.module('app')
  .factory('CloudService', CloudService);

CloudService.$inject = ['$q', '$log'];

function CloudService($q, $log) {
  return {
    getTextForImage: function (imageData) {
      return $q(function (fulfill, reject) {
        var params = {
          path: "/henryvision",
          method: "POST",
          contentType: "application/json",
          data: {image: imageData},
          timeout: 120000    // 2 minutes since files are big
        };

        $fh.cloud(params, function (data) {
          $log.info("Received data:", data);
          return fulfill(data);
        }, function (err) {
          $log.error(err);
          return reject(err);
        });
      });
    }
  };

}
