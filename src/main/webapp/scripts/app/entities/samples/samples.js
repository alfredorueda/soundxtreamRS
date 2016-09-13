'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('samples', {
                parent: 'entity',
                url: '/sampless',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.samples.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/samples/sampless.html',
                        controller: 'SamplesController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('samples');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('samples.detail', {
                parent: 'entity',
                url: '/samples/{id}',
                data: {
                    authorities: ['ROLE_USER'],
                    pageTitle: 'soundxtreamappApp.samples.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/samples/samples-detail.html',
                        controller: 'SamplesDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('samples');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Samples', function($stateParams, Samples) {
                        return Samples.get({id : $stateParams.id});
                    }]
                }
            })
            .state('samples.new', {
                parent: 'samples',
                url: '/new',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/samples/samples-dialog.html',
                        controller: 'SamplesDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    name: null,
                                    duration: null,
                                    tags: null,
                                    url: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('samples', null, { reload: true });
                    }, function() {
                        $state.go('samples');
                    })
                }]
            })
            .state('samples.edit', {
                parent: 'samples',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/samples/samples-dialog.html',
                        controller: 'SamplesDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Samples', function(Samples) {
                                return Samples.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('samples', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('samples.delete', {
                parent: 'samples',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_USER'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/samples/samples-delete-dialog.html',
                        controller: 'SamplesDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Samples', function(Samples) {
                                return Samples.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('samples', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
