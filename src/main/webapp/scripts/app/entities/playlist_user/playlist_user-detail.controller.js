'use strict';

angular.module('soundxtreamappApp')
    .controller('Playlist_userDetailController', function ($scope, $rootScope, $stateParams, entity, Playlist_user, User, Playlist) {
        $scope.playlist_user = entity;
        $scope.load = function (id) {
            Playlist_user.get({id: id}, function(result) {
                $scope.playlist_user = result;
            });
        };
        var unsubscribe = $rootScope.$on('soundxtreamappApp:playlist_userUpdate', function(event, result) {
            $scope.playlist_user = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
