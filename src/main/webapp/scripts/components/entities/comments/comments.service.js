'use strict';

angular.module('soundxtreamappApp')
    .factory('Comments', function ($resource, DateUtils) {
        return $resource('api/commentss/:id', {}, {
            'query': { method: 'GET', isArray: true},
            'get': {
                method: 'GET',
                transformResponse: function (data) {
                    data = angular.fromJson(data);
                    data.date_comment = DateUtils.convertDateTimeFromServer(data.date_comment);
                    return data;
                }
            },
            'update': { method:'PUT' }
        });
    });
