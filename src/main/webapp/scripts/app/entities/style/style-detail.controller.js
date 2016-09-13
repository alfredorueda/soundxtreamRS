'use strict';

angular.module('soundxtreamappApp')
    .controller('StyleDetailController', function ($scope, $rootScope, $stateParams, entity, Style, Song) {
        $scope.style = entity;
        $scope.load = function (id) {
            Style.get({id: id}, function(result) {
                $scope.style = result;
            });
        };
        var unsubscribe = $rootScope.$on('soundxtreamappApp:styleUpdate', function(event, result) {
            $scope.style = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
