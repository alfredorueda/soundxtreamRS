'use strict';

angular.module('soundxtreamappApp')
    .factory('StyleSearch', function ($resource) {
        return $resource('api/_search/styles/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
