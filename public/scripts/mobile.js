function getCookie(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

$(document).ready(function(){

    $(".menu-bars").click(function(){
        $(".main-panel").toggleClass("menu-revealed");
    });
});


var app = angular.module('sortableApp', []);

app.directive('focusMe', function($timeout, $parse) {
    return {
        //scope: true,   // optionally create a child scope
        link: function(scope, element, attrs) {
            var model = $parse(attrs.focusMe);
            scope.$watch(model, function(value) {
                if(value === true) {
                    $timeout(function() {
                        $(element[0]).select();
                    });
                }
            });
        }
    };
});

app.factory('socket', function ($rootScope) {
    var socket = io.connect('//tubelab.net:8888');
    return {
        on: function (eventName, callback) {
            socket.on(eventName, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    callback.apply(socket, args);
                });
            });
        },
        emit: function (eventName, data, callback) {
            socket.emit(eventName, data, function () {
                var args = arguments;
                $rootScope.$apply(function () {
                    if (callback) {
                        callback.apply(socket, args);
                    }
                });
            })
        }
    };
});

app.controller('ResultsCtrl', function ($scope, socket) {

    // These are not necessarily the same thing.. if you temporarily play a search video, then it won't have a playlist index
    $scope.currentlyPlayingIndex = 0;
    $scope.currentlyPlaying;
    $scope.isPlaying = true; // TODO: this needs to be initialized by the node app.

    $scope.clients = []

    socket.on('connect', function () {
        socket.emit('client:authenticate', {
            plid: document.URL.split('/')[3],
            pin: document.URL.split('/')[4],
            cookie: getCookie('tubelab'),
            version: version
        });
    });

    $scope.$watch('query', function() {
        socket.emit('search:query', {
            query: $scope.query
        });
    });

    socket.on('search:results', function(data){
        //TODO: !! race condition can present a problem.. make sure most recent result set is displayed
        $scope.results = data;
    });

    socket.on('client:add', function (data) {

        var subtext;
        if (data.model){
            subtext = data.model
        } else {
            subtext = data.browser.name
        }

        var icon;

        console.log(data.os.name)
        switch (data.os.name) {
            case "iOS":
                icon = "apple"
                break;
            case "Android":
                icon = "android"
                break;
            case "Windows Phone":
                icon = "windows"
                break;
            default:
                icon = "desktop"
                break;
        }

        data.icon = icon;
        data.subtext = subtext;

        $scope.clients.push(data);
        console.log($scope.clients)

        $('audio')[0].play();

    });

    $scope.playlist = [
    ];


    $scope.$watch('playlist', function(newValue, oldValue) {
        //skip this logic if the change was caused by another client.
        if ($scope.externalChange) {
            $scope.externalChange = false;
            return;
        }

        socket.emit('playlist:sync', {
            playlist: $scope.playlist
        });
//                for(i=0; i<newValue.length; i++){
//                    //TODO: diff the old playlist with the new, find what changed, and only send that.
//                    // ALSO hash the playlist, compare with hash from server, and figure out if we need to re-sync.
//                }
    }, true);


    socket.on('playlist:sync', function(data){
        $scope.externalChange = true;
        $scope.playlist = data;
        console.log(data)
    });

    socket.on('playlist:toggleplayback', function(data){
        $scope.isPlaying = data;
    });

    socket.on('playlist:playing', function(data){
        $scope.currentlyPlayingIndex = data.index;
        $scope.currentlyPlaying = {
            title: data.playing.title.split(' - ')[1],
            artist: data.playing.title.split(' - ')[0]
        }
        if (!data.playing.stored){
            //todo: clean this up
            // if it's a fresh request, flip the pause boolean
            $scope.isPlaying = true;
        }
    });

    $scope.remoteOpenVideo = function(result, index) {
        console.log(result)
        socket.emit('playlist:play', {
            video: result,
            index: index
        });
        $scope.showSearchField = false;
        $scope.showAddPlayDialog = false;
    };

    $scope.addOrPlay = function(result) {
        $scope.showSearchField = false;
        $scope.showAddPlayDialog = true;
        $scope.selected_result = result;
    };

    $scope.addVideo = function(result) {
        $scope.playlist.push(result);
        $scope.showAddPlayDialog = false;
        $(".playlist-wrapper").animate({scrollTop:$(".playlist-wrapper")[0].scrollHeight}, 1000);
    }

    $scope.playNext = function() {
        var index = $scope.currentlyPlayingIndex + 1;
        $scope.remoteOpenVideo($scope.playlist[index], index);
    };

    $scope.togglePlayback = function(){
        $scope.isPlaying = !$scope.isPlaying;
        socket.emit('playlist:toggleplayback', $scope.isPlaying);
    }

});