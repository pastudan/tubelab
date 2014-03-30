<?php
    $version = "0.1";
    require_once 'Mobile-Detect/Mobile_Detect.php';
    $detect = new Mobile_Detect;
    if ($detect->isMobile()){
        ?>
        <!DOCTYPE html>
        <html>
        <head>
            <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport' />
            <meta name="viewport" content="width=device-width" />
            <script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
            <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>
            <script>
                plid = document.URL.split('/')[3];
                pin = document.URL.split('/')[4];

                version = "<?php echo $version; ?>";
                var socket = io.connect('http://tubelab.net:8888');


                function getCookie(name) {
                    var parts = document.cookie.split(name + "=");
                    if (parts.length == 2) return parts.pop().split(";").shift();
                }

                socket.on('connect', function () {
                    socket.emit('authenticate', {
                        plid: plid,
                        pin: pin,
                        //cookie: getCookie('tubelab'),
                        version: "<?php echo $version; ?>"
                    });
                });

                socket.on('control', function (data) {
                    console.log(data);
                });

                $(document).ready(function(){

                    $(".control").click(function(){
                        var action = $(this).data("action");
                        socket.emit("control", {
                            controlAction: action
                        });
                    });
                });
            </script>
        </head>
        <body>
            <div class="control" data-action="prev">
                PREV
            </div>
            <div class="control" data-action="play-pause">
                Play / Pause
            </div>
            <div class="control" data-action="next">
                NEXT
            </div>
            <style>
                html{

                    height: 100%;
                }
                body{
                    padding: 5px;
                    margin: 0;
                    width: 100%;
                    height: 100%;
                }
                .control{
                    border: 10px solid white;
                    padding: 3%;
                    float: left;
                    background: green;
                    color: white;
                    font-weight: bold;
                    font-size: 50px;

                }
            </style>
        </body>
        </html>

        <?php
        die();
    }

	require("functions.php");
	dbconnect();
	
	if(!isset($_COOKIE["tubelab"])){
		$_COOKIE["tubelab"] = $user_string = rand_string(12);
		setcookie('tubelab', $user_string, 2116303200);
		add_user($user_string, $_SERVER['REMOTE_ADDR']);
	}

	add_action('main_page_load');
	
	//TODO: share should look at user-agent for something like this: 
	// facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
	//
	// if so, display some relevent information. 
	//facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)

	
	$ua = $_SERVER['HTTP_USER_AGENT'];
	if ($ua == "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"){
		?>
		<html> 
		<head>
			<title>TubeLab</title>
			<meta property="og:title" content="TubeLab" />
			<meta property="og:description" content="A video playlist including Skrillex, and 7 others..." />
			<meta property="og:image" content="http://tubelab.net/images/facebook98347298374.jpg" />
		</head>
		<body>
			<p>A video playlist including Skrillex, and 7 others...</p>
		</body>
		</html>
		<?php
		die();
	}

