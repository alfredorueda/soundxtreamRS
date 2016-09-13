'use strict';

angular.module('soundxtreamappApp')
    .controller('playlistsSongController', function ($scope, $state, Playlist, PlaylistSearch, ParseLinks,entity) {

        $scope.playlists = entity;

        $scope.search = function () {
            PlaylistSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.playlists = result;
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
            $scope.playlist = {
                name: null,
                artwork: null,
                dateCreated: null,
                full_duration: null,
                id: null
            };
        };
    });
