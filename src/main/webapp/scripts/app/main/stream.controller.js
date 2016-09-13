'use strict';

angular.module('soundxtreamappApp')
    .controller('StreamController', function (ParseLinks, $scope,Song,$filter) {

        $scope.tracks = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;

        $scope.loadAll = function() {
            Song.getTracksFollowing({page: $scope.page, size: 100, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.tracks.push(result[i]);
                }
                $scope.tracks = $filter('orderBy')($scope.tracks, '-date');
                console.log($scope.tracks);
            });
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();


    });
