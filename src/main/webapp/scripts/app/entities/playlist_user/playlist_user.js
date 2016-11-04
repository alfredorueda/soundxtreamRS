'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('playlist_user', {
                parent: 'entity',
                url: '/playlist_users',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.playlist_user.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/playlist_user/playlist_users.html',
                        controller: 'Playlist_userController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('playlist_user');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('playlist_user.detail', {
                parent: 'entity',
                url: '/playlist_user/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.playlist_user.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/playlist_user/playlist_user-detail.html',
                        controller: 'Playlist_userDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('playlist_user');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Playlist_user', function($stateParams, Playlist_user) {
                        return Playlist_user.get({id : $stateParams.id});
                    }]
                }
            })
            .state('playlist_user.new', {
                parent: 'playlist_user',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/playlist_user/playlist_user-dialog.html',
                        controller: 'Playlist_userDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    liked: null,
                                    shared: null,
                                    likedDate: null,
                                    sharedDate: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('playlist_user', null, { reload: true });
                    }, function() {
                        $state.go('playlist_user');
                    })
                }]
            })
            .state('playlist_user.edit', {
                parent: 'playlist_user',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/playlist_user/playlist_user-dialog.html',
                        controller: 'Playlist_userDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Playlist_user', function(Playlist_user) {
                                return Playlist_user.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('playlist_user', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('playlist_user.delete', {
                parent: 'playlist_user',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/playlist_user/playlist_user-delete-dialog.html',
                        controller: 'Playlist_userDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Playlist_user', function(Playlist_user) {
                                return Playlist_user.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('playlist_user', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
