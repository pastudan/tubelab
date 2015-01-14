var plid;
var playlist = new Array();
var searchlist;
var playlist_update = new Array();
var search_counter = 0;
var was_fullscreen = 0;
var player;
var $curtime;
var $totaltime;
var $timetooltip;
var $seektooltip;
var $sortable_playlist;
var $sortable_searchlist;
var starttime;
var curplaying;



//todo: take this out!
$(document).keypress(function(e){

    switch (e.which) {
        case 113:
            $(".collaborate").toggle();
            break;
    }
});

$(document).ready(function (){

    $(".collaborate .qr").qrcode({
        text : "tubelab.net/bbq1/2822",
        minVersion: 4,
        ecLevel: 'H',
        fill: "#262626",
        size: 500,
        radius: 0.5,
        mode: 2, //label box
        mSize: 0.11,
        mPosX: 0.5,
        mPosY: 0.5,
        label: 'Be the DJ.',
//                label: 'Share. Mix.',
//                label: 'Take Control.',
        fontname: 'Verdana',
        fontcolor: '#AE0000'
    }).children("canvas").height(250);



    $('#fullscreen').click(function () {
        if (screenfull.enabled) {
            screenfull.request();
        }
        $("#search_container").animate({"left":"0", "width":"0"});
        $("#playlist_container").animate({"right":"0", "width":"0"});
        resize();
    });

    var params = { allowScriptAccess: "always" };
    var atts = { id: "player" };
    swfobject.embedSWF("//www.youtube.com/apiplayer?enablejsapi=1&version=3", "ytapiplayer", "4", "4", "8", null, null, params, atts);

    $curtime = $("#curtime");
    $totaltime = $("#totaltime");
    $progress = $("#progress");
    $loaded = $("#loaded");
    $timetooltip = $("#timetooltip");
    $seektooltip = $("#seektooltip");
    $sortable_playlist = $("#sortable_playlist");
    $sortable_searchlist = $('#sortable_searchlist');

    resize();
    plid = document.URL.split('/')[3].split('?')[0];

    $(window).resize(resize);


//<!--            TODO: replace with slimscroll http://rocha.la/jQuery-slimScroll -->


    $("#search_container,#playlist_container").hover(function (){
        $(this).css('overflow', 'auto');
    }, function (){
        $(this).css('overflow', 'hidden');
    });


    $("#playpause").click(function(){
        if (player.getPlayerState() == 1){
            player.pauseVideo();
        } else if(player.getPlayerState() == 2) {
            player.playVideo();
        }
    });

    $("#seek").mousemove(function (e){
        timecode = formatTime((e.pageX - $(this).offset().left) / 648 * player.getDuration());
        $timetooltip.show().html(timecode).css({
            top: (e.pageY + 11) + "px",
            left: (e.pageX + 15) + "px"
        });
        $seektooltip.show().css({
            left: (e.pageX - $(this).offset().left - 1) + "px"
        });
    }).mouseleave(function(){
        $timetooltip.hide();
        $seektooltip.hide();
    }).click(function (e){
        starttime = Math.round((e.pageX - $(this).offset().left) / 648 * player.getDuration());
        player.seekTo(starttime, true);
        $progress.width(3);
    });

});

function getCookie(name) {
    var parts = document.cookie.split(name + "=");
    if (parts.length == 2) return parts.pop().split(";").shift();
}

function formatTime(seconds){
    seconds = Math.round(seconds);
    minutes = Math.floor(seconds/60);
    seconds = Math.round(seconds%60);
    seconds = (seconds<10) ? "0" + seconds : seconds;
    return minutes + ":" + seconds;
}

function onYouTubePlayerReady(playerId) {
    player = document.getElementById('player');
    player.addEventListener("onStateChange", "playerStateChange");
    setInterval(updateInfo, 150);
    resize();
}

function playerStateChange(state){
    if (state == 0){
        //video has ended.. go to next in playlist..
        //console.log('opening next video....');
        var scope = angular.element($("html")).scope();
        scope.playNext();
    }
}

function updateInfo(){
    curtime = player.getCurrentTime();
    duration = player.getDuration();
    loaded = player.getVideoBytesLoaded();
    totalsize = player.getVideoBytesTotal();
    startbytes = player.getVideoStartBytes();
    $curtime.html(formatTime(curtime));
    $totaltime.html(formatTime(duration));
    $progress.width((curtime-starttime)/duration*648);
    $progress.css("left", (starttime/duration*648));
    $loaded.width(loaded/totalsize*648);
    $loaded.css("left", (startbytes/totalsize*648));
}

