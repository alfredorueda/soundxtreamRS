'use strict';

angular.module('soundxtreamappApp')
    .factory('Playlist_userSearch', function ($resource) {
        return $resource('api/_search/playlist_users/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
