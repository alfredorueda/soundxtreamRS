 'use strict';

angular.module('soundxtreamappApp')
    .factory('notificationInterceptor', function ($q, AlertService) {
        return {
            response: function(response) {
                var alertKey = response.headers('X-soundxtreamappApp-alert');
                if (angular.isString(alertKey)) {
                    AlertService.success(alertKey, { param : response.headers('X-soundxtreamappApp-params')});
                }
                return response;
            }
        };
    });
