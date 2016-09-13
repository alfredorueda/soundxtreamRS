'use strict';

angular.module('soundxtreamappApp')
	.controller('StyleDeleteController', function($scope, $uibModalInstance, entity, Style) {

        $scope.style = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Style.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
