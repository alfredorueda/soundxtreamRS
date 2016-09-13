'use strict';

angular.module('soundxtreamappApp')
    .factory('CommentsSearch', function ($resource) {
        return $resource('api/_search/commentss/:query', {}, {
            'query': { method: 'GET', isArray: true}
        });
    });
