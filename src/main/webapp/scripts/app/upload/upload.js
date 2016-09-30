/**
 * Created by Javi on 21/03/2016.
 */
'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('upload', {
                parent: 'entity',
                url: '/upload',
                data: {
                    authorities: ['ROLE_USER']
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/upload/upload.html',
                        controller: 'UploadController'
                    }
                },
                resolve: {
                    mainTranslatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate,$translatePartialLoader) {
                        $translatePartialLoader.addPart('main');
                        $translatePartialLoader.addPart('song');
                        return $translate.refresh();
                    }]
                }
            })
    });
