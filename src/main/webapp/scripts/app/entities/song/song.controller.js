'use strict';

angular.module('soundxtreamappApp')
    .controller('SongController', function ($scope,$state, Song, SongSearch, ParseLinks,toaster,Song_user,$sce) {

        $scope.isCollapsed = true;
        $scope.songs = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;
        $scope.loadAll = function() {
            Song.query({page: $scope.page, size: 6, sort: [$scope.predicate ,($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.songs.push(result[i]);
                }
                console.log($scope.songs);
                console.log("NUM LINKS" + $scope.links);
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


        /*$scope.saveSong = function(song){
            Song.update(song,function(){
                toaster.pop('success',$scope.songDTO.song.name,"Your comment was posted");
            });
        };*/

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

        $scope.request = function(duration){
            if(duration == 'less'){
                Song.getSongsWithLess({seconds:300},function(res){
                    $scope.songs = res;
                });
            }
            else if(duration == 'more'){
                Song.getSongsWithMore({seconds:300},function(res){
                    $scope.songs = res;
                });
            }
            else if(duration == 'none'){
                $scope.songs = [];
                Song.query({page: $scope.page, size: 20, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                    $scope.links = ParseLinks.parse(headers('link'));
                    for (var i = 0; i < result.length; i++) {
                        $scope.songs.push(result[i]);
                    }
                });
            }

        };
    });
