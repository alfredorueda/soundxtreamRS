'use strict';

angular.module('soundxtreamappApp')
	.controller('SongDeleteController', function($scope, $uibModalInstance, entity, Song) {

        $scope.songDTO = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            console.log(id);
            Song.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
