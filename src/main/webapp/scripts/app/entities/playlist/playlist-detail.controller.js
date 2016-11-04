'use strict';

angular.module('soundxtreamappApp')
    .controller('PlaylistDetailController', function (ParseLinks, $scope, $timeout,$rootScope, $stateParams, Seguimiento, entity,
                                                      Playlist, Song, User,Principal, Playlist_user) {
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
        var images = [];
        var imagePlaylist = "";

        $scope.playlist.$promise.then(function(){
            /*if($scope.playlist.songs.length >= 4 && $scope.playlist.banner_playlist == null){
                makeImage($scope.playlist.songs);
            }*/

            Playlist.getPlaylistUser({login:$scope.playlist.user.login, page: $scope.page, size: 4, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.playlistsUser.push(result[i]);
                }
            });

            User.get({login:$scope.playlist.user.login},function(res){
                $scope.playlist.user.totalFollowers = res.totalFollowers;
                $scope.playlist.user.totalFollowings = res.totalFollowings;
                $scope.playlist.user.followedByUser = res.followedByUser;
            });


        });

        function makeImage(songs){
            var lenghtSongs = songs.length;
            if(lenghtSongs > 4){
                lenghtSongs = 4;
            }
            for(var i = 0; i < lenghtSongs; i++) {
                var image = document.createElement("img");
                image.onload = (function (nr) {
                    return function() {
                        images.push(this);
                        drawPlaylistImage();
                    }
                }(i));
                image.src = songs[i].artwork;

                image = "";
            }

            if($scope.playlist.artwork != null){
                var imageList = new Image();
                imageList.onload = (function (nr) {
                    return function() {
                        imagePlaylist = this;
                    }
                }(1));
                imageList.src = $scope.playlist.artwork;
            }


        }

        function drawPlaylistImage(){
            var canvas = document.querySelector( '#image-render' );
            var context = canvas.getContext('2d');
            for(var i = 0; i < images.length; i++){
                var x = 0,
                    y = 0;

                if(i == 1){
                    x = (canvas.width/ 2);
                    y= 0;
                }
                if(i == 2){
                    x = 0;
                    y = (canvas.height / 2 );
                }
                if(i == 3){
                    x = (canvas.width/ 2);
                    y = (canvas.height / 2 );
                }


                if(x == null){
                    x = 0;
                }
                if(y == null){
                    y = 0;
                }

                context.save();
                context.imageSmoothingEnabled = true;
                context.drawImage(images[i], x, y, 140, 140);

                if($scope.playlist.artwork != null){
                    context.drawImage(imagePlaylist, (canvas.width / 4) + 25, (canvas.height / 4) + 25, 100,100);
                }

                context.restore();

            }

        }

        $scope.like = function(id){
            Playlist_user.like({id: id}, successLike, function(error){
            });
        }

        function successLike(result){
        }

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
