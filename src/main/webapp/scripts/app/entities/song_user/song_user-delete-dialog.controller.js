'use strict';

angular.module('soundxtreamappApp')
	.controller('Song_userDeleteController', function($scope, $uibModalInstance, entity, Song_user) {

        $scope.song_user = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Song_user.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
