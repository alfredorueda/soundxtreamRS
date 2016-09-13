'use strict';

angular.module('soundxtreamappApp')
    .factory('SamplesSearch', function ($resource) {
        return $resource('api/_search/sampless/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