function resize(){

    browser = $.browser;
    /* var is_fullscreen = ( //browser check
     window.fullScreen || //firefox -- that was easy :D
     ((browser.webkit || (browser.msie && browser.version > 8)) && screen.width == window.outerWidth && screen.height == window.outerHeight) || //chrome & ie9+ (think this works for ie9...not sure yet)
     (browser.msie && browser.version <= 8 && (screen.height-document.documentElement.clientHeight) < 30)); //iesuck */
    var is_fullscreen = screenfull.isFullscreen;

    /*			if (is_fullscreen){
     $('#player').css({
     'position' : 'absolute',
     'left' : '0px',
     'top' : '0px',
     'margin' : '0',
     'width' : $(window).width(),
     'height' : $(window).height()
     });
     //$('#player').width();
     //$('#player').height();
     } else {
     $('#info').html('Normal Mode.');
     $('#player').css({
     'left' : 'auto',
     'top' : 'auto',
     'margin' : 'auto',
     'width' : '623',
     'height' : '384'
     });
     }
     */

    var viewportWidth  = $(window).width()
    , viewportHeight = $(window).height()

    //use 3/5ths screen space to display video and controls. maybe let users set this in the future
    var max_player_height = ((viewportHeight * 3 / 5) - 92);
    var player_height = (max_player_height > 438) ?  438 : max_player_height;
    var player_width = player_height * 16 / 9;

    var offset;

    if (viewportHeight < 280){
        //no video
        $("#player_spotlight").css({'margin-left':'10000px', 'height':'1px'});
        offset = 52;
    } else if (viewportHeight < 600){
        //slim video
        $("#player_spotlight").css('padding','5px').css({'margin':'0 auto', 'height':'auto'});
        $("#player_container_border").css({'padding':'0','border':'0'});
        offset = 53 + player_height;
    } else if (viewportHeight > 600 && !is_fullscreen) {
        //full video
        $("#player_spotlight").css('padding','15px 0 15px 0').css({'margin':'0 auto', 'height':'auto'});
        $("#player_container_border").css('padding','9px 9px 8px 9px');
        offset = 94 + player_height;
    } else {
        //$("#player_spotlight").hide();
        $("#player_spotlight").find("*").addBack().css({"padding":"0", "margin":"0", "border":"0"});
        $("#container").css("margin", "0");
        player_height = viewportHeight;
        player_width = viewportWidth;
    }
    $("#player_container").height(player_height).width(player_width);
    $("#player").height(player_height).width(player_width+2);
    $("#player_container_border").width(player_width+2);
    //var list_height = viewportHeight - offset - 10
    $("#search_container,#playlist_container").height(viewportHeight - offset - 10);
    //$("#playlist_container").height(viewportHeight - offset - 10);
    ul_height = viewportHeight - offset - 10 - 52;

    //TODO: use facebook style auto-hiding scrollbars
//			if ((playlist.length * 42) < ul_height){
//				//console.log("setting UL height to "+ul_height);
//				$("#sortable_playlist").height(ul_height);
//			} else {
//				//console.log("setting UL height to auto");
//				$("#sortable_playlist").height('auto');
//			}


}

function updatePlaylist(e){
    console.log($("#sortable_playlist li"));
    i=0;
    playlist_order = $("#sortable_playlist").sortable('toArray');
    //console.log(playlist_order);
    playlist = new Array();
    for (i in playlist_order){
        ////console.log(String($("#"+playlist_order[i]+" a").attr("onclick")).split("'")[1]);
        playlist.push({
            ext_id: $("#"+playlist_order[i]+" a").attr("rel"),
            title: $("#"+playlist_order[i]+" .vid_item_title").html()
        });
    }
    //console.log(playlist);
    $("#sortable_playlist li").each(function (index, value){
        ////console.log("setting " + $(this).attr('id'));
        //console.log(value);
        //$(this).attr("onclick", "openVideo('playlist', "+index+"); return false;");
        $(this).click(function(){
            openVideo('playlist', index);
            return false;
        });
        //TODO: THIS IS REALLY SHITTY CODING BECAUSE I AM DRUNK! REVIEW IT
    });
    $.ajax({
        url: "ajax.php",
        type: 'POST',
        data: {method: 'update', plid: plid, playlist: playlist},
        success: function(data){
            //console.log(data);
            $("#url").html("tubelab.net/"+data);
            plid = data;
            history.pushState({plid: 'data'}, data, data);
            //alert the user somehow
        }
    });
    resize();
}

