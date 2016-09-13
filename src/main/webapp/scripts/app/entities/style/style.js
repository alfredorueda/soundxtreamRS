'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('style', {
                parent: 'entity',
                url: '/styles',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'soundxtreamappApp.style.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/style/styles.html',
                        controller: 'StyleController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('style');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('style.detail', {
                parent: 'entity',
                url: '/style/{id}',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'soundxtreamappApp.style.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/style/style-detail.html',
                        controller: 'StyleDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('style');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Style', function($stateParams, Style) {
                        return Style.get({id : $stateParams.id});
                    }]
                }
            })
            .state('style.new', {
                parent: 'style',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/style/style-dialog.html',
                        controller: 'StyleDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('style', null, { reload: true });
                    }, function() {
                        $state.go('style');
                    })
                }]
            })
            .state('style.edit', {
                parent: 'style',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/style/style-dialog.html',
                        controller: 'StyleDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Style', function(Style) {
                                return Style.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('style', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('style.delete', {
                parent: 'style',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/style/style-delete-dialog.html',
                        controller: 'StyleDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Style', function(Style) {
                                return Style.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('style', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
