'use strict';

angular.module('soundxtreamappApp')
    .controller('PlaylistController', function ($rootScope, $scope, $state, Playlist,PlaylistSearch, Seguimiento, ParseLinks, Principal) {

        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $rootScope.playlists = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;
        $scope.loadAll = function() {
            Playlist.getPlaylistUser({login: $scope.account.login, page: $scope.page, size: 6, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.playlists.push(result[i]);
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 0;
            $scope.playlists = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();


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
