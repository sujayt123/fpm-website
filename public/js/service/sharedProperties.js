angular.module('fpm-website')
    .service('sharedProperties', function () {
        var errorMsg = '';

        return {
            getErrorMsg: function () {
                return errorMsg;
            },
            setErrorMsg: function(value) {
                errorMsg = value;
            }
        };
    });