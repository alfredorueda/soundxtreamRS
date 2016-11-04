'use strict';

angular.module('soundxtreamappApp').controller('Playlist_userDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Playlist_user', 'User', 'Playlist',
        function($scope, $stateParams, $uibModalInstance, entity, Playlist_user, User, Playlist) {

        $scope.playlist_user = entity;
        $scope.users = User.query();
        $scope.playlists = Playlist.query();
        $scope.load = function(id) {
            Playlist_user.get({id : id}, function(result) {
                $scope.playlist_user = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:playlist_userUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.playlist_user.id != null) {
                Playlist_user.update($scope.playlist_user, onSaveSuccess, onSaveError);
            } else {
                Playlist_user.save($scope.playlist_user, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.datePickerForLikedDate = {};

        $scope.datePickerForLikedDate.status = {
            opened: false
        };

        $scope.datePickerForLikedDateOpen = function($event) {
            $scope.datePickerForLikedDate.status.opened = true;
        };
        $scope.datePickerForSharedDate = {};

        $scope.datePickerForSharedDate.status = {
            opened: false
        };

        $scope.datePickerForSharedDateOpen = function($event) {
            $scope.datePickerForSharedDate.status.opened = true;
        };
}]);
