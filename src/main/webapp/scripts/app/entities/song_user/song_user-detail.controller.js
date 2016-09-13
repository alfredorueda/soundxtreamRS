'use strict';

angular.module('soundxtreamappApp')
    .controller('Song_userDetailController', function ($scope, $rootScope, $stateParams, entity, Song_user, User, Song) {
        $scope.song_user = entity;
        $scope.load = function (id) {
            Song_user.get({id: id}, function(result) {
                $scope.song_user = result;
            });
        };
        var unsubscribe = $rootScope.$on('soundxtreamappApp:song_userUpdate', function(event, result) {
            $scope.song_user = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
