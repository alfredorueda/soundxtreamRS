'use strict';

angular.module('soundxtreamappApp')
    .directive('myEnter', function () {
        return function (scope, element, attrs) {
            element.bind("keydown keypress", function (event) {
                if(event.which === 13) {
                    scope.$apply(function (){
                        scope.$eval(attrs.myEnter);
                    });

                    event.preventDefault();
                }
            });
        };
    })
    .controller('SongDetailController', function (toaster,Seguimiento,$modal,$scope, $rootScope,$stateParams, entity, Song, User,Song_user,ParseLinks,Comments,Principal,$timeout) {
        $scope.songDTO = entity;
        $scope.load = function (id) {
            Song.get({id: id}, function(result) {
                $scope.song = result;
            });
        };

        entity.$promise.then(function(){
            User.get({login:$scope.songDTO.song.user.login},function(res){
                console.log(res);
                $scope.songDTO.song.user.totalFollowers = res.totalFollowers;
                $scope.songDTO.song.user.totalFollowings = res.totalFollowings;
                $scope.songDTO.song.user.followedByUser = res.followedByUser;
            });
        });



        $scope.follow = function(user){
            $scope.seguimiento = {
                id: null,
                seguidor: null,
                siguiendo: false,
                seguido: null,
                fecha: null
            };
            if($scope.songDTO.song.user.followedByUser) {
                $scope.seguimiento.siguiendo = false;
            }
            else{
                $scope.seguimiento.siguiendo = true;
            }
            $scope.seguimiento.seguido = user;
            Seguimiento.save($scope.seguimiento,function(res){
                if(res.siguiendo == true){
                    $scope.songDTO.song.user.followedByUser = true;
                    $scope.songDTO.song.user.totalFollowers += 1;
                }
                else{
                    $scope.songDTO.song.user.followedByUser = false;
                    $scope.songDTO.song.user.totalFollowers -= 1;
                }
            });
        };

        Principal.identity().then(function(account) {
            $scope.account = account;
            $scope.isAuthenticated = Principal.isAuthenticated;
        });

        $scope.newComment = {
            comment_text: null,
            song: null
        };
        $scope.playlistWithSong = [];
        $scope.comments = [];
        $scope.predicate = 'id';
        $scope.reverse = true;
        $scope.page = 0;

        $scope.tags = [];

        $timeout(function(){
            $scope.loadAllComments();
            Song.getPlaylistWithSong({id:$scope.songDTO.song.id},function(playlists){
                $scope.playlistWithSong = playlists;
            });
        },1000);

        $scope.loadAllComments = function() {
            Song.getComments({id_song:$scope.songDTO.song.id, page: $scope.page, size: 200,
                sort: [$scope.predicate + ',' + ($scope.reverse ? 'asc' : 'desc'), 'id']}, function(result, headers) {
                $scope.links = ParseLinks.parse(headers('link'));
                for (var i = 0; i < result.length; i++) {
                    $scope.comments.push(result[i]);
                }
            });
        };

        $scope.random = function(){
            return 0.5 - Math.random();
        };

        $scope.reset = function() {
            $scope.page = 0;
            $scope.songs = [];
            $scope.loadAllComments();
        };
        $scope.loadPage = function(page) {
            $scope.page = page;
            $scope.loadAllComments();
        };

        $scope.createComment = function(){
            $scope.newComment.song = $scope.songDTO.song;
            $scope.newComment.date_comment = new Date();
            Comments.save($scope.newComment,function(result){
                $scope.comments.push(result);
                $scope.newComment = null;
                toaster.pop('success',$scope.songDTO.song.name,"Your comment was posted");
            });
        };

        var unsubscribe = $rootScope.$on('soundxtreamappApp:songUpdate', function(event, result) {
            $scope.song = result;
        });
        $scope.$on('$destroy', unsubscribe);

        $scope.like = function(id){
            console.log(id);
            Song_user.addLike({id: id},{},successLike);
        };

        var successLike = function(result){
            $scope.songDTO.liked = result.liked;
            if($scope.songDTO.liked){
                $scope.songDTO.totalLikes += 1;
            }
            else{
                $scope.songDTO.totalLikes -= 1;
            }
            if(result.liked == true){
                toaster.pop('success',"Success","Song added to your favorites");
            }
            else{
                toaster.pop('success',"Success","Song removed from your favorites");
            }
        };
        //<img style='padding: 10px;' src='"+$scope.songDTO.song.artwork+"' height='100%' width='100%'/>
        $scope.openModal = function (){
            var modalInstance = $modal.open({
                template: "<img style='padding: 10px;' src='"+$scope.songDTO.song.artwork+"' height='100%' width='100%'/><button type='button' class='close' data-dismiss='modal' aria-hidden='true'>&times;</button>",
                size: "md"
            });
        }

        $scope.showImage = function(image,title){
            var modalInstance = $modal.open({
                template: '<div><h3 style="padding: 5px;">'+title+'</h3><img src='+image+' style="width: 90%; padding: 2.5%;"/></div>',
                size: 'md'
            });
        };


    });
