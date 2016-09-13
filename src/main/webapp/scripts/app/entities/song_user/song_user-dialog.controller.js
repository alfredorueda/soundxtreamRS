'use strict';

angular.module('soundxtreamappApp').controller('Song_userDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Song_user', 'User', 'Song',
        function($scope, $stateParams, $uibModalInstance, entity, Song_user, User, Song) {

        $scope.song_user = entity;
        $scope.users = User.query();
        $scope.songs = Song.query();
        $scope.load = function(id) {
            Song_user.get({id : id}, function(result) {
                $scope.song_user = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:song_userUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.song_user.id != null) {
                Song_user.update($scope.song_user, onSaveSuccess, onSaveError);
            } else {
                Song_user.save($scope.song_user, onSaveSuccess, onSaveError);
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
