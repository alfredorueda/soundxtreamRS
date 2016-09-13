'use strict';

angular.module('soundxtreamappApp')
    .controller('MainController', function (ParseLinks,$timeout, $state,$http, tracksApp,$scope,Song_user,$rootScope,Principal,Song,Playlist,Style) {

       // $scope.tracks = [];
        $scope.tracks = tracksApp;
        $scope.playlists = [];

        $http({
            method: 'GET',
            url: 'api/playlistsApp'
        }).then(function successCallback(response) {
            $scope.playlists = response.data;
        });

        tracksApp.$promise.then(function(){

        });

        $scope.styles = [];

        $scope.like = function(id){
            Song_user.addLike({id: id},{},successLike);
        };

        $scope.share = function(id){
            Song_user.share({id: id},{},successShare);
        };

        function successShare(result) {
            console.log(result);

            for(var k = 0; k < $scope.tracks.length; k++){
                if($scope.tracks[k].song.id == result.song.id){
                    $scope.tracks[k].shared = result.shared;
                    if($scope.tracks[k].shared){
                        $scope.tracks[k].totalShares += 1;
                    }
                    else{
                        $scope.tracks[k].totalShares -= 1;
                    }
                }
            }
            if(result.shared == true){
                toaster.pop('success',"Success","Song shared to your followers");
            }
        }

        var successLike = function(result){
            console.log(result);
            //$scope.songDTO.liked = result.liked;
            for(var k = 0; k < $scope.tracks.length; k++){
                if($scope.tracks[k].song.id == result.song.id){
                    $scope.tracks[k].liked = result.liked;
                    if($scope.tracks[k].liked){
                        $scope.tracks[k].totalLikes += 1;
                    }
                    else{
                        $scope.tracks[k].totalLikes -= 1;
                    }
                }
            }
            if(result.liked == true){
                toaster.pop('success',"Success","Song added to your favorites");
            }

        };

    })
    .directive('mentionExample', function () {
        return {
            require: 'uiMention',
            link: function link($scope, $element, $attrs, uiMention) {
                /**
                 * $mention.findChoices()
                 *
                 * @param  {regex.exec()} match    The trigger-text regex match object
                 * @todo Try to avoid using a regex match object
                 * @return {array[choice]|Promise} The list of possible choices
                 */
                uiMention.findChoices = function (match, mentions) {
                    return choices
                    // Remove items that are already mentioned
                        .filter(function (choice) {
                            return !mentions.some(function (mention) {
                                return mention.id === choice.id;
                            });
                        })
                        // Matches items from search query
                        .filter(function (choice) {
                            return ~(choice.first + ' ' + choice.last).indexOf(match[1]);
                        });
                };
            }
        };
    });
var choices = [{ first: 'bob', last: 'barker', id: 11123 }, { first: 'kenny', last: 'logins', id: '123ab-123' }, { first: 'kyle', last: 'corn', id: '123' }, { first: 'steve', last: 'rodriguez', id: 'hi' }, { first: 'steve', last: 'holt', id: '0-9' }, { first: 'megan', last: 'burgerpants', id: 'ab-' }];
