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
//                                        element[0].focus();

                        $(element[0]).focus();
                    });
                    window.setTimeout(function(){
                        $(element[0]).click();
                    },2000)
                }
            });
            // on blur event:
            element.bind('blur', function() {
                console.log('blur');
                scope.$apply(model.assign(scope, false));
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

    $scope.clients = []

    socket.on('connect', function () {
        socket.emit('client:authenticate', {
            plid: document.URL.split('/')[3],
            pin: document.URL.split('/')[4],
            cookie: getCookie('tubelab'),
            version: "<?php echo $version; ?>"
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

    socket.on('playlist:add', function (data) {

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
        {
            title:'PL learn angular',
            ext_id:'bFClhxM7LY4',
            subtitle: 'panda video!'
        },
        {
            title:'PL tim mcgraw',
            ext_id:'bFClhxM7LY4'
        },
        {
            title:'PL stuff',
            ext_id:'bFClhxM7LY4'
        },
        {
            title:'PL blah',
            ext_id:'bFClhxM7LY4'
        }
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
    });



    $scope.remoteOpenVideo = function(result) {
        socket.emit('playlist:play', {
            ext_id: result.ext_id
        });
    };

});