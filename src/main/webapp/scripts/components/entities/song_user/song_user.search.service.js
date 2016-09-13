'use strict';

angular.module('soundxtreamappApp')
    .factory('Song_userSearch', function ($resource) {
        return $resource('api/_search/song_users/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
