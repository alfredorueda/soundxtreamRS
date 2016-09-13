'use strict';

angular.module('soundxtreamappApp')
    .controller('Song_userController', function ($scope, $state, Song_user, Song_userSearch, $mdToast,ParseLinks) {

        $scope.song_users = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;
        $scope.loadAll = function() {
            Song_user.query({page: $scope.page, size: 6, sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    if(result[i].liked == true){
                        $scope.song_users.push(result[i]);
                    }
                }
            });
        };
        $scope.reset = function() {
            $scope.page = 0;
            $scope.song_users = [];
            $scope.loadAll();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAll();
        };
        $scope.loadAll();


        $scope.search = function () {
            Song_userSearch.query({query: $scope.searchQuery}, function(result) {
                $scope.song_users = result;
            }, function(response) {
                if(response.status === 404) {
                    $scope.loadAll();
                }
            });
        };

        $scope.refresh = function () {
            $scope.reset();
            $scope.clear();
        };

        $scope.clear = function () {
            $scope.song_user = {
                liked: null,
                shared: null,
                likedDate: null,
                sharedDate: null,
                id: null
            };
        };

        $scope.unlike = function(id){
            Song_user.addLike({id: id},{},successLike);
        };

        var successLike = function(result){
            console.log(result);
            //$scope.songDTO.liked = result.liked;
            for(var k = 0; k < $scope.song_users.length; k++){
                if($scope.song_users[k].song.id == result.song.id){
                    $scope.song_users.splice(k,1);
                }
            }

            var resImg = result.song.artwork;
            if(result.liked == false){
                $mdToast.show({
                    template: '<md-toast>'+
                    '<img class="img-toaster" ng-src="'+resImg+'" height="40px" width="40px"/>'+
                    '<span class="md-toast-text" flex>' +
                    '<p class="p_toaster">'+result.song.name+'</p>' +
                    '<small>Was removed from your collection</small>' +
                    '</span>'+
                    '</md-toast>',
                    hideDelay: 1500,
                    position: 'bottom right'
                });
            }
        };
    });
