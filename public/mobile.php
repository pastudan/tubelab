<!doctype html>
<html ng-app="sortableApp" ng-controller="ResultsCtrl">
<head>
    <meta content='width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=0' name='viewport'/>
    <meta name="viewport" content="width=device-width"/>
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
        <div class="menu-bars control-item fl">
            <i class="fa fa-fw fa-bars"></i>
        </div>
        <div ng-show="!showSearchField" class="currently-playing fl">
            Southern
            <div style="font-size: .5em">Tim McGraw</div>
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

        <div ng-show="!showSearchField" class="control-item fr" data-action="next">
            <i class="fa fa-fw fa-step-forward"></i>
        </div>
        <div ng-show="!showSearchField" class="control-item fr" data-action="play-pause">
            <i class="fa fa-fw fa-pause"></i>
        </div>

    </header>

    <section class="results-wrapper">
        <ul>
            <li ng-repeat="result in results" class="vid_item_link">
                <div class='vid_item cf'>
                    <div class='thumb'
                         style="background-image: url(//img.youtube.com/vi/{{result.ext_id}}/default.jpg)"></div>
                    <div class='vid_item_title' ng-click="remoteOpenVideo(result)">{{result.title}}</div>
                </div>
            </li>
        </ul>
    </section>

    <section class="playlist-wrapper">
        <ul>
            <li ng-repeat="result in playlist" class="vid_item_link">
                <div class='vid_item cf'>
                    <div class='thumb'
                         style="background-image: url(//img.youtube.com/vi/{{result.ext_id}}/default.jpg)"></div>
                    <div class='vid_item_title'>{{result.title}}</div>
                </div>
            </li>
        </ul>
    </section>

</div>

</body>
</html>
