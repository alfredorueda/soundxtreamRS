/**
 * Created by Javi on 27/03/2016.
 */
'use strict';

angular.module('soundxtreamappApp')
    .controller('UserProfileLikesController', function ($http, $scope, $location, $state, Auth, Principal,userInfo,Song_user,Playlist,ParseLinks) {

        $scope.userLikes = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;

        $scope.loadAll = function(){
            Song_user.getLikesUser({login:$scope.user.login, page: $scope.page, size: 4, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.userLikes.push(result[i]);
                }
            });
        };

        $scope.loadAll();

        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };

    });
