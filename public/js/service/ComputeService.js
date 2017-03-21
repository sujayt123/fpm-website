;
(function() {
'use strict'

    angular.module('fpm-website')
        .factory('ComputeService', computeService)

    function computeService($resource, $http) {
        $http.defaults.withCredentials = true

        return $resource('/:endpoint', { },
            {
                uploadJob : { method:'post', params: {endpoint: 'upload'} },
            })
        }

})();