function openVideo(list_type, id){
    //a little bit of youtube hd trickery for 2 seconds.
    //$("#player").width(1920);
    //$("#player").height(1080);
    //$("#player").css('left','10000px');
    switch(list_type){
        case 'searchlist':
            ext_id = searchlist[id].ext_id;
            title = searchlist[id].title;
            break;
        case 'playlist':
            ext_id = playlist[id].ext_id;
            title = playlist[id].title;
            break;
        default:
            alert('You broke the tubes!');
    }
    player.loadVideoById(ext_id, 0, "hd720");

    title = title.split('-');
    artist = title.shift();
    track = title.join('-');

    starttime = 0;
    $("#curplaying").html('<div class=mf>'+track+'</div><div class="sf gray">'+artist+'</div>');
    //TODO do some logic to determine if next video title needs to be updated (if its actually next) or not (if it's more than 1 away)
    $("#upnext").html('<div class=mf>'+track+'</div><div class="sf gray">'+artist+'</div>');
    curplaying = {list_type: list_type, id: id};
    //TODO using above said logic... update nextplaying variable to be from searchlist or playlist... then we can check that on the video end.
}






//Angular, yay!


var app = angular.module('sortableApp', ['ui.sortable']);

app.factory('socket', function ($rootScope) {
    var socket = io.connect('//' + config.socket_host);
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

    $scope.currentlyPlayingIndex = 0;
    $scope.currentlyPlaying;
    $scope.clients = [];

    $scope.muteVideo = (location.search.split('mute=')[1]||'').split('&')[0];

    socket.on('connect', function () {
        socket.emit('client:authenticate', {
            plid: document.URL.split('/')[3].split('?')[0],
            pin: document.URL.split('/')[4].split('?')[0],
            cookie: getCookie('tubelab'),
            version: version
        });
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
            title:'Timestretch - Bassnectar',
            ext_id:'5M-jOZRe0-8'
        }
    ];



    $scope.sortableOptions = {
        revert: 100,
        helper: "clone",
        placeholder: "ui-state-highlight",
        connectWith: ".sortable"
    };

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

    $scope.$watch('query', function() {
        socket.emit('search:query', {
            query: $scope.query
        });
    });

    socket.on('search:results', function(data){
        //TODO: !! race condition can present a problem.. make sure most recent result set is displayed
        $scope.results = data;
    });

    socket.on('playlist:sync', function(data){
        $scope.externalChange = true;
        $scope.playlist = data;
    });

    socket.on('playlist:play', function(data){
        //todo: get the index from mobile so we can play next
        $scope.openVideo(data.video, data.index);
    });

    socket.on('playlist:toggleplayback', function(data){
        $scope.isPlaying = data;
        if (data){
            player.playVideo();
        } else {
            player.pauseVideo();
        }
    });

    $scope.openVideo = function(videoObject, index) {
        if (typeof index !== 'undefined'){
            $scope.currentlyPlayingIndex = index;
            console.log("Playing "+index+"th video from playlist!")
        } else {
            console.log("Playing video from search or other unindexed source")
        }
        $scope.currentlyPlaying = videoObject;
        player.loadVideoById(videoObject.ext_id, 0, "hd720");
        socket.emit('playlist:playing', {
            playing: videoObject,
            index: index
        });
    };

    $scope.remoteOpenVideo = function(result, index) {
        console.log(result)
        socket.emit('playlist:play', {
            video: result,
            index: index
        });

        //todo: perhaps put the "playing" logic inside of "play". "playing" is only used for mobile anyway
        socket.emit('playlist:playing', {
            playing: result,
            index: index
        });

        $scope.currentlyPlaying = result;
        player.loadVideoById(result.ext_id, 0, "hd720");
    };

    $scope.playNext = function() {
        var index = $scope.currentlyPlayingIndex + 1;
        $scope.openVideo($scope.playlist[index], index);
    };

});