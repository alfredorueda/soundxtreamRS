'use strict';

angular.module('soundxtreamappApp').controller('SeguimientoDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'Seguimiento', 'User',
        function($scope, $stateParams, $uibModalInstance, entity, Seguimiento, User) {

        $scope.seguimiento = entity;
        $scope.users = User.query();
        $scope.load = function(id) {
            Seguimiento.get({id : id}, function(result) {
                $scope.seguimiento = result;
            });
        };

        var onSaveSuccess = function (result) {
            $scope.$emit('soundxtreamappApp:seguimientoUpdate', result);
            $uibModalInstance.close(result);
            $scope.isSaving = false;
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.seguimiento.id != null) {
                Seguimiento.update($scope.seguimiento, onSaveSuccess, onSaveError);
            } else {
                Seguimiento.save($scope.seguimiento, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };
        $scope.datePickerForFecha = {};

        $scope.datePickerForFecha.status = {
            opened: false
        };

        $scope.datePickerForFechaOpen = function($event) {
            $scope.datePickerForFecha.status.opened = true;
        };
}]);
