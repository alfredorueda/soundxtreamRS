'use strict';

angular.module('soundxtreamappApp').controller('PlaylistDialogController',
    ['$rootScope', '$scope', '$stateParams', '$state', '$uibModalInstance', 'entity', 'Playlist', 'Song', 'User', 'Upload', 'Principal',
        function ($rootScope, $scope, $stateParams, $state, $uibModalInstance, entity, Playlist, Song, User, Upload,Principal) {

            Principal.identity().then(function(account) {
                $scope.account = account;
                $scope.isAuthenticated = Principal.isAuthenticated;
            });

            $scope.playlist = entity;
            $scope.songs = Song.query();
            $scope.users = User.query();
            $scope.selectedTracks = [];
            $scope.playlists = Playlist.getPlaylistUser({login: $scope.account.login});

            $scope.load = function (id) {
                Playlist.get({id: id}, function (result) {
                    $scope.playlist = result;
                });
            };

            $scope.remove = function(index){
                var songDuration = $scope.playlist.songs[index].duration;
                $scope.playlist.full_duration -= songDuration;
                $scope.playlist.songs.splice(index, 1);

            }

            $scope.addTrack = function(track){
                $scope.playlist.songs.push(track);
                $scope.playlist.full_duration += track.duration;
            }

            function saveAfterUpload() {
                Playlist.save($scope.playlist, onSaveSuccess, onSaveError);
            }

            var onSaveSuccess = function (result) {
                $scope.$emit('soundxtreamappApp:playlistUpdate', result);
                $uibModalInstance.close(result);
                $scope.isSaving = false;
            };

            var onSaveError = function (result) {
                $scope.isSaving = false;
            };

            $scope.save = function () {
                $scope.isSaving = true;
                if ($scope.playlist.id != null) {
                    console.log();
                    if ($scope.picFile != undefined) {
                        var imageBase64 = $scope.croppedArtwork;
                        var blob = dataURItoBlob(imageBase64);
                        var file = new File([blob], "ds.jpg");
                        $scope.uploadArt(file);
                    } else {
                        //$scope.playlist.artwork = $rootScope.account.user_image;
                    }
                    Playlist.update($scope.playlist, onSaveSuccess, onSaveError);
                } else {
                    if ($scope.picFile != undefined) {
                        var imageBase64 = $scope.croppedArtwork;
                        var blob = dataURItoBlob(imageBase64);
                        var file = new File([blob], "ds.jpg");
                        $scope.uploadArt(file);
                    } /*else {
                        $scope.playlist.artwork = $rootScope.account.user_image;
                    }*/
                    if ($scope.bannerFile != undefined) {
                        var imageBase64Banner = $scope.croppedBanner;
                        var blobBanner = dataURItoBlob(imageBase64Banner);
                        var fileBanner = new File([blobBanner], "ds2.jpg");
                        //$scope.uploadArt($scope.artworkFile);

                        $scope.uploadBanner(fileBanner);
                    } else {
                        //$scope.playlist.banner_playlist = $rootScope.account.user_image;
                        saveAfterUpload();
                    }

                    //Playlist.save($scope.playlist, onSaveSuccess, onSaveError);
                }


            };



            function dataURItoBlob(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
            }

            $scope.clear = function () {
                $uibModalInstance.dismiss('cancel');
            };
            $scope.datePickerForDateCreated = {};

            $scope.datePickerForDateCreated.status = {
                opened: false
            };

            $scope.datePickerForDateCreatedOpen = function ($event) {
                $scope.datePickerForDateCreated.status.opened = true;
            };

            $scope.uploadBanner = function (file) {
                if (file != null) {
                    uploadBannerSong(file)
                }
            }

            function uploadBannerSong(file) {
                var songArtworkName = file.name.toLowerCase();
                var ext = file.name.split('.').pop();

                function randomString(length, chars) {
                    var result = '';
                    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                    return result;
                }

                var rString = "bannerPlaylist-" + randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "." + ext;
                //$scope.song.banner_song = "uploads/" + rString;

                Upload.upload({
                    url: 'api/upload',
                    data: {file: file, name: rString}
                }).then(function (resp) {

                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    $scope.playlist.banner_playlist = "uploads/" + rString;
                    saveAfterUpload();
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });


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

                var rString = "artworkSet-" + randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "." + ext;
                $scope.playlist.artwork = "uploads/" + rString;

                Upload.upload({
                    url: 'api/upload',
                    data: {file: file, name: rString}
                }).then(function (resp) {

                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    $scope.playlist.artwork = "uploads/" + rString;
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });


            };
        }]);
