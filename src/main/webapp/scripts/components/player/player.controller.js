/**
 * Created by xavipandis on 28/3/16.
 */
angular.module('soundxtreamappApp')
    .controller('playerPlaylistController', ['$scope','Principal','$rootScope','Song','Auth','$state', function ($scope,Principal,$rootScope,Song,Auth,$state) {
            this.audioPlaylist = [];
            //De donde esta sonando( playlist, cancion solo)
            this.playlistCurrent = null;
            //console.log(this.audioPlaylist);
            Principal.identity().then(function(account) {
                $rootScope.account = account;
                $scope.isAuthenticated = Principal.isAuthenticated;
            });

            this.countPlay = function(song){
                song.playsCount += 1;
                Song.update(song, function(result){
                    console.log(result);
                }, function(result){
                    console.log(result);
                });
            };

            $scope.logout = function () {
                Auth.logout();
                $rootScope.account = {};
                $state.go('login');
            }


            this.showPlaylist = false;

            /*this.playAllStream = function(objects,mediaPlayer,indexSong){
                console.log(objects);
                for(var k = 0; k < objects.length;k++){
                    if(objects[k].type == "playlist" && objects[k].playlists != null){
                        for(var k = 0; k < objects[k].playlist.songs.length;k++){
                            var songs = objects[k].playlist.songs;

                            var song = {
                                artist: songs.user.login,
                                displayName: songs.name,
                                image: songs.artwork,
                                src: songs.url,
                                title: songs.name,
                                type: 'audio/mpeg',
                                url: songs.url,
                                id: songs.id
                            };

                            this.audioPlaylist.push(angular.copy(song));
                        }
                    }else{
                        console.log(objects[k].song);
                        var song = {
                            artist: objects[k].song.user.login,
                            displayName: objects[k].song.name,
                            image: objects[k].song.artwork,
                            src: objects[k].song.url,
                            title: objects[k].song.name,
                            type: 'audio/mpeg',
                            url: objects[k].song.url,
                            id: objects[k].song.id
                        };

                        this.audioPlaylist.push(angular.copy(song));

                    }
                }
                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    mediaPlayer.play(indexSong);
                    var song = {};
                }, 200);
            }*/

            this.playAllExplore = function(audioElements,mediaPlayer,indexSong){
                $rootScope.$broadcast('playerBroadcast',mediaPlayer);
                this.playlistCurrent = "from explore";
                this.audioPlaylist = [];
                for(var k = 0; k < audioElements.length;k++){
                    var audioElement = audioElements[k].song;

                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id
                    };

                    this.audioPlaylist.push(angular.copy(song));
                }


                this.countPlay(audioElements[indexSong].song);

                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    mediaPlayer.play(indexSong);
                    var song = {};
                }, 200);
            }
            this.addSongAll = function (audioElements,mediaPlayer,indexSong,playingFrom) {
                this.audioPlaylist = [];
                this.playlistCurrent = playingFrom;

                for(var k = 0; k < audioElements.length;k++){
                    var audioElement = audioElements[k].song;

                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id
                    };

                    this.audioPlaylist.push(angular.copy(song));

                }

                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    mediaPlayer.play(indexSong);
                    console.log(this.audioPlaylist);
                    var song = {};
                }, 200);

            };

            this.addSong = function (audioElement,mediaPlayer) {
                console.log(audioElement);
                this.audioPlaylist = [];
                var song = {
                    artist: audioElement.user.login,
                    displayName: audioElement.name,
                    image: audioElement.artwork,
                    src: audioElement.url,
                    title: audioElement.name,
                    type: 'audio/mpeg',
                    url: audioElement.url,
                    id: audioElement.id
                };

                this.audioPlaylist.push(angular.copy(song));

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);

                //console.log(this.audioPlaylist);
            };

            this.addSongAndPlay = function(audioElement,mediaPlayer){
                var song = {
                    artist: audioElement.user.login,
                    displayName: audioElement.name,
                    image: audioElement.artwork,
                    src: audioElement.url,
                    title: audioElement.name,
                    type: 'audio/mpeg',
                    url: audioElement.url,
                    id: audioElement.id
                };

                this.audioPlaylist.push(angular.copy(song));

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);
            };

            this.playPauseSong = function(mediaPlayer){
                mediaPlayer.playPause();
            };

            this.addSongs = function(playlist){
                console.log(playlist);
                var audioElement = {};
                var songs = {};

                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;
            };

            this.addSongsAndPlay = function(playlist,mediaPlayer,playingFrom){
                console.log(playlist);
                var audioElement = {};
                var songs = [];
                this.playlistCurrent = playingFrom;

                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;

                setTimeout(function () {
                    mediaPlayer.play();
                    var song = {};
                }, 200);
            };

            this.playTrackFromPlaylist = function(playlist,mediaPlayer,indexSong,playingFrom){
                console.log(playlist);
                var audioElement = {};
                var songs = [];
                this.playlistCurrent = playingFrom;

                for(var k = 0; k < playlist.songs.length; k++){
                    audioElement = playlist.songs[k];
                    var song = {
                        artist: audioElement.user.login,
                        displayName: audioElement.name,
                        image: audioElement.artwork,
                        src: audioElement.url,
                        title: audioElement.name,
                        type: 'audio/mpeg',
                        url: audioElement.url,
                        id: audioElement.id
                    };
                    songs.push(angular.copy(song));
                }

                this.audioPlaylist = songs;

                setTimeout(function () {
                    mediaPlayer.currentTrack = indexSong+1;
                    console.log($scope.playerPlaylist.getSongId(mediaPlayer.currentTrack));
                    console.log("TRACK PLAYING: "+mediaPlayer.currentTrack);
                    console.log("Index song passed: "+indexSong);
                    mediaPlayer.play(indexSong);
                    var song = {};
                }, 200);
            };

            this.removeSong = function (index) {
                this.audioPlaylist.splice(index, 1);
            };

            this.dropSong = function (audioElement, index) {
                this.audioPlaylist.splice(index, 0, angular.copy(audioElement));
            };

            this.getSongImage = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].image;
                }
            };

            this.getSongArtist = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].artist;
                }
            };

            this.getSongName = function (currentTrack) {
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].title;
                }
            };

            this.getSongId = function(currentTrack){
                if (typeof this.audioPlaylist[currentTrack - 1] != "undefined") {
                    return this.audioPlaylist[currentTrack - 1].id;
                }
            };

            this.seekPercentage = function ($event) {
                var percentage = ($event.offsetX / $event.target.offsetWidth);
                if (percentage <= 1) {
                    return percentage;
                } else {
                    return 0;
                }
            };

            this.seek = function(event){
                var percentage = (event.offsetX / event.currentTarget.offsetWidth);
                if (percentage <= 1) {
                    return percentage;
                } else {
                    return 0;
                }
            };

            var timeDrag = false; /* Drag status */
            $('.timeline').mousedown(function (e) {
                timeDrag = true;
            });

           /* $('.timeline').mouseleave(function(){
                timeDrag = false;
            })*/

            $('.timeline').click(function(e){
                seekDrag(e);
            });

            $(document).mouseup(function (e) {
                if (timeDrag) {
                    timeDrag = false;
                }
            });

            $(document).mousemove(function (e) {
                if (timeDrag) {
                    e.preventDefault();

                    var pointer = $('.timeline-pointer');

                    if(parseInt(pointer.css("left")) <= 0 ){
                        pointer.css("left","0px");
                        return false;
                    }

                    seekDrag(e);
                }
            });
            $('.timeline').mousemove(function (e) {
                if (timeDrag) {
                    e.preventDefault();
                    seekDrag(e);
                }
            });
            $(document).mouseleave(function(){
                if (timeDrag) {
                    timeDrag = false;
                }
            });

            function seekDrag(e){
                var offsetTimeline = $('.timeline-current').offset().left;
                var width = $('.timeline-full').width();
                var pointer = $('.timeline-pointer');

                if(parseInt($('.timeline-current').width()) < parseInt(width)){
                    pointer.css("left", (e.pageX - offsetTimeline));
                    $('.timeline-current').css("width", (e.pageX - offsetTimeline));
                }
                else{
                    pointer.css("left", (width));
                    $('.timeline-current').css("width", width);
                }

                if(parseInt($('.timeline-current').width()) < 0 ){
                    $('.timeline-current').css("width","0px");
                }

                var percentage = ((e.pageX - offsetTimeline) / width);
                if(percentage > 1.0){
                    percentage = 0;
                }
                $scope.mediaPlayer.seek($scope.mediaPlayer.duration * percentage);
            }
    }]);
