'use strict';

angular.module('soundxtreamappApp')
    .factory('Song_user', function ($resource, DateUtils) {
        return $resource('api/song_users/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.likedDate = DateUtils.convertDateTimeFromServer(data.likedDate);
                    data.sharedDate = DateUtils.convertDateTimeFromServer(data.sharedDate);
                    return data;
                }
            },
            'update': { method:'PUT' },
            'addLike': { method: 'POST', isArray: false, url: 'api/song_users/:id/like'},
            'getLikesUser': { method: 'GET', isArray: true, url: 'api/likesUser/:login'},
            'share': { method: 'POST', isArray: false, url: 'api/song_users/:id/share'}
        });
    });
