;
(function () {
    'use strict'

    angular.module('fpm-website')
        .controller('FormCtrl', FormCtrl);

FormCtrl.$inject = ['ComputeService', 'Upload', 'sharedProperties', '$httpParamSerializer', '$scope', '$location'];

function FormCtrl(ComputeService, Upload, sharedProperties, $httpParamSerializer, $scope, $location) {
    this.submitForm = function(zippedImgs, configIni) {
        zippedImgs.upload =  Upload.upload({
                                url: '/upload',
                                data: {zippedImgs: zippedImgs, configIni: configIni, email: $scope.email}
                            });

        zippedImgs.upload.then(function (response) {
          $timeout(function () {
            zippedImgs.result = response.data;
          });
        }, function (response) {
          if (response.status > 0)
            sharedProperties.setErrorMsg(response.status + ': ' + response.data);
            $location.path('/failure');
        }, function (evt) {
          // Math.min is to fix IE which reports 200% sometimes
          zippedImgs.progress = Math.min(100, parseInt(100.0 * evt.loaded / evt.total));
          if (zippedImgs.progress == 100)
          {
            $location.path('/success')
          }
        });
    }
}
})();