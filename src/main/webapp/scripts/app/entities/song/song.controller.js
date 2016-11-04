'use strict';

angular.module('soundxtreamappApp')
    .controller('SongController', function ($scope,$state, Song, SongSearch, ParseLinks,toaster,Song_user,$log,$filter) {


        $scope.songs = [];
        $scope.predicate = 'id';
        $scope.reverse = false;
        $scope.page = 0;
        $scope.allTracks = [];

        $scope.searchQuery;
        $scope.loadAll = function() {
            Song.query({page: $scope.page, size: 10, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function (result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.songs.push(result[i]);
                }
            });

            Song.queryForPlayer({}, function(result, headers){
                $scope.allTracks = result;
                console.log(result)
            });
        };

        $scope.reset = function() {
            $scope.page = 0;
            $scope.songs = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();


        $scope.search = function () {
            SongSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.songs = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.reset();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.song = {
                name: null,
                url: null,
                label: null,
                date_posted: null,
                artwork: null,
                tags: null,
                duration: null,
                description: null,
                id: null
            };
        };

        $scope.like = function(id){
            Song_user.addLike({id: id},{},successLike);
        };

        $scope.share = function(id){
            Song_user.share({id: id},{},successShare);
        };

        function successShare(result) {
            console.log(result);

            for(var k = 0; k < $scope.songs.length; k++){
                if($scope.songs[k].song.id == result.song.id){
                    $scope.songs[k].shared = result.shared;
                    if($scope.songs[k].shared){
                        $scope.songs[k].totalShares += 1;
                    }
                    else{
                        $scope.songs[k].totalShares -= 1;
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
            for(var k = 0; k < $scope.songs.length; k++){
                if($scope.songs[k].song.id == result.song.id){
                    $scope.songs[k].liked = result.liked;
                    if($scope.songs[k].liked){
                        $scope.songs[k].totalLikes += 1;
                    }
                    else{
                        $scope.songs[k].totalLikes -= 1;
                    }
                }
            }
            if(result.liked == true){
                toaster.pop('success',"Success","Song added to your favorites");
            }

        };
    });
