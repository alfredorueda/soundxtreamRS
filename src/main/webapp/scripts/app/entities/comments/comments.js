'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('comments', {
                parent: 'entity',
                url: '/commentss',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'soundxtreamappApp.comments.home.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/comments/commentss.html',
                        controller: 'CommentsController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('comments');
                        $translatePartialLoader.addPart('global');
                        return $translate.refresh();
                    }]
                }
            })
            .state('comments.detail', {
                parent: 'entity',
                url: '/comments/{id}',
                data: {
                    authorities: ['ROLE_ADMIN'],
                    pageTitle: 'soundxtreamappApp.comments.detail.title'
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/entities/comments/comments-detail.html',
                        controller: 'CommentsDetailController'
                    }
                },
                resolve: {
                    translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                        $translatePartialLoader.addPart('comments');
                        return $translate.refresh();
                    }],
                    entity: ['$stateParams', 'Comments', function($stateParams, Comments) {
                        return Comments.get({id : $stateParams.id});
                    }]
                }
            })
            .state('comments.new', {
                parent: 'comments',
                url: '/new',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/comments/comments-dialog.html',
                        controller: 'CommentsDialogController',
                        size: 'lg',
                        resolve: {
                            entity: function () {
                                return {
                                    comment_text: null,
                                    date_comment: null,
                                    id: null
                                };
                            }
                        }
                    }).result.then(function(result) {
                        $state.go('comments', null, { reload: true });
                    }, function() {
                        $state.go('comments');
                    })
                }]
            })
            .state('comments.edit', {
                parent: 'comments',
                url: '/{id}/edit',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/comments/comments-dialog.html',
                        controller: 'CommentsDialogController',
                        size: 'lg',
                        resolve: {
                            entity: ['Comments', function(Comments) {
                                return Comments.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('comments', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            })
            .state('comments.delete', {
                parent: 'comments',
                url: '/{id}/delete',
                data: {
                    authorities: ['ROLE_ADMIN'],
                },
                onEnter: ['$stateParams', '$state', '$uibModal', function($stateParams, $state, $uibModal) {
                    $uibModal.open({
                        templateUrl: 'scripts/app/entities/comments/comments-delete-dialog.html',
                        controller: 'CommentsDeleteController',
                        size: 'md',
                        resolve: {
                            entity: ['Comments', function(Comments) {
                                return Comments.get({id : $stateParams.id});
                            }]
                        }
                    }).result.then(function(result) {
                        $state.go('comments', null, { reload: true });
                    }, function() {
                        $state.go('^');
                    })
                }]
            });
    });
