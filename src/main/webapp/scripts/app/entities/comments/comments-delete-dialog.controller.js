'use strict';

angular.module('soundxtreamappApp')
	.controller('CommentsDeleteController', function($scope, $uibModalInstance, entity, Comments) {

        $scope.comments = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Comments.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
