'use strict';

angular.module('soundxtreamappApp')
	.controller('Playlist_userDeleteController', function($scope, $uibModalInstance, entity, Playlist_user) {

        $scope.playlist_user = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Playlist_user.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
