'use strict';

angular.module('soundxtreamappApp')
    .factory('PlaylistSearch', function ($resource) {
        return $resource('api/_search/playlists/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
