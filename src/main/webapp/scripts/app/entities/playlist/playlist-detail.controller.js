'use strict';

angular.module('soundxtreamappApp')
    .controller('PlaylistDetailController', function (ParseLinks, $scope, $timeout,$rootScope, $stateParams, Seguimiento, entity, Playlist, Song, User,Principal) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });
        $scope.playlist = entity;
        var unshuffledTracks = [];
        $scope.playlistsUser = [];

        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;

        $scope.playlist.$promise.then(function(){
            Playlist.getPlaylistUser({login:$scope.playlist.user.login, page: $scope.page, size: 4, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.playlistsUser.push(result[i]);
                }
            });

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

        $scope.shuffleState = "off";

        $scope.shuffleSongsPlaylist = function(){
            $scope.shuffleState = "on";
            unshuffledTracks = angular.copy($scope.playlist.songs);
            $scope.playlist.songs = shuffleArray($scope.playlist.songs.slice(0));
        }
        $scope.restoreOriginalSongs = function(){
            $scope.shuffleState = "off";
            $scope.playlist.songs = [];
            $scope.playlist.songs = unshuffledTracks;
        }

        var shuffleArray = function(array) {
            var m = array.length, t, i;
            // While there remain elements to shuffle
            while (m) {
                // Pick a remaining element…
                i = Math.floor(Math.random() * m--);

                // And swap it with the current element.
                t = array[m];
                array[m] = array[i];
                array[i] = t;
            }

            return array;
        }
    });
