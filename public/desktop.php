<!doctype html>
<html ng-app="sortableApp" ng-controller="ResultsCtrl">
<head>
    <title>TubeLab</title>
    <link rel="shortcut icon" href="/images/favicon.png"/>
    <link rel="stylesheet" type="text/css" media="all" href="/reset-clearfix.css">
    <link rel="stylesheet" type="text/css" media="all" href="/styles/desktop.css">
    <link rel="stylesheet" type="text/css" media="all" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.min.css">

    <!--IF PROD-->
    <!--	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>-->
    <!--	<script src="//cdnjs.cloudflare.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>-->
    <!--    <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.10/angular.min.js"></script>-->
    <!--    <script src="/scripts/angular-ui-sortable.js"></script>-->
    <!--  ^  TODO: put in cdnjs-->
    <!--	<script src="//cdnjs.cloudflare.com/ajax/libs/swfobject/2.2/swfobject.min.js"></script>-->
    <!--	<script src="//cdnjs.cloudflare.com/ajax/libs/screenfull.js/1.0.4/screenfull.min.js"></script>-->
    <!--	<script src="//cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.0.14/jquery.jscrollpane.min.js"></script>-->
    <!--	<script src="//cdnjs.cloudflare.com/ajax/libs/jquery.qrcode/1.0/jquery.qrcode.min.js"></script>-->
    <!--    <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>-->
    <!--    <script src="/scripts/jquery.qrcode-0.7.0.min.js"></script>-->
    <!--/IF PROD-->

    <!--IF DEV-->
    <script src="/scripts/cdn/jquery.min.js"></script>
    <script src="/scripts/cdn/jquery-ui.min.js"></script>
    <script src="/scripts/cdn/angular.min.js"></script>
    <script src="/scripts/angular-ui-sortable.js"></script>
    <script src="/scripts/cdn/swfobject.min.js"></script>
    <script src="/scripts/cdn/screenfull.min.js"></script>
    <script src="/scripts/cdn/jquery.jscrollpane.min.js"></script>
    <script src="/scripts/cdn/jquery.qrcode.min.js"></script>
    <script src="/scripts/cdn/socket.io.min.js"></script>
    <script src="/scripts/jquery.qrcode-0.7.0.min.js"></script>
    <!--/IF DEV-->
    <script>
        version = "<?php echo $version; ?>";
    </script>
    <script src="/scripts/config.js"></script>
    <script src="/scripts/desktop.js"></script>
</head>


<body>
<!--    <a href="https://github.com/pastudan/tubelab"><img class="github-banner" src="https://s3.amazonaws.com/github/ribbons/forkme_right_red_aa0000.png" alt="Fork me on GitHub"></a>-->


<div class="collaborate" ng-class="{'active-devices':clients.length>0}">
    <h1>Collaborate</h1>

    <p>Let your friends help create an awesome playlist. Or just <a href="#">share.</a></p>

    <div class="share-container">
        <div class="url">tubelab.net/bbq1/2822</div>
        <div class="qr"></div>
        <div class="or">or</div>
    </div>

    <div class="device-container">
        <h3>Devices</h3>
        <ul class="device-list">
            <li class='cf' ng-repeat="client in clients">
                <i class='fa fa-fw fa-{{client.icon}} fl'
                   style='font-size: 38px; color: #1D1D1D; margin-right: 15px'></i>

                <div class='fl'>
                    <div style='font-size: 20px; color: #1D1D1D; font-weight: bold;'>
                        {{client.name}}
                    </div>
                    <div style='font-size: 12px; color: #ebeae8; max-width:170px'>
                        {{client.subtext}}
                    </div>
                </div>
                <div class="delete">
                    DROPDOWN: {delete, view only}
                    <i class="fa fa-times-circle"></i>
                </div>
            </li>
        </ul>
        <div class="action">Done</div>
    </div>

    <audio>
        <source src="sounds/smw_1-up.wav" type="audio/mpeg">
        Your browser does not support HTML5 audio.
    </audio>
</div>

<div id="container" class="cf">
    <div id="timetooltip" class="sf"></div>
    <div id="player_spotlight" ng-show="!muteVideo">
        <div id="player_container_border">
            <div id="player_container" ng-mouseenter="showMuteButton=true" ng-mouseleave="showMuteButton=false">
                <div class="mute-video" ng-show="showMuteButton" ng-click="muteVideo = !muteVideo">Mute Video</div>

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

    <div id="search_container" class="list_container">
        <div id="search_controls" class="list_controls">
            <h2 class="tab_label left-tab">Search</h2>

            <div class="input_container left-tab">
                <input id="search" type="text" ng-model="query"/>
            </div>
        </div>
        <ul ui-sortable="sortableOptions" ng-model="results" id='sortable_searchlist' class='sortable'>
            <li ng-repeat="result in results" class="vid_item_link" ng-click="openVideo(result)">
                <div class='vid_item cf'>
                    <div class='thumb'>
                        <img src='//img.youtube.com/vi/{{result.ext_id}}/default.jpg'>
                    </div>
                    <div class='vid_item_title'>{{result.title}}</div>
                    <div ng-show="result.subtitle" class='sf gray subtitle'>{{result.subtitle}}</div>
                </div>
            </li>
        </ul>
    </div>

    <div id="playlist_container" class="list_container">
        <div id="playlist_controls" class="list_controls">
            <h2 class="tab_label right-tab">Public URL</h2>
            <a href="#" class="save-playlist">Save Playlist(s)</a>

            <div class="input_container right-tab cf">
                <div id="globe-container">
                    <img src="images/globe_24.png"/>
                </div>
                <div id="url">
                    tubelab.net/2n2w
                </div>
            </div>
        </div>
        <ul ui-sortable="sortableOptions" ng-model="playlist" id='sortable_playlist' class='sortable'>
            <li ng-repeat="result in playlist track by $index" class="vid_item_link" ng-click="remoteOpenVideo(result, $index)">
                <div class='vid_item cf'>
                    <div class='thumb'>
                        <img src='//img.youtube.com/vi/{{result.ext_id}}/default.jpg'>
                    </div>
                    <div class='vid_item_title'>{{result.title}}</div>
                </div>
            </li>
        </ul>
    </div>

</div>
</body>


</html>