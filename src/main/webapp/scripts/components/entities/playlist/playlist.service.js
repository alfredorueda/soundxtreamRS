'use strict';

angular.module('soundxtreamappApp')
    .factory('Playlist', function ($resource, DateUtils) {
        return $resource('api/playlists/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.dateCreated = DateUtils.convertDateTimeFromServer(data.dateCreated);
                    return data;
                }
            },
            'update': { method:'PUT' },
            'getPlaylistUser':{
                method: 'GET',
                isArray: true,
                url: 'api/playlistUser/:login'
            },
            'getPlaylistUserLogged':{
                method: 'GET',
                isArray: true,
                url: 'api/playlistUserLogged'
            },
            'addTrackPlaylist':{
                method: 'PUT',
                url: 'api/addTrackPlaylist/:id_track/to/:id_playlist',
                params:{
                    id_track:'@id_track',
                    id_playlist: '@id_playlist'
                }
            }
        });
    });
