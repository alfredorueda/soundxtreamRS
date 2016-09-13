'use strict';

angular.module('soundxtreamappApp')
    .controller('SamplesDetailController', function ($scope, $rootScope, $stateParams, entity, Samples, User) {
        $scope.samples = entity;
        $scope.load = function (id) {
            Samples.get({id: id}, function(result) {
                $scope.samples = result;
            });
        };
        var unsubscribe = $rootScope.$on('soundxtreamappApp:samplesUpdate', function(event, result) {
            $scope.samples = result;
        });
        $scope.$on('$destroy', unsubscribe);

    });
