'use strict';

angular.module('soundxtreamappApp').controller('StyleDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Style', 'Song',
        function($scope, $stateParams, $uibModalInstance, entity, Style, Song) {

        $scope.style = entity;
        $scope.songs = Song.query();
        $scope.load = function(id) {
            Style.get({id : id}, function(result) {
                $scope.style = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:styleUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.style.id != null) {
                Style.update($scope.style, onSaveSuccess, onSaveError);
            } else {
                Style.save($scope.style, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
