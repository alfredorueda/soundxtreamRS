'use strict';

angular.module('soundxtreamappApp')
	.controller('SeguimientoDeleteController', function($scope, $uibModalInstance, entity, Seguimiento) {

        $scope.seguimiento = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Seguimiento.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
