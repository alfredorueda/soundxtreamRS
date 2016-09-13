'use strict';

angular.module('soundxtreamappApp')
    .controller('NavbarController', function ($scope,$rootScope, $location, $state, Auth, ENV,Principal) {
        $scope.isAuthenticated = Principal.isAuthenticated;
        $scope.$state = $state;
        $scope.inProduction = ENV === 'prod';
        $scope.navigationState = {
            menu: true,
            playlist: false
        }

        /*$scope.logout = function () {
            Auth.logout();
            $rootScope.account = {};
            $state.go('login');
        };*/

        $scope.SwitchToMenu = function () {
            $scope.navigationState.menu = true;
            $scope.navigationState.playlist = false;
        };

        $scope.SwitchToPlaylist = function () {
            $scope.navigationState.menu = false;
            $scope.navigationState.playlist = true;
        };

    });
