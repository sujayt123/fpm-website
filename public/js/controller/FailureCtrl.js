;
(function () {
    'use strict'

    angular.module('fpm-website')
        .controller('FailureCtrl', FailureCtrl);

FailureCtrl.$inject = ['sharedProperties', '$scope', '$sce'];

function FailureCtrl(sharedProperties, $scope, $sce){
    $scope.errorMessage = $sce.trustAsHtml(sharedProperties.getErrorMsg());
}
})();