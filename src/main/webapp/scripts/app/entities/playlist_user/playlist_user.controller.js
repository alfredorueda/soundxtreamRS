'use strict';

angular.module('soundxtreamappApp')
    .controller('Playlist_userController', function ($scope, $state, Playlist_user, Playlist_userSearch, ParseLinks) {

        $scope.playlist_users = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;
        $scope.loadAll = function() {
            Playlist_user.query({page: $scope.page, size: 20, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.playlist_users.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 0;
            $scope.playlist_users = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();


        $scope.search = function () {
            Playlist_userSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.playlist_users = result;
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
            $scope.playlist_user = {
                liked: null,
                shared: null,
                likedDate: null,
                sharedDate: null,
                id: null
            };
        };

        $scope.unlike = function(id){
            Playlist_user.addLike({id: id},{},successUnlike);
        };
        
        function successUnlike(result) {
            for(var k = 0; k < $scope.playlist_users.length; k++){
                if($scope.playlist_users[k].playlist.id == result.playlist.id){
                    $scope.playlist_users.splice(k,1);
                }
            }
        }
    });
