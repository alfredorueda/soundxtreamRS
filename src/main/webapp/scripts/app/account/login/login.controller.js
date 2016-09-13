'use strict';

angular.module('soundxtreamappApp')
    .controller('LoginController', function ($rootScope, $scope, $state, $timeout, Auth,Principal) {
        $scope.user = {};
        $scope.errors = {};

        $scope.rememberMe = true;
        $timeout(function (){angular.element('[ng-model="username"]').focus();});
        $scope.login = function (event) {
            event.preventDefault();
            Auth.login({
                username: $scope.username,
                password: $scope.password,
                rememberMe: $scope.rememberMe
            }).then(function () {
                $scope.authenticationError = false;
                if ($rootScope.previousStateName === 'register') {
                    $state.go('home');
                } else {
                    if($rootScope.previousStateName === 'login'){
                        $state.go('home');
                    }else{
                        $rootScope.back();
                    }
                }
                Principal.identity().then(function(account) {
                    $rootScope.account = account;
                    $scope.isAuthenticated = Principal.isAuthenticated;
                });
            }).catch(function () {
                $scope.authenticationError = true;
            });
        };
    });
