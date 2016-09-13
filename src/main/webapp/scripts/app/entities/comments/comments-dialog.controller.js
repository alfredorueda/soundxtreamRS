'use strict';

angular.module('soundxtreamappApp').controller('CommentsDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Comments', 'Song', 'User',
        function($scope, $stateParams, $uibModalInstance, entity, Comments, Song, User) {

        $scope.comments = entity;
        $scope.songs = Song.query();
        $scope.users = User.query();
        $scope.load = function(id) {
            Comments.get({id : id}, function(result) {
                $scope.comments = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:commentsUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.comments.id != null) {
                Comments.update($scope.comments, onSaveSuccess, onSaveError);
            } else {
                Comments.save($scope.comments, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.datePickerForDate_comment = {};

        $scope.datePickerForDate_comment.status = {
            opened: false
        };

        $scope.datePickerForDate_commentOpen = function($event) {
            $scope.datePickerForDate_comment.status.opened = true;
        };
}]);
