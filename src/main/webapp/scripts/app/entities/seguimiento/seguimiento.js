'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('seguimiento', {
                parent: 'entity',
                url: '/seguimientos',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'soundxtreamappApp.seguimiento.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/seguimiento/seguimientos.html',
                        controller: 'SeguimientoController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('seguimiento');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('seguimiento.detail', {
                parent: 'entity',
                url: '/seguimiento/{id}',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'soundxtreamappApp.seguimiento.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/seguimiento/seguimiento-detail.html',
                        controller: 'SeguimientoDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('seguimiento');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Seguimiento', function($stateParams, Seguimiento) {
                        return Seguimiento.get({id : $stateParams.id});
                    }]
                }
            })
            .state('seguimiento.new', {
                parent: 'seguimiento',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/seguimiento/seguimiento-dialog.html',
                        controller: 'SeguimientoDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    fecha: null,
                                    siguiendo: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('seguimiento', null, { reload: true });
                    }, function() {
                        $state.go('seguimiento');
                    })
                }]
            })
            .state('seguimiento.edit', {
                parent: 'seguimiento',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/seguimiento/seguimiento-dialog.html',
                        controller: 'SeguimientoDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Seguimiento', function(Seguimiento) {
                                return Seguimiento.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('seguimiento', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('seguimiento.delete', {
                parent: 'seguimiento',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/seguimiento/seguimiento-delete-dialog.html',
                        controller: 'SeguimientoDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Seguimiento', function(Seguimiento) {
                                return Seguimiento.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('seguimiento', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
