/**
 * Created by Javi on 11/02/2016.
 */
'use strict';
angular.module('soundxtreamappApp').controller('SongToPlaylist',
    ['$scope', '$stateParams', '$state', '$rootScope', 'Song_user', '$uibModalInstance','Playlist', 'Principal', 'Song', 'entity','entity_song','toaster',
        function($scope,$stateParams, $state, $rootScope, Song_user, $uibModalInstance, Playlist, Principal, Song, entity,entity_song,toaster) {

            Principal.identity().then(function(account) {
                $scope.account = account;
                $scope.isAuthenticated = Principal.isAuthenticated;
            });

            $scope.songDTO = entity_song;
            $scope.playlists = entity;

            Playlist.getPlaylistUser({login: $scope.account.login}, function(result){
                $scope.playlists = result;
            });

            $scope.load = function (id) {
                Playlist.get({id: id}, function (result) {
                    $scope.playlist = result;
                });
            };
            $scope.playlistNew = null;

            $scope.checkName = function(){
                var existName = false;
                for(var k = 0; k < $scope.playlists.length; k++){
                    console.log($scope.playlists[k].name +" "+$scope.playlistNew.name);
                    if($scope.playlists[k].name === $scope.playlistNew.name){
                        existName = true;
                    }
                }
                if(existName){
                    $scope.errorName = true;
                }
                else{
                    $scope.errorName = false;
                }
            };

            var onSaveSuccess = function (result) {
                $scope.$emit('sxApp:playlistUpdate', result);
                $uibModalInstance.close(result);
                $scope.isSaving = false;
            };

            var onSaveError = function (result) {
                $scope.isSaving = false;
            };

            $scope.save = function () {
                $scope.isSaving = true;
                if ($scope.playlist.id != null) {
                    Playlist.update($scope.playlist, onSaveSuccess, onSaveError);
                } else {
                    $scope.playlist.artwork = $scope.account.user_image;
                    Playlist.save($scope.playlist, onSaveSuccess, onSaveError);
                }
            };

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

            $scope.add = function (id) {
                $scope.playlist = Playlist.get({id: id});

                $scope.playlist.$promise.then(function (result) {
                    var exist = false;
                    for (var k = 0; k < $scope.playlist.songs.length; k++) {
                        if ($scope.playlist.songs[k].id == $scope.songDTO.song.id) {
                            exist = true;
                            toaster.pop('error',"Song added to: ",result.name);
                        }
                    }
                    if (!exist) {
                        $scope.playlist.songs.push($scope.songDTO.song);
                        $scope.playlist.full_duration = 0;
                        for(var k = 0; k < $scope.playlist.songs.length; k++){
                            $scope.playlist.full_duration += $scope.playlist.songs[k].duration;
                        }
                        Playlist.update($scope.playlist, function(result){
                            $rootScope.$broadcast('soundxtreamappApp:playlistUpdated', result);
                        });
                        $uibModalInstance.close();
                    }
                });
            };

            $scope.addConfirm = false;

            $scope.create = function(){
                var existName = false;
                $scope.playlistNew.full_duration = 0;
                $scope.playlistNew.artwork = $scope.account.user_image;
                if($scope.addConfirm){
                    $scope.playlistNew.songs = [];
                    $scope.playlistNew.songs.push($scope.song);
                    for(var k = 0; k < $scope.playlistNew.songs.length; k++){
                        $scope.playlistNew.full_duration += $scope.playlistNew.songs[k].duration;
                    }
                }
                for(var k = 0; k < $scope.playlists.length; k++){
                    if($scope.playlists[k].name === $scope.playlistNew.name){
                        existName = true;
                    }
                }
                if(!existName){
                    Playlist.save($scope.playlistNew);
                    $scope.playlists = Playlist.getPlaylistUser({});
                    //$scope.playlists.push($scope.playlistNew);
                    $scope.playlistNew = null;
                    $scope.errorName = false;
                }
                else{
                    $scope.errorName = true;
                }
            };

            var success = function(result){
                toaster.pop('success',"Song added to: ",result.name);
                $uibModalInstance.close(result);

            }

        }]);
