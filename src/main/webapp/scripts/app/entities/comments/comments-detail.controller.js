'use strict';

angular.module('soundxtreamappApp')
    .controller('CommentsDetailController', function ($scope, $rootScope, $stateParams, entity, Comments, Song, User) {
        $scope.comments = entity;
        $scope.load = function (id) {
            Comments.get({id: id}, function(result) {
                $scope.comments = result;
            });
        };
        var unsubscribe = $rootScope.$on('soundxtreamappApp:commentsUpdate', function(event, result) {
            $scope.comments = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
