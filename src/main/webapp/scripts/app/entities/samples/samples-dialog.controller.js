'use strict';

angular.module('soundxtreamappApp').controller('SamplesDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Samples', 'User',
        function($scope, $stateParams, $uibModalInstance, entity, Samples, User) {

        $scope.samples = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            Samples.get({id : id}, function(result) {
                $scope.samples = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:samplesUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.samples.id != null) {
                Samples.update($scope.samples, onSaveSuccess, onSaveError);
            } else {
                Samples.save($scope.samples, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
}]);
