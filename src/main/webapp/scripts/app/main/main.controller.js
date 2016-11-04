'use strict';

angular.module('soundxtreamappApp')
    .controller('MainController', function (ParseLinks,$timeout, $state,$http, tracksApp,$scope,Song_user,$rootScope,Principal,Song,Playlist,Style) {

       // $scope.tracks = [];
        $scope.tracks = tracksApp;
        $scope.playlists = [];

        $http({
            method: 'GET',
            url: 'api/playlistsApp'
        }).then(function successCallback(response) {
            $scope.playlists = response.data;
        });

        tracksApp.$promise.then(function(){

        });

        $scope.styles = [];

        $scope.like = function(id){
            Song_user.addLike({id: id},{},successLike);
        };

        $scope.share = function(id){
            Song_user.share({id: id},{},successShare);
        };

        function successShare(result) {
            console.log(result);

            for(var k = 0; k < $scope.tracks.length; k++){
                if($scope.tracks[k].song.id == result.song.id){
                    $scope.tracks[k].shared = result.shared;
                    if($scope.tracks[k].shared){
                        $scope.tracks[k].totalShares += 1;
                    }
                    else{
                        $scope.tracks[k].totalShares -= 1;
                    }
                }
            }
            if(result.shared == true){
                toaster.pop('success',"Success","Song shared to your followers");
            }
        }

        var successLike = function(result){
            console.log(result);
            //$scope.songDTO.liked = result.liked;
            for(var k = 0; k < $scope.tracks.length; k++){
                if($scope.tracks[k].song.id == result.song.id){
                    $scope.tracks[k].liked = result.liked;
                    if($scope.tracks[k].liked){
                        $scope.tracks[k].totalLikes += 1;
                    }
                    else{
                        $scope.tracks[k].totalLikes -= 1;
                    }
                }
            }
            if(result.liked == true){
                toaster.pop('success',"Success","Song added to your favorites");
            }

        };

    });
