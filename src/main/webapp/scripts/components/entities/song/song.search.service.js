'use strict';

angular.module('soundxtreamappApp')
    .factory('SongSearch', function ($resource) {
        return $resource('api/_search/songs/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
