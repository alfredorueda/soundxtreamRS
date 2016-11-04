'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('playlist', {
                parent: 'entity',
                url: '/playlists',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.playlist.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/playlist/playlists.html',
                        controller: 'PlaylistController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('playlist');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('playlist.detail', {
                parent: 'playlist',
                url: '/{id}',
                data: {
                    authorities: [],
                    pageTitle: 'soundxtreamappApp.playlist.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/playlist/playlist-detail.html',
                        controller: 'PlaylistDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('playlist');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Playlist', function($stateParams, Playlist) {
                        return Playlist.get({id : $stateParams.id});
                    }]
                }
            })
            .state('playlist.new', {
                parent: 'playlist',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/playlist/playlist-dialog.html',
                        controller: 'PlaylistDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    artwork: null,
                                    dateCreated: null,
                                    full_duration: null,
                                    id: null,
                                    banner_playlist: null,
                                    songs: []
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('playlist', null, { reload: true });
                    }, function() {
                        $state.go('playlist');
                    })
                }]
            })
            .state('playlist.edit', {
                parent: 'playlist',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/playlist/playlist-dialog.html',
                        controller: 'PlaylistDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Playlist', function(Playlist) {
                                return Playlist.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('playlist', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('playlist.delete', {
                parent: 'playlist',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/playlist/playlist-delete-dialog.html',
                        controller: 'PlaylistDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Playlist', function(Playlist) {
                                return Playlist.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('playlist', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
