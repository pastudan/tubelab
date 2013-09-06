<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html> 
<head>
	<title>TubeLab</title>
	<link rel="shortcut icon" href="favicon.gif" />
	<script src="//ajax.googleapis.com/ajax/libs/jquery/2.0.3/jquery.min.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.10.3/jquery-ui.min.js"></script>
	<script type="text/javascript" src="scripts/typewatch.js"></script>
	<script src="//ajax.googleapis.com/ajax/libs/swfobject/2.2/swfobject.js"></script>
	<script type="text/javascript" src="scripts/screenfull.min.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.0.14/jquery.jscrollpane.min.js"></script>
	<script type="text/javascript" src="//cdnjs.cloudflare.com/ajax/libs/jquery-mousewheel/3.1.3/jquery.mousewheel.min.js"></script>
	<link rel="stylesheet" type="text/css" href="//cdnjs.cloudflare.com/ajax/libs/jScrollPane/2.0.14/jquery.jscrollpane.min.css" />
</head>
<body>
	<div class="content-area">

<p>Lorem IpsumLorem ipsum dolor sit amet, consectetur adipiscing elit. Sed elit eros, fermentum sed urna ut, fermentum aliquet dui. Nulla nec metus tellus. Nunc sodales aliquam lacus eget dictum. Curabitur sapien quam, bibendum a placerat a, tincidunt sed mi. Cras diam sem, posuere eu sagittis consectetur, porta a leo. Phasellus sed bibendum nibh. Nunc facilisis orci nibh, nec molestie lectus mattis sed. Morbi id nulla vel lacus elementum luctus in id dui. Lorem ipsum dolor sit amet, consectetur adipiscing elit.

Vivamus porttitor nulla in sem adipiscing pulvinar. Maecenas at mauris varius, luctus quam sed, dignissim neque. Donec vitae gravida felis. Vivamus ut feugiat velit. Mauris faucibus vehicula ipsum, sit amet condimentum mauris facilisis non. Maecenas vel augue feugiat mauris convallis congue. Proin vehicula est ut nulla congue, dignissim pellentesque risus tincidunt. Aenean fermentum mauris quam, vitae vehicula augue elementum eu. Proin tincidunt varius velit at tempus. Fusce venenatis volutpat felis, ac lobortis lectus imperdiet ut. Mauris sit amet faucibus justo. Sed a est mi. Nullam volutpat dolor non ultricies egestas.

Mauris fringilla sit amet tortor in venenatis. Donec aliquam euismod purus at gravida. Sed quis rutrum eros, in viverra tortor. Nam venenatis pharetra dolor, sed porta sem ultrices sit amet. Nullam eget eros vehicula, vulputate nisi at, blandit sem. Ut aliquam tortor iaculis, egestas enim a, rutrum odio. Maecenas iaculis elit quam, sit amet tincidunt est auctor vel. Nam a dictum ante. Curabitur pulvinar, leo vel suscipit bibendum, massa ipsum suscipit nulla, euismod vulputate erat nunc vitae risus. Vestibulum posuere, nulla nec mattis ornare, neque magna viverra nulla, in iaculis nisi sem a sapien. Nunc quis iaculis lorem. Duis ultricies consequat ante et tincidunt.

Praesent ut malesuada urna. Donec eros erat, pretium vel massa a, commodo semper elit. Pellentesque in scelerisque orci, quis mattis tortor. Phasellus non lobortis elit. In enim dui, aliquam eget pulvinar a, fermentum et ipsum. Curabitur quis eros magna. Vestibulum id sollicitudin diam. Mauris pellentesque velit ac est mattis, sed laoreet massa posuere. Fusce vulputate odio dui. Proin vitae felis non nisi commodo pharetra. Duis nec venenatis urna. Cras vitae ligula vel mauris ornare aliquam. Duis in eros quis mauris sollicitudin adipiscing. Aenean lorem nunc, luctus sed libero eget, gravida suscipit turpis. Lorem ipsum dolor sit amet, consectetur adipiscing elit. Donec eget consectetur enim, eget rhoncus quam.

Vivamus placerat, ligula fermentum euismod rhoncus, nisl elit pharetra mi, et rutrum quam nisl vitae massa. Praesent iaculis nisi nec lectus dapibus sollicitudin. Mauris vitae ultrices metus. Phasellus facilisis vulputate dui, ac vehicula elit euismod at. Suspendisse rutrum eros ut tortor rhoncus molestie. Fusce porta velit quis risus ornare elementum. Quisque eros urna, faucibus nec nunc a, lacinia sodales leo. Morbi euismod hendrerit quam eget lobortis. In mattis nisi quis dolor congue bibendum. Fusce nec ipsum facilisis, lobortis est sit amet, porta orci. Curabitur nec tincidunt nunc. Donec erat sem, lacinia at interdum nec, facilisis sed risus. Sed pulvinar hendrerit condimentum.</p>

</div>

<script>

$(document).ready(function(){
$('.content-area').jScrollPane({
    horizontalGutter:5,
    verticalGutter:5,
    'showArrows': false,
    mouseWheelSpeed: 30
});

$('.jspDrag').hide();
$('.jspScrollable').mouseenter(function(){
    $(this).find('.jspDrag').stop(true, true).fadeIn('slow');
});
$('.jspScrollable').mouseleave(function(){
    $(this).find('.jspDrag').stop(true, true).fadeOut('slow');
});
});
</script>
<style>
body{
	background: #1C1A18;
color: white;
}
	.content-area{
		height: 200px;
		width: 200px;
	}
/*scrollpane custom CSS*/
.jspVerticalBar {
    width: 8px;
    background: transparent;
    right:10px;
}
 
.jspHorizontalBar {
    bottom: 5px;
    width: 100%;
    height: 8px;
    background: transparent;
}
.jspTrack {
    background: transparent;
}
 
.jspDrag {
    background: rgba(255,255,255,0.3);
    -webkit-border-radius:4px;
    -moz-border-radius:4px;
    border-radius:4px;
}
 
.jspHorizontalBar .jspTrack,
.jspHorizontalBar .jspDrag {
    float: left;
    height: 100%;
}
 
.jspCorner {
    display:none
}
</style>

</body>
</html>
