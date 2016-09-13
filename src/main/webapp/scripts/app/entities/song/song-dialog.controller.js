'use strict';

angular.module('soundxtreamappApp').controller('SongDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Song', 'User', 'Style','$modal',
        function($scope, $stateParams, $uibModalInstance, entity, Song, User, Style,$modal) {

        $scope.songDTO = entity;
        $scope.styles = Style.query({});
        $scope.users = User.query();
        $scope.load = function(id) {
            Song.get({id : id}, function(result) {
                $scope.songDTO = result;
            });
        };

        

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:songUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.songDTO.song.id != null) {
                Song.update($scope.songDTO.song, onSaveSuccess, onSaveError);
            } else {
                Song.save($scope.songDTO.song, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.datePickerForDate_posted = {};

        $scope.datePickerForDate_posted.status = {
            opened: false
        };

        $scope.datePickerForDate_postedOpen = function($event) {
            $scope.datePickerForDate_posted.status.opened = true;
        };
}]);
