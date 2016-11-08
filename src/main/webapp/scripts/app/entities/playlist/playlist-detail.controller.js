'use strict';

angular.module('soundxtreamappApp')
    .controller('PlaylistDetailController', function (ParseLinks, $scope, $timeout,$rootScope, $stateParams, Seguimiento, entity,
                                                      Playlist, Song, User,Principal, Playlist_user, toaster) {
        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });
        $scope.playlistDTO = entity;
        var unshuffledTracks = [];
        $scope.playlistsUser = [];

        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;
        var images = [];
        var imagePlaylist = "";
        $scope.readyUserPlaylists = false;

        $scope.playlistDTO.$promise.then(function(){
            Playlist.getPlaylistUser({login:$scope.playlistDTO.playlist.user.login, page: $scope.page, size: 4, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    if(result[i].playlist.id != $scope.playlistDTO.playlist.id){
                        $scope.playlistsUser.push(result[i]);
                    }
                }
                $scope.readyUserPlaylists = true;
            });

            User.get({login:$scope.playlistDTO.playlist.user.login},function(res){
                $scope.playlistDTO.playlist.user.totalFollowers = res.totalFollowers;
                $scope.playlistDTO.playlist.user.totalFollowings = res.totalFollowings;
                $scope.playlistDTO.playlist.user.followedByUser = res.followedByUser;
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
            if($scope.playlistDTO.playlist.user.followedByUser) {
                $scope.seguimiento.siguiendo = false;
            }
            else{
                $scope.seguimiento.siguiendo = true;
            }
            $scope.seguimiento.seguido = user;
            Seguimiento.save($scope.seguimiento,function(res){
                if(res.siguiendo == true){
                    $scope.playlistDTO.playlist.user.followedByUser = true;
                    $scope.playlistDTO.playlist.user.totalFollowers += 1;
                }
                else{
                    $scope.playlistDTO.playlist.user.followedByUser = false;
                    $scope.playlistDTO.playlist.user.totalFollowers -= 1;
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

        $scope.removeTrack = function (index){
            $scope.playlistDTO.playlist.songs.splice(index, 1);
            Playlist.update($scope.playlistDTO.playlist,function(res){
                $scope.playlistDTO.playlist.full_duration = res.full_duration;
                $scope.playlistDTO.playlist.artwork = res.artwork;
            });
        }

        $scope.like = function(id){
            Playlist_user.addLike({id: id},{}, successLike);
        };

        var successLike = function(result){
            $scope.playlistDTO.liked = result.liked;
            if($scope.playlistDTO.liked){
                $scope.playlistDTO.totalLikes += 1;
            }
            else{
                $scope.playlistDTO.totalLikes -= 1;
            }
            if(result.liked == true){
                toaster.pop('success',"Success","Playlist added to your favorites");
            }
            else{
                toaster.pop('success',"Success","Playlist removed from your favorites");
            }
        };

        $scope.share = function(id){
            Playlist_user.addShare({id: id},{}, successShare);
        };

        function successShare(result) {
            $scope.playlistDTO.shared = result.shared;
            if($scope.playlistDTO.shared){
                $scope.playlistDTO.totalShares += 1;
            }
            else{
                $scope.playlistDTO.totalShares -= 1;
            }
            if(result.shared == true){
                toaster.pop('success',"Success","Playlist shared to your followers");
            }
            else{
                toaster.pop('success',"Success","Playlist removed from your favorites");
            }
        }
    });
