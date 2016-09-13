'use strict';

angular.module('soundxtreamappApp')
	.controller('SamplesDeleteController', function($scope, $uibModalInstance, entity, Samples) {

        $scope.samples = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Samples.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
