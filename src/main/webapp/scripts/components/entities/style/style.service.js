'use strict';

angular.module('soundxtreamappApp')
    .factory('Style', function ($resource, DateUtils) {
        return $resource('api/styles/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
