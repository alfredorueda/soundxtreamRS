/**
 * Created by Javi on 21/03/2016.
 */
'use strict';

angular.module('soundxtreamappApp').controller('UploadController',
    ['$scope', '$stateParams', '$location', '$http', 'Song', 'Playlist', 'Upload', '$timeout',
        '$state', '$log', 'Principal', 'Style', '$rootScope', 'toaster',
        function ($scope, $stateParams, $location, $http, Song, Playlist, Upload, $timeout,
                  $state, $log, Principal, Style, $rootScope, toaster) {

            Principal.identity().then(function (account) {
                $scope.account = account;
            });

            $scope.processing = false;
            $scope.uploadType = "track";
            $scope.styles = Style.query({});
            $scope.invalidFiles = [];
            $scope.filesUpload = [];
            $scope.songUploaded = false;
            $scope.uploadStart = false;
            $scope.song = {
                name: null,
                url: null,
                label: null,
                tags: null,
                artwork: null,
                description: null,
                date_posted: null,
                id: null,
                duration: null,
                banner_song: null,
                bpm: null
            };

            $scope.$watch('files', function () {
                $scope.uploadSong($scope.files);
            });

            $scope.load = function (id) {
                Song.get({id: id}, function (result) {
                    $scope.song = result;
                });
            };

            var onSaveSuccess = function (result) {
                $timeout(function () {
                    $state.go('song', null, null);
                }, 1000);
                toaster.pop('success', "Success", "Song uploaded!");
            };

            var onSaveError = function (result) {
                $scope.isSaving = false;
            };
            $scope.save = function () {
                $scope.isSaving = true;
                $scope.song.date_posted = new Date();
                if ($scope.song.id != null) {
                    Song.update($scope.song, onSaveSuccess, onSaveError);
                } else {
                    console.log($scope.picFile);
                    if ($scope.picFile == undefined) {
                        //$scope.uploadArt($scope.artworkFile);
                        $scope.song.artwork = $rootScope.account.user_image;
                    } else {
                        var imageBase64 = $scope.croppedArtwork;
                        var blob = dataURItoBlob(imageBase64);
                        var file = new File([blob], "ds.jpg");

                        $scope.uploadArt(file);
                    }
                    if ($scope.bannerFile != undefined) {
                        var imageBase64Banner = $scope.croppedBanner;
                        var blobBanner = dataURItoBlob(imageBase64Banner);
                        var fileBanner = new File([blobBanner], "ds2.jpg");
                        //$scope.uploadArt($scope.artworkFile);

                        $scope.uploadBanner(fileBanner);
                    } else {
                        saveAfterUpload();
                    }
                }
            };

            function saveAfterUpload() {
                $scope.song.date_posted = new Date();
                Song.save($scope.song, onSaveSuccess, onSaveError);
            }

            function dataURItoBlob(dataURI) {
                var binary = atob(dataURI.split(',')[1]);
                var array = [];
                for (var i = 0; i < binary.length; i++) {
                    array.push(binary.charCodeAt(i));
                }
                return new Blob([new Uint8Array(array)], {type: 'image/jpeg'});
            }

            /*$scope.saveAll = function () {
             $scope.isSaving = true;
             for (var k = 0; k < $scope.songs.length; k++) {
             $scope.song.name = $scope.songs[k].name;
             $scope.song.location_url = $scope.songs[k].location_url;
             Song.save($scope.song, function () {
             $state.go('song', null, {reload: true});
             });
             $scope.song = {
             name: null,
             location_url: null
             };
             }
             };*/

            /*$scope.artworkShow = function (e) {
             $scope.artworkFile = e;
             var reader = new FileReader();
             reader.onload = function (e) {
             var image;
             image = new Image();
             image.src = e.target.result;
             return image.onload = function () {
             return $('.artwork__holder').attr("src", this.src);
             };
             };
             return reader.readAsDataURL(e);
             }*/

            $scope.uploadArt = function (file) {
                $scope.formUpload = true;
                if (file != null) {
                    uploadUsingUploadArtwork(file)
                }
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

                var rString = "bannerSong-" + randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "." + ext;
                //$scope.song.banner_song = "uploads/" + rString;

                Upload.upload({
                    url: 'api/upload',
                    data: {file: file, name: rString}
                }).then(function (resp) {

                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    $scope.song.banner_song = "uploads/" + rString;
                    saveAfterUpload();
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });


            };

            function uploadUsingUploadArtwork(file) {
                var songArtworkName = file.name.toLowerCase();
                var ext = file.name.split('.').pop();

                function randomString(length, chars) {
                    var result = '';
                    for (var i = length; i > 0; --i) result += chars[Math.floor(Math.random() * chars.length)];
                    return result;
                }

                var rString = "artwork-" + randomString(15, '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ') + "." + ext;
                $scope.song.artwork = "uploads/" + rString;

                Upload.upload({
                    url: 'api/upload',
                    data: {file: file, name: rString}
                }).then(function (resp) {

                    console.log('Success ' + resp.config.data.file.name + 'uploaded. Response: ' + resp.data);
                    $scope.song.artwork = "uploads/" + rString;

                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                    console.log(resp);
                }, function (evt) {
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total);
                    console.log('progress: ' + progressPercentage + '% ' + evt.config.data.file.name);
                });


            };


            $scope.checkedMultiple = false;

            //Upload Song File

            $scope.uploadOK = false;
            $scope.uploadStart = false;

            $scope.uploadSong = function (files) {
                $scope.filesUpload = files;
                if (files != null) {
                    for (var k = 0; k < files.length; k++) {
                        uploadUsingUpload(files[k]);
                    }
                }
            };
            $scope.uploadSuccess = false;
            var upload;

            /*$scope.$on('$stateChangeStart', function(event, next, current){
             if($scope.uploadStart){
             var result = confirm("Are you sure you want leave without save?");
             if(!result){
             event.preventDefault();
             }
             }

             });*/

            function uploadUsingUpload(file) {
                var songLocationName = "";
                console.log(file);

                var songArtworkName = file.name.toLowerCase();
                var ext = file.name.split('.').pop();
                console.log(ext);


                $scope.song.name = file.name;
                songLocationName = file.name.toLowerCase();
                songLocationName = songLocationName.split(' ').join('-');
                songLocationName = $scope.account.login + "-" + songLocationName;

                upload = Upload.upload({
                    url: 'api/upload',
                    data: {file: file, 'name': songLocationName}
                });
                upload.then(function (resp) {
                    Upload.mediaDuration(file).then(function (durationInSeconds) {
                        $scope.song.duration = durationInSeconds;
                        if(durationInSeconds < 1200){
                            $scope.getBPM(file);
                        }
                    });
                    $scope.song.url = "uploads/" + songLocationName;
                    $timeout(function () {
                        $scope.uploadSuccess = !$scope.uploadSuccess;
                    }, 1500);
                }, function (resp) {
                    console.log('Error status: ' + resp.status);
                }, function (evt) {
                    $scope.uploadStart = true;
                    var progressPercentage = parseInt(100.0 * evt.loaded / evt.total)
                    file.progress = Math.min(100, parseInt(100.0 *
                        evt.loaded / evt.total));
                    $scope.percentage = progressPercentage;
                });
            }

            $scope.cancelUploadSong = function () {
                upload.abort();
                toaster.pop('warning', "Whoops!!", "Upload canceled");
                $state.go('upload', null, null);
            }

            $scope.getBPM = function (file) {
                var fileTrack = file;
                var reader = new FileReader();
                var text = "";
                $scope.processing = true;
                var context = new (window.AudioContext || window.webkitAudioContext)();
                reader.onload = function () {
                    // Create offline context
                    var OfflineContext = window.OfflineAudioContext || window.webkitOfflineAudioContext;
                    var offlineContext = new OfflineContext(1, 2, 44100);

                    offlineContext.decodeAudioData(reader.result, function (buffer) {
                        // Create buffer source
                        var source = offlineContext.createBufferSource();
                        source.buffer = buffer;

                        // Create filter
                        var filter = offlineContext.createBiquadFilter();
                        filter.type = "lowpass";

                        // Pipe the song into the filter, and the filter into the offline context
                        source.connect(filter);
                        filter.connect(offlineContext.destination);

                        // Schedule the song to start playing at time:0
                        source.start(0);

                        var peaks,
                            initialThresold = 0.9,
                            thresold = initialThresold,
                            minThresold = 0.3,
                            minPeaks = 30;

                        do {
                            peaks = getPeaksAtThreshold(buffer.getChannelData(0), thresold);
                            thresold -= 0.05;
                        } while (peaks.length < minPeaks && thresold >= minThresold);

                        var intervals = countIntervalsBetweenNearbyPeaks(peaks);

                        var groups = groupNeighborsByTempo(intervals, buffer.sampleRate);

                        var top = groups.sort(function (intA, intB) {
                            return intB.count - intA.count;
                        }).splice(0, 5);
                        $scope.song.bpm = Math.round(top[0].tempo);
                        text = '<div id="guess">Guess for track <strong>NIGGA</strong> by ' +
                            '<strong>YOH</strong> is <strong>' + Math.round(top[0].tempo) + ' BPM</strong>' +
                            ' with ' + top[0].count + ' samples.</div>';
                        //console.log(text);
                        $scope.processing = false;
                    });

                };
                reader.readAsArrayBuffer(fileTrack);
            }

            function getPeaksAtThreshold(data, threshold) {
                var peaksArray = [];
                var length = data.length;
                for (var i = 0; i < length;) {
                    if (data[i] > threshold) {
                        peaksArray.push(i);
                        // Skip forward ~ 1/4s to get past this peak.
                        i += 10000;
                    }
                    i++;
                }
                return peaksArray;
            }

            function countIntervalsBetweenNearbyPeaks(peaks) {
                var intervalCounts = [];
                peaks.forEach(function (peak, index) {
                    for (var i = 0; i < 10; i++) {
                        var interval = peaks[index + i] - peak;
                        var foundInterval = intervalCounts.some(function (intervalCount) {
                            if (intervalCount.interval === interval)
                                return intervalCount.count++;
                        });
                        if (!foundInterval) {
                            intervalCounts.push({
                                interval: interval,
                                count: 1
                            });
                        }
                    }
                });
                return intervalCounts;
            }

            function groupNeighborsByTempo(intervalCounts, sampleRate) {
                var tempoCounts = [];
                intervalCounts.forEach(function (intervalCount, i) {
                    if (intervalCount.interval !== 0) {
                        // Convert an interval to tempo
                        var theoreticalTempo = 60 / (intervalCount.interval / sampleRate );

                        // Adjust the tempo to fit within the 90-180 BPM range
                        while (theoreticalTempo < 90) theoreticalTempo *= 2;
                        while (theoreticalTempo > 180) theoreticalTempo /= 2;

                        theoreticalTempo = Math.round(theoreticalTempo);
                        var foundTempo = tempoCounts.some(function (tempoCount) {
                            if (tempoCount.tempo === theoreticalTempo)
                                return tempoCount.count += intervalCount.count;
                        });
                        if (!foundTempo) {
                            tempoCounts.push({
                                tempo: theoreticalTempo,
                                count: intervalCount.count
                            });
                        }
                    }
                });
                return tempoCounts;
            }

        }])
    .filter('bytes', function () {
        return function (bytes, precision) {
            if (isNaN(parseFloat(bytes)) || !isFinite(bytes)) return '-';
            if (typeof precision === 'undefined') precision = 1;
            var units = ['bytes', 'kB', 'MB', 'GB', 'TB', 'PB'],
                number = Math.floor(Math.log(bytes) / Math.log(1024));
            return (bytes / Math.pow(1024, Math.floor(number))).toFixed(precision) + ' ' + units[number];
        }
    })
    .filter('propsFilter', function () {
        return function (items, props) {
            var out = [];

            if (angular.isArray(items)) {
                items.forEach(function (item) {
                    var itemMatches = false;

                    var keys = Object.keys(props);
                    for (var i = 0; i < keys.length; i++) {
                        var prop = keys[i];
                        var text = props[prop].toLowerCase();
                        if (item[prop].toString().toLowerCase().indexOf(text) !== -1) {
                            itemMatches = true;
                            break;
                        }
                    }

                    if (itemMatches) {
                        out.push(item);
                    }
                });
            } else {
                // Let the output be the input untouched
                out = items;
            }

            return out;
        };
    });
