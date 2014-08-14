<!doctype html>
<html ng-app="sortableApp" ng-controller="ResultsCtrl">
<head>
    <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=0>
    <link rel="shortcut icon" href="/images/favicon.png"/>
    <link rel="stylesheet" type="text/css" media="all" href="/reset-clearfix.css">
    <link rel="stylesheet" type="text/css" media="all" href="//cdnjs.cloudflare.com/ajax/libs/font-awesome/4.0.3/css/font-awesome.min.css">
    <link rel="stylesheet" type="text/css" media="all" href="/styles/mobile.css">
    <script src="//cdnjs.cloudflare.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/socket.io/0.9.16/socket.io.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/angular.js/1.2.10/angular.min.js"></script>
    <script>
        version = "<?php echo $version; ?>";
    </script>
    <script src="/scripts/mobile.js"></script>
</head>
<body>
<div class="main-panel">

    <header class="cf">
        <div ng-show="!showSearchField" class="menu-bars control-item fl">
            <i class="fa fa-fw fa-bars"></i>
        </div>
        <div ng-show="showSearchField" ng-click="showSearchField = !showSearchField" class="hide-search control-item fr">
            <i class="fa fa-fw fa-chevron-up"></i>
        </div>

        <div ng-show="!showSearchField" class="currently-playing fl">
            <span>{{currentlyPlaying.title}}</span>
            <div style="font-size: .5em">{{currentlyPlaying.artist}}</div>
        </div>

        <div ng-show="showSearchField" class="search-container fl">
            <input focus-me="showSearchField" id="search" type="text" ng-model="query"/>

            <div class="search-border"></div>
        </div>

        <div ng-show="!showSearchField" class="control-item fr" data-action="prev">
            <i class="fa fa-fw fa-search"></i>
        </div>

        <input ng-click="showSearchField = !showSearchField" type="text" class="search-keyboard-hack fr"
               ng-class="{'fake-hidden': showSearchField}"/>

        <div ng-show="!showSearchField" class="control-item fr" ng-click="playNext()" >
            <i class="fa fa-fw fa-step-forward"></i>
        </div>
        <div ng-show="!showSearchField" class="control-item fr" ng-click="togglePlayback()" >
            <i class="fa fa-fw" ng-class="{true:'fa-pause', false:'fa-play'}[isPlaying]"></i>
        </div>

    </header>

    <section class="add-play-dialog" ng-show="showAddPlayDialog">
        <div class="thumb">
            <h1>{{selected_result.title}}</h1>
            <img src="//img.youtube.com/vi/{{selected_result.ext_id}}/0.jpg" width="100%">
            <button class="play" ng-click="remoteOpenVideo(selected_result)">
                <i class="fa fa-play"></i>
                Play Now
            </button>
            <button class="add" ng-click="addVideo(selected_result)">
                <i class="fa fa-plus"></i>
                Add
            </button>
        </div>
        <div class="cancel" ng-click="showAddPlayDialog = false"><i class="fa fa-times"></i> Cancel</div>
    </section>

    <section class="results-wrapper" ng-show="showSearchField">
        <ul>
            <li ng-repeat="result in results" ng-click="addOrPlay(result)" class="vid_item_link">
                <div class='vid_item cf'>
                    <div class='thumb'>
                        <img src="//img.youtube.com/vi/{{result.ext_id}}/default.jpg">
                    </div>
                    <div class='vid_item_title'>{{result.title}}</div>
                </div>
            </li>
        </ul>
    </section>

    <section class="playlist-wrapper">
        <ul>
            <li ng-class="{'playing-currently': $index==currentlyPlayingIndex}" ng-repeat="result in playlist track by $index" ng-click="remoteOpenVideo(result, $index)" class="vid_item_link">
                <div class='vid_item cf'>
                    <div class='thumb'>
                        <img src="//img.youtube.com/vi/{{result.ext_id}}/default.jpg" />
                    </div>
                    <div class='vid_item_title'>{{result.title}}</div>
                </div>
            </li>
        </ul>
    </section>

</div>

</body>
</html>
