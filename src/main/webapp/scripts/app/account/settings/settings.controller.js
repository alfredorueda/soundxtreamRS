'use strict';

angular.module('soundxtreamappApp')
    .controller('SettingsController', function ($scope,$state, $rootScope, Principal, Auth, Language, $translate, Upload, toaster) {
        $scope.success = null;
        $scope.error = null;
        $scope.cropped = false;
        Principal.identity().then(function(account) {
            $scope.settingsAccount = copyAccount(account);
        });

        $scope.save = function () {
            if($scope.picFile != undefined && $scope.cropped == true){
                var imageBase64 = $scope.croppedArtwork;
                var blob = dataURItoBlob(imageBase64);
                var file = new File([blob],"ds.jpg");

                uploadUsingUploadArtwork(file);
            }
            else if($scope.picFile != undefined && $scope.cropped == false){
                uploadUsingUploadArtwork($scope.picFile);
            }
            else if($scope.picFile == undefined && $scope.cropped == false){
                Auth.updateAccount($scope.settingsAccount).then(function() {
                    $scope.error = null;
                    $scope.success = 'OK';
                    Principal.identity(true).then(function(account) {
                        $scope.settingsAccount = copyAccount(account);
                        $scope.account = account;
                        $rootScope.account = account;
                        toaster.pop('success', "Success", "Account updated");
                    });
                    Language.getCurrent().then(function(current) {
                        if ($scope.settingsAccount.langKey !== current) {
                            $translate.use($scope.settingsAccount.langKey);
                        }
                    });
                    $state.go("settings",null,{reload:true});
                }).catch(function() {
                    $scope.success = null;
                    $scope.error = 'ERROR';
                });
            }
        }

        $scope.$watch('picFile', function(){
            $scope.artworkShow($scope.picFile);
        });

        $scope.artworkShow = function (e) {
            $scope.artworkFile = e;
            var reader = new FileReader();
            reader.onload = function (e) {
                var image;
                image = new Image();
                image.src = e.target.result;
                return image.onload = function () {
                    return $('.image_user').attr("src", this.src);
                };
            };
            return reader.readAsDataURL(e);
        }

        function uploadUsingUploadArtwork(file) {
            var pictureName = "profilepic-"+$scope.settingsAccount.login.toLowerCase()+"-"+$scope.settingsAccount.firstName;
            var ext = file.name.split('.').pop();

            pictureName = pictureName.concat("."+ext);

            console.log(pictureName);

            Upload.upload({
                url: 'api/upload',
                data: {file: file, name: pictureName}
            }).then(function () {
                $scope.settingsAccount.user_image = "uploads/" + pictureName;
                Auth.updateAccount($scope.settingsAccount).then(function() {
                    $scope.error = null;
                    $scope.success = 'OK';
                    Principal.identity(true).then(function(account) {
                        $scope.settingsAccount = copyAccount(account);
                        $scope.account = account;
                        $rootScope.account = account;
                        toaster.pop('success', "Success", "Account updated");
                    });
                    Language.getCurrent().then(function(current) {
                        if ($scope.settingsAccount.langKey !== current) {
                            $translate.use($scope.settingsAccount.langKey);
                        }
                    });
                    $state.go("settings",null,{reload:true});
                }).catch(function() {
                    $scope.success = null;
                    $scope.error = 'ERROR';
                    toaster.pop('error',"Whoops!! Something went wrong","Profile picture not saved");
                });
            }, function (resp) {
                console.log('Error status: ' + resp.status);
            }, function (evt) {
                var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
            });
        }

        function dataURItoBlob(dataURI) {
            var binary = atob(dataURI.split(',')[1]);
            var array = [];
            for(var i = 0; i < binary.length; i++) {
                array.push(binary.charCodeAt(i));
            }
            return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
        }

        $scope.savePicture = function(){
            if($scope.picFile != undefined){
                var imageBase64 = $scope.croppedArtwork;
                var blob = dataURItoBlob(imageBase64);
                var file = new File([blob],"ds.jpg");

                $scope.uploadArt(file);
            }
            else{

            }
        }

        /**
         * Store the "settings account" in a separate variable, and not in the shared "account" variable.
         */
        var copyAccount = function (account) {
            return {
                activated: account.activated,
                email: account.email,
                firstName: account.firstName,
                langKey: account.langKey,
                lastName: account.lastName,
                login: account.login,
                user_image: account.user_image,
                description: account.description
            }
        }
    });
