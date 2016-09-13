'use strict';

angular.module('soundxtreamappApp').controller('UserManagementDialogController',
    ['$scope', '$stateParams', '$uibModalInstance', 'entity', 'User', 'Language','Upload',
        function($scope, $stateParams, $uibModalInstance, entity, User, Language,Upload) {

        $scope.user = entity;
        $scope.authorities = ["ROLE_USER", "ROLE_ADMIN"];
        Language.getAll().then(function (languages) {
            $scope.languages = languages;
        });
        var onSaveSuccess = function (result) {
            console.log(result);
            $scope.isSaving = false;
            $uibModalInstance.close(result);
        };

        var onSaveError = function (result) {
            $scope.isSaving = false;
        };

        $scope.save = function () {
            $scope.isSaving = true;
            if ($scope.user.id != null) {
                if($scope.picFile != undefined){
                    var imageBase64 = $scope.croppedArtwork;
                    var blob = dataURItoBlob(imageBase64);
                    var file = new File([blob],"ds.jpg");
                    $scope.uploadArt(file);
                }
                User.update($scope.user, onSaveSuccess, onSaveError);
            } else {
                var imageBase64 = $scope.croppedArtwork;
                var blob = dataURItoBlob(imageBase64);
                var file = new File([blob],"ds.jpg");
                //$scope.uploadArt($scope.artworkFile);
                $scope.uploadArt(file);
                console.log($scope.user);
                User.save($scope.user, onSaveSuccess, onSaveError);
            }
        };

        $scope.clear = function() {
            $uibModalInstance.dismiss('cancel');
        };

            $scope.uploadArt = function (file) {
                $scope.formUpload = true;
                if (file != null) {
                    uploadUsingUploadArtwork(file)
                }
            };

            function uploadUsingUploadArtwork(file) {
                var songArtworkName = file.name.toLowerCase();
                var ext = file.name.split('.').pop();

                function randomString(length, chars) {
                    var result = '';
                    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                    return result;
                }

                var rString = "profile-"+randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "." + ext;
                $scope.user.user_image = "uploads/" + rString;

                Upload.upload({
                    url: 'api/upload',
                    data: {file: file, name: rString}
                }).then(function (resp) {

                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    $scope.user.user_image = "uploads/" + rString;
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });


            };

            function dataURItoBlob(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for(var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
            }
}]);
