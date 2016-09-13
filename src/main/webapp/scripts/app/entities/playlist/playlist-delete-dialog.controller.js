'use strict';

angular.module('soundxtreamappApp')
	.controller('PlaylistDeleteController', function($scope, $uibModalInstance, entity, Playlist) {

        $scope.playlist = entity;
        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.confirmDelete = function (id) {
            Playlist.delete({id: id},
                function () {
                    $uibModalInstance.close(true);
                });
        };

    });
