'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('song', {
                parent: 'entity',
                url: '/songs',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.playlist.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/song/songs.html',
                        controller: 'SongController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('song');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('song.detail', {
                parent: 'entity',
                url: '/{user}/track/{accessUrl}',
                data: {
                    authorities: [],
                    pageTitle: 'soundxtreamappApp.song.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/song/song-detail.html',
                        controller: 'SongDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('song');
                        return $translate.refresh();
                    }],
                    /*entity: ['$stateParams', 'Song', function($stateParams, Song) {
                        return Song.get({id : $stateParams.id});
                    }]*/
                    entity: ['$stateParams', 'Song', function($stateParams, Song) {
                        return Song.getAccessUrl({accessUrl : $stateParams.accessUrl, user: $stateParams.user});
                    }]
                }
            })
            .state('song.new', {
                parent: 'song',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song/song-dialog.html',
                        controller: 'SongDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    url: null,
                                    label: null,
                                    date_posted: null,
                                    artwork: null,
                                    tags: null,
                                    duration: null,
                                    description: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('song', null, { reload: true });
                    }, function() {
                        $state.go('song');
                    })
                }]
            })
            .state('song.edit', {
                parent: 'song.detail',
                url: '/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song/song-dialog.html',
                        controller: 'SongDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Song', function(Song) {
                                //return Song.get({id : $stateParams.id});
                                return Song.getAccessUrl({accessUrl : $stateParams.accessUrl, user: $stateParams.user});
                            }]
                        }
                    }).result.then(function(result) {
                        console.log(result.access_url);
                        console.log(result.user.login);
                        $state.go('song.detail', {user: result.user.login, accessUrl: result.access_url} ,{reload:true});
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('song.delete', {
                parent: 'song.detail',
                url: '/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song/song-delete-dialog.html',
                        controller: 'SongDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Song', function(Song) {
                                return Song.getAccessUrl({accessUrl : $stateParams.accessUrl, user: $stateParams.user});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('song', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('song.addPlaylist', {
                parent: 'song',
                url: '/adding/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state','$uibModal','$rootScope','$cookies', function($stateParams, $state, $uibModal,$rootScope,$cookies) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song/song-to-playlist.html',
                        controller: 'SongToPlaylist',
                        size: 'md',
                        resolve: {
                            entity: ['Playlist', function(Playlist) {
                                return Playlist.getPlaylistUser({});
                            }],
                            entity_song: ['Song',function(Song){
                                return Song.get({id:$stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go("^");
                    }, function() {
                        $state.go("^");
                    })
                }]
            })
            .state('song.detail.addPlaylist', {
                parent: 'song.detail',
                url: '/add-track',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state','$uibModal','$rootScope','$cookies', function($stateParams, $state, $uibModal,$rootScope,$cookies) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song/song-to-playlist.html',
                        controller: 'SongToPlaylist',
                        size: 'md',
                        resolve: {
                            entity: ['Playlist', function(Playlist) {
                                return Playlist.getPlaylistUser({});
                            }],
                            entity_song: ['Song',function(Song){
                                return Song.getAccessUrl({accessUrl : $stateParams.accessUrl, user: $stateParams.user});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go("^");
                    }, function() {
                        $state.go("^");
                    })
                }]
            })
            .state('allPlaylistWSong', {
                parent: 'song',
                url: '/{id_song}/allPlaylist/',
                data: {
                    authorities: ['ROLE_USER'],
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/playlist/allplaylist-song.html',
                        controller: 'playlistsSongController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('song');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Song', function($stateParams, Song) {
                        return Song.getPlaylistWithSong({id:$stateParams.id_song});
                    }]
                }
            });
    });
