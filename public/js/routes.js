;(function() {
'use strict'

angular.module('fpm-website')
    .config(config);

function config($routeProvider, $locationProvider) {
    $routeProvider

        .when('/', {
            templateUrl: 'views/about.html',
        })

        .when('/submit_job', {
            templateUrl: 'views/submit_job.html',
            controller: 'FormCtrl',
            controllerAs: 'controller'
        })

        .when('/submit_job', {
            templateUrl: 'views/submit_job.html',
            controller: 'FormCtrl',
            controllerAs: 'controller'
        })

        .when('/success', {
            templateUrl: 'views/success.html',
        })

        .when('/failure', {
            templateUrl: 'views/failure.html',
            controller: 'FailureCtrl',
            controllerAs: 'controller'
        })

        $locationProvider.html5Mode(true);

}
})()