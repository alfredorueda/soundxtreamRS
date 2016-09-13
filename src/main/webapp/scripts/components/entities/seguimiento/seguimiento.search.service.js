'use strict';

angular.module('soundxtreamappApp')
    .factory('SeguimientoSearch', function ($resource) {
        return $resource('api/_search/seguimientos/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
