'use strict';

angular.module('soundxtreamappApp')
    .controller('SeguimientoDetailController', function ($scope, $rootScope, $stateParams, entity, Seguimiento, User) {
        $scope.seguimiento = entity;
        $scope.load = function (id) {
            Seguimiento.get({id: id}, function(result) {
                $scope.seguimiento = result;
            });
        };
        var unsubscribe = $rootScope.$on('soundxtreamappApp:seguimientoUpdate', function(event, result) {
            $scope.seguimiento = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
