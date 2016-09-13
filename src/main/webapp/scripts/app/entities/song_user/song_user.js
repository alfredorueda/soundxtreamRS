'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('song_user', {
                parent: 'entity',
                url: '/song_users',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.song_user.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/song_user/song_users.html',
                        controller: 'Song_userController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('song_user');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('song_user.detail', {
                parent: 'entity',
                url: '/song_user/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.song_user.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/song_user/song_user-detail.html',
                        controller: 'Song_userDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('song_user');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Song_user', function($stateParams, Song_user) {
                        return Song_user.get({id : $stateParams.id});
                    }]
                }
            })
            .state('song_user.new', {
                parent: 'song_user',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song_user/song_user-dialog.html',
                        controller: 'Song_userDialogController',
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
                        $state.go('song_user', null, { reload: true });
                    }, function() {
                        $state.go('song_user');
                    })
                }]
            })
            .state('song_user.edit', {
                parent: 'song_user',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song_user/song_user-dialog.html',
                        controller: 'Song_userDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Song_user', function(Song_user) {
                                return Song_user.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('song_user', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('song_user.delete', {
                parent: 'song_user',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/song_user/song_user-delete-dialog.html',
                        controller: 'Song_userDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Song_user', function(Song_user) {
                                return Song_user.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('song_user', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
