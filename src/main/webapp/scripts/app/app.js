'use strict';

angular.module('soundxtreamappApp', ['LocalStorageModule', 'tmh.dynamicLocale', 'pascalprecht.translate',
    'ngResource', 'ngCookies', 'ngAria', 'ngCacheBuster', 'ngFileUpload','mediaPlayer','ngMaterial','ngAnimate',
    'toaster', 'ui.select','ngSanitize','angularTrix','ngMessages','720kb.socialshare','hm.readmore','ui.mention', 'uiCropper',
    // jhipster-needle-angularjs-add-module JHipster will add new module here
    'ui.bootstrap', 'ui.router',  'infinite-scroll', 'angular-loading-bar'])
    .run(function ($log, $rootScope, $location, $window, $http, $state, $translate, Language, Auth, Principal, ENV, VERSION) {
        // update the window title using params in the following
        // precendence
        // 1. titleKey parameter
        // 2. $state.$current.data.pageTitle (current state page title)
        // 3. 'global.title'

        var updateTitle = function(titleKey) {
            if (!titleKey && $state.$current.data && $state.$current.data.pageTitle) {
                titleKey = $state.$current.data.pageTitle;
            }
            $translate(titleKey || 'global.title').then(function (title) {
                $window.document.title = title;
            });
        };

        $(document).ready(function(){

            setTimeout(function(){
                $('.page-loading-overlay').addClass("loaded");
                $('.load_circle_wrapper').addClass("loaded");

                //loggit.logSuccess("Welcome to Groovy! Navigate and add songs to your playlists.");


            },1500);

        });

        Principal.identity().then(function(account) {
            $rootScope.account = account;
        });

        $rootScope.ENV = ENV;
        $rootScope.VERSION = VERSION;
        $rootScope.$on('$stateChangeStart', function (event, toState, toStateParams) {
            $rootScope.toState = toState;
            $rootScope.toStateParams = toStateParams;

            if(toState.name == "home"){
                if(Principal.isAuthenticated()){
                    $state.go("stream");
                }
            }

            if (Principal.isIdentityResolved()) {
                Auth.authorize();
            }

            // Update the language
            Language.getCurrent().then(function (language) {
                $translate.use(language);
            });

        });

        $rootScope.$on('$stateChangeSuccess',  function(event, toState, toParams, fromState, fromParams) {
            var titleKey = 'global.title' ;

            if(toState.name == "home"){
                if(Principal.isAuthenticated()){
                    $state.go("stream");
                }
            }

            // Remember previous state unless we've been redirected to login or we've just
            // reset the state memory after logout. If we're redirected to login, our
            // previousState is already set in the authExpiredInterceptor. If we're going
            // to login directly, we don't want to be sent to some previous state anyway
            if (toState.name != 'login' && $rootScope.previousStateName) {
              $rootScope.previousStateName = fromState.name;
              $rootScope.previousStateParams = fromParams;
            }

            // Set the page title key to the one configured in state or use default one
            if (toState.data.pageTitle) {
                titleKey = toState.data.pageTitle;
            }
            updateTitle(titleKey);
        });

        // if the current translation changes, update the window title
        $rootScope.$on('$translateChangeSuccess', function() { updateTitle(); });


        $rootScope.back = function() {
            // If previous state is 'activate' or do not exist go to 'home'
            if ($rootScope.previousStateName === 'activate' || $state.get($rootScope.previousStateName) === null) {
                //$state.go('home');
                $state.go("stream");
            } else {
                $state.go($rootScope.previousStateName, $rootScope.previousStateParams);
            }
        };
    })
    .filter('counter', function() {
        return function(input) {
            var shorted = input;
            if(input >= 1000000){
                shorted = input / 1000000 + "M";
            }
            return shorted;
        };
    })
    .filter('toMinSec', function(){
        return function(input){
            var minutes = parseInt(input/60, 10);
            var seconds = Math.round(input%60);

            return minutes+' minutes'+(seconds ? ' and '+seconds+' seconds' : '');
        }
    })
    .filter('toMinSecNum', function(){
        return function(input){
            var minutes = parseInt(input/60, 10);
            var seconds = Math.round(input%60);

            return minutes+''+(seconds ? ':'+seconds+'' : '');
        }
    })
    .config(function (cfpLoadingBarProvider,$stateProvider, $urlRouterProvider, $httpProvider, $locationProvider, $translateProvider, tmhDynamicLocaleProvider, httpRequestInterceptorCacheBusterProvider, AlertServiceProvider) {
        // uncomment below to make alerts look like toast
        //AlertServiceProvider.showAsToast(true);



        //cfpLoadingBarProvider.spinnerTemplate = '<div><span class="fa fa-spinner">Loading...</div>';
        cfpLoadingBarProvider.includeBar = false;
        cfpLoadingBarProvider.includeSpinner = false;
        //enable CSRF
        $httpProvider.defaults.xsrfCookieName = 'CSRF-TOKEN';
        $httpProvider.defaults.xsrfHeaderName = 'X-CSRF-TOKEN';

        //Cache everything except rest api requests
        httpRequestInterceptorCacheBusterProvider.setMatchlist([/.*api.*/, /.*protected.*/], true);


        $urlRouterProvider.otherwise('/stream');
        $stateProvider.state('site', {
            'abstract': true,
            views: {
                'navbar@': {
                    templateUrl: 'scripts/components/navbar/navbar.html',
                    controller: 'NavbarController'
                }
            },
            resolve: {
                authorize: ['Auth',
                    function (Auth) {
                        return Auth.authorize();
                    }
                ],
                translatePartialLoader: ['$translate', '$translatePartialLoader', function ($translate, $translatePartialLoader) {
                    $translatePartialLoader.addPart('global');
                }]
            }
        });

        $httpProvider.interceptors.push('errorHandlerInterceptor');
        $httpProvider.interceptors.push('authExpiredInterceptor');
        $httpProvider.interceptors.push('notificationInterceptor');
        // jhipster-needle-angularjs-add-interceptor JHipster will add new application interceptor here

        // Initialize angular-translate
        $translateProvider.useLoader('$translatePartialLoader', {
            urlTemplate: 'i18n/{lang}/{part}.json'
        });

        $translateProvider.preferredLanguage('en');
        $translateProvider.useCookieStorage();
        $translateProvider.useSanitizeValueStrategy('escaped');
        $translateProvider.addInterpolation('$translateMessageFormatInterpolation');

        tmhDynamicLocaleProvider.localeLocationPattern('bower_components/angular-i18n/angular-locale_{{locale}}.js');
        tmhDynamicLocaleProvider.useCookieStorage();
        tmhDynamicLocaleProvider.storageKey('NG_TRANSLATE_LANG_KEY');

    })
    // jhipster-needle-angularjs-add-config JHipster will add new application configuration here
    .config(['$urlMatcherFactoryProvider', function($urlMatcherFactory) {
        $urlMatcherFactory.type('boolean', {
            name : 'boolean',
            decode: function(val) { return val == true ? true : val == "true" ? true : false },
            encode: function(val) { return val ? 1 : 0; },
            equals: function(a, b) { return this.is(a) && a === b; },
            is: function(val) { return [true,false,0,1].indexOf(val) >= 0 },
            pattern: /bool|true|0|1/
        });
    }]);
