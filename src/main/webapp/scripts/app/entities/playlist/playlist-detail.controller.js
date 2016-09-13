'use strict';

angular.module('soundxtreamappApp')
    .controller('PlaylistDetailController', function ($scope, $timeout,$rootScope, $stateParams, Seguimiento, entity, Playlist, Song, User,Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });
        $scope.playlist = entity;

        $scope.playlist.$promise.then(function(){
            User.get({login:$scope.playlist.user.login},function(res){
                console.log(res);
                $scope.playlist.user.totalFollowers = res.totalFollowers;
                $scope.playlist.user.totalFollowings = res.totalFollowings;
                $scope.playlist.user.followedByUser = res.followedByUser;
            });
        });

        $scope.follow = function(user){
            $scope.seguimiento = {
                id: null,
                seguidor: null,
                siguiendo: false,
                seguido: null,
                fecha: null
            };
            if($scope.playlist.user.followedByUser) {
                $scope.seguimiento.siguiendo = false;
            }
            else{
                $scope.seguimiento.siguiendo = true;
            }
            $scope.seguimiento.seguido = user;
            Seguimiento.save($scope.seguimiento,function(res){
                if(res.siguiendo == true){
                    $scope.playlist.user.followedByUser = true;
                    $scope.playlist.user.totalFollowers += 1;
                }
                else{
                    $scope.playlist.user.followedByUser = false;
                    $scope.playlist.user.totalFollowers -= 1;
                }
            });
        };

        $scope.load = function (id) {
            Playlist.get({id: id}, function(result) {
                $scope.playlist = result;
            });
        };

        var unsubscribe = $rootScope.$on('soundxtreamappApp:playlistUpdate', function(event, result) {
            $scope.playlist = result;
        });
        $scope.$on('$destroy', unsubscribe);
    });
