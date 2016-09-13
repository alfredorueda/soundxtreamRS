'use strict';

angular.module('soundxtreamappApp')
    .config(function ($stateProvider) {
        $stateProvider
            .state('user-profile', {
                parent: 'site',
                url: '/profile/{login}',
                data: {
                    authorities: [],
                    pageTitle: "Profile"
                },
                views: {
                    'content@': {
                        templateUrl: 'scripts/app/user-profile/user-profile.html',
                        controller: 'UserProfileController'
                    }
                },
                resolve: {
                    userInfo: ['User','$stateParams',function(User,$stateParams){
                        return User.get({login:$stateParams.login});
                    }]
                }
            })
            .state('user-profile.likes', {
                parent: 'user-profile',
                url: '/likes',
                data: {
                    authorities: []
                },
                views: {
                    'user-view@user-profile': {
                        templateUrl: 'scripts/app/user-profile/user-likes.html',
                        controller: 'UserProfileLikesController'
                    }
                },
                resolve: {
                    userInfo: ['User','$stateParams',function(User,$stateParams){
                        return User.get({login:$stateParams.login});
                    }]
                }
            })
            .state('user-profile.playlists', {
                parent: 'user-profile',
                url: '/playlists',
                data: {
                    authorities: []
                },
                views: {
                    'user-view@user-profile': {
                        templateUrl: 'scripts/app/user-profile/user-playlists.html',
                        controller: 'UserProfilePlaylistsController'
                    }
                },
                resolve: {
                    userInfo: ['User','$stateParams',function(User,$stateParams){
                        return User.get({login:$stateParams.login});
                    }]
                }
            })
            .state('user-profile.followers', {
                parent: 'user-profile',
                url: '/followers',
                data: {
                    authorities: []
                },
                views: {
                    'user-view@user-profile': {
                        templateUrl: 'scripts/app/user-profile/user-followers.html',
                        controller: 'UserProfileController'
                    }
                },
                resolve: {
                    userInfo: ['User','$stateParams',function(User,$stateParams){
                        return User.get({login:$stateParams.login});
                    }]
                }
            })
            .state('user-profile.following', {
                parent: 'user-profile',
                url: '/following',
                data: {
                    authorities: []
                },
                views: {
                    'user-view@user-profile': {
                        templateUrl: 'scripts/app/user-profile/user-following.html',
                        controller: 'UserProfileController'
                    }
                },
                resolve: {
                    userInfo: ['User','$stateParams',function(User,$stateParams){
                        return User.get({login:$stateParams.login});
                    }]
                }
            })
            .state('user-profile.tracks', {
                parent: 'user-profile',
                url: '/tracks',
                data: {
                    authorities: []
                },
                views: {
                    'user-view@user-profile': {
                        templateUrl: 'scripts/app/user-profile/user-tracks.html',
                        controller: 'UserProfileController'
                    }
                },
                resolve: {
                    userInfo: ['User','$stateParams',function(User,$stateParams){
                        return User.get({login:$stateParams.login});
                    }]
                }
            });
    });