?>
<!DOCTYPE html>
<html> 
<head>
	<title>TubeLab</title>
	<link rel="shortcut icon" href="/images/favicon.png" />
	<link rel="stylesheet" type="text/css" media="all" href="/global.css">
	<link rel="stylesheet" type="text/css" media="all" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.min.css">
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/swfobject/2.2/swfobject.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/screenfull.js/1.0.4/screenfull.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.0.14/jquery.jscrollpane.min.js"></script>
	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular-wizard/0.3.0/angular-wizard.min.js"></script>
    <script src="/scripts/typewatch.js"></script>
    <script src="/scripts/jquery.qrcode-0.7.0.min.js"></script>

    <script>

        //todo: take this out!
        $(document).keypress(function(e){

            switch (e.which) {
                case 113:
                    $(".collaborate").toggle();
                    break;
            }
        });



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
        var deviceCount = 0;

        var socket = io.connect('http://tubelab.net:8888');
        socket.on('connect', function () {
            socket.emit('authenticate', {
                plid: document.URL.split('/')[3],
                pin: document.URL.split('/')[4],
                cookie: getCookie('tubelab'),
                version: "<?php echo $version; ?>"
            });
        });
        socket.on('client-announce', function (data) {
            $(".collaborate").addClass("active-devices");
            deviceCount++;
            $(".collaborate .device-list ul").prepend("<li>Device "+deviceCount+"</li>");
//                .animate({
//                width: newWidth+"px",
//                left: newLeft+"px"
//            }, function(){
//                $(".device-list").fadeIn();
//                $(this).css({
//                    left: "calc(50% - "+newWidth+"px/2)"
//                });
//            });
//            setTimeout(function(){
//                $(".device-list").show().animate({
//                    width: "280px"
//                });
//            }, 10);
            $('audio')[0].play();
        });
        socket.on('control', function (data) {
            //alert(data.controlAction);
            console.log(data);
//            $(".control[data-action=prev]").animate({paddingTop: "0"}, 200, function(){
//                $(this).css("padding-top", "3%")
//            });
            switch (data.controlAction){
                case "next":
                    openVideo(curplaying.list_type, curplaying.id+1);
                    break;
                case "prev":
                    openVideo(curplaying.list_type, curplaying.id-1);
                    break;
                case "play-pause":
                    if (player.getPlayerState() == 1){
                        player.pauseVideo();
                    } else if(player.getPlayerState() == 2) {
                        player.playVideo();
                    }
                    break;
                default:
                    console.log("received command not understood");
            }

        });

		$(document).ready(function (){
//
//            plid = document.URL.split('/')[3];
//            pin = document.URL.split('/')[4];
//            socket.emit("browserConfirm", {
//                plid: plid,
//                pin: pin
//            });
//            socket.on('phoneConnect', function (data) {
//                $("body").append(JsonHuman.format(data));
//            });


            $(".collaborate .qr").qrcode({
                text : "tubelab.net/abcd/1234",
                minVersion: 4,
                ecLevel: 'H',
                fill: "#262626",
                size: 500,
                radius: 0.5,
                mode: 2, //label box
                mSize: 0.11,
                mPosX: 0.5,
                mPosY: 0.5,
//                label: 'Be the DJ.',
                label: 'Share. Mix.',
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
			swfobject.embedSWF("http://www.youtube.com/apiplayer?enablejsapi=1&version=3", "ytapiplayer", "4", "4", "8", null, null, params, atts);

			$curtime = $("#curtime");
			$totaltime = $("#totaltime");
			$progress = $("#progress");
			$loaded = $("#loaded");
			$timetooltip = $("#timetooltip");
			$seektooltip = $("#seektooltip");
			$sortable_playlist = $("#sortable_playlist");
			$sortable_searchlist = $('#sortable_searchlist');

			resize();
			plid = document.URL.split('/')[3];
			$sortable_playlist.sortable({ helper: 'clone', placeholder: "ui-state-highlight", connectWith: ".sortable", update: updatePlaylist }).disableSelection();
			$sortable_searchlist.sortable({ helper: 'clone', placeholder: "ui-state-highlight", connectWith: ".sortable" }).disableSelection();
			if (plid != ''){
				//console.log('plid found... ');
				$("#url").html("tubelab.net/"+plid);
				$.ajax({
					url: "ajax.php",
					type: 'POST',
					data: {method: 'get', plid: plid},
					success: function(data){
						playlist = $.parseJSON(data);
//						for(i=0;i<playlist.length;i++){
//							title = playlist[i].title.split("-");
//							artist = title.shift();
//							track = title.join('-');
//							$sortable_playlist.append("<li id='video"+i+"'><a class='vid_item_link' style='clear:both;' rel='"+playlist[i].ext_id+"' onclick=\"openVideo('playlist',"+i+"); return false;\"><div class='vid_item'><div class='thumb'><img src='http://img.youtube.com/vi/"+playlist[i].ext_id+"/default.jpg' \></div><div class='vid_item_title'>"+playlist[i].title+"</div></div></a></li>");
//						}
						//$sortable_playlist.sortable({ helper: 'clone', placeholder: "ui-state-highlight", connectWith: ".sortable", update: updatePlaylist }).disableSelection();
						//$sortable_searchlist.sortable({ helper: 'clone', placeholder: "ui-state-highlight", connectWith: ".sortable" }).disableSelection();
//						openVideo('playlist', 0);
						resize();
					}
				});
			} else {
				//console.log('no plid found...');
			}
			$("#search").typeWatch({
                //TODO this doesn't need a plugin.. come on
				callback:search,
				wait:250
			});
			$(window).resize(resize);


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
				//video is ended.. go to next in playlist..
				//openVideo("tKi9Z-f6qX4");
				//console.log('opening next video....');
				openVideo(curplaying.list_type, curplaying.id+1);
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

		function search(){
			search_counter += 1;
			var temp_search_count = search_counter;
			q = $("#search").val();
			$.ajax({
				url: "ajax.php",
				type: 'POST',
				data: {method: 'search', q:q, plid: plid, start:1},
				success: function(data){
					if (temp_search_count == search_counter){
						results = $.parseJSON(data);
						$sortable_searchlist = $("#sortable_searchlist");
						$sortable_searchlist.empty();
						searchlist = new Array();
						for(i=0;i<results.length;i++){
							//on the li id put the search number, so we don't get the playlsit confused
							//addPlaylistItem('search'+temp_search_count, results[i].ext_id, results[i].title);
							//title = results[i].title.split('-');
							//artist = title.shift();
							//track = title.join('-');
							searchlist.push({
								title:results[i].title,
								ext_id:results[i].ext_id
							});
							$sortable_searchlist.append("<li id='search_"+temp_search_count+"_"+i+"'><a class='vid_item_link' style='clear:both;' rel='"+results[i].ext_id+"' onclick=\"openVideo('searchlist',"+i+"); return false;\"><div class='vid_item cf'><div class='thumb'><img src='http://img.youtube.com/vi/"+results[i].ext_id+"/default.jpg' \></div><div class='vid_item_title'>"+results[i].title+"</div>"+(results[i].subtitle?"<div class='sf gray subtitle'>"+results[i].subtitle+"</div>":"")+"</div></a></li>");
						}
					}
				}
			});
		}
	</script>
</head> 


<body>
<!--    <a href="https://github.com/pastudan/tubelab"><img class="github-banner" src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub"></a>-->


    <div class="collaborate">
        <h1>Collaborate</h1>
        <p>Let friends help create a killer playlist. Or, just <a href="">share.</a></p>

        <div class="share-container">
            <div class="url">tubelab.net/ei3k/2402</div>
            <div class="qr"></div>
            <div class="or">or</div>
        </div>

        <div class="device-list">
            <h3>Devices</h3>
            <ul></ul>
            <div class="action">Done</div>
        </div>

        <audio>
            <source src="sounds/smw_1-up.wav" type="audio/mpeg">
            Your browser does not support the audio element.
        </audio>
    </div>

	<div id="container" class="cf">
		<div id="timetooltip" class="sf"></div>
		<div id="player_spotlight">
			<div id="player_container_border">
				<div id="player_container">

					<div id="ytapiplayer">
						You need Flash player 9+ and JavaScript enabled to view this video.
					</div>

				</div>
			</div>
		</div>
		
		<div id="controls">
			<div id="playpause" class="lg_button"></div>
			<div id="time_container" class="sf">
				<div id="curtime"></div>
				<div id="totaltime"></div>
			</div>
			<div id="seek">
				<div id="loaded"></div>
				<div id="progress"></div>
				<div id="seektooltip"></div>
			</div>
			<div id="fullscreen" class="lg_button"></div>
			<div id="logo">
				<img width="91" height="15" src="images/logo.png" \>
				<div style="font-size: 11px;"><a href="#">About</a> | <a href="#">Contact</a></div>
			</div>
			<div id="curplaying"></div>
			<div id="upnext"></div>
		</div>
		
		<div id="search_container"  class="list_container">
			<div id="search_controls" class="list_controls">
				<h2 class="tab_label left-tab">Search</h2>
				<div class="input_container left-tab">
					<input id="search" type="text" />
				</div>
			</div>
			<ul id='sortable_searchlist' class='sortable'>
<!--                <li ng-repeat="todo in todos"></li>-->
			</ul>
		</div>
		
		<div id="playlist_container" class="list_container">
			<div id="playlist_controls" class="list_controls">
				<h2 class="tab_label right-tab">Public URL</h2>
				<a href="index.html" class="save-playlist">Save Playlist(s)</a>
				<div class="input_container right-tab cf">
                    <div id="globe-container">
                        <img src="images/globe_24.png" />
                    </div>
                    <div id="url">
                        tubelab.net/start
                    </div>
				</div>
			</div>
			<ul id='sortable_playlist' class='sortable'></ul>
		</div>
		
	</div>
</body>


</html>
