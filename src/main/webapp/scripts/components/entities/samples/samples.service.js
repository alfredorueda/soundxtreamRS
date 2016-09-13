'use strict';

angular.module('soundxtreamappApp')
    .factory('Samples', function ($resource, DateUtils) {
        return $resource('api/sampless/:id', {}, {
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
