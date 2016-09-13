'use strict';

angular.module('soundxtreamappApp')
    .factory('Register', function ($resource) {
        return $resource('api/register', {}, {
        });
    });


