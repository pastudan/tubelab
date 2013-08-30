<!DOCTYPE HTML PUBLIC "-//W3C//DTD HTML 4.01 Transitional//EN" "http://www.w3.org/TR/html4/loose.dtd">
<html> 
<head>
	<title>TubeLab Stats</title>
	<link type="text/css" rel="stylesheet" href="tablesorter.css" />
	<script type="text/javascript" src="scripts/jquery-1.5.2.min.js"></script> 
	<script type="text/javascript" src="scripts/jquery.tablesorter.min.js"></script>
	<script>
		$(document).ready(function() { 
			$("#sortable").tablesorter(); 
		}); 
	</script>
</head>
<body>
<table id="sortable" class="tablesorter">
<thead>
<tr>
	<th>Playlist</th>
	<th>IP</th>
	<th>City,St</th>
	<th>Area Code</th>
</tr>
</thead>
<?php
	require_once "Net/GeoIP.php";
	$geoipcity = Net_GeoIP::getInstance("GeoIPCity.dat");
	//$geoiporg = Net_GeoIP::getInstance("GeoIPOrg.dat");
	
	try {
		echo $_SERVER['REMOTE_ADDR'] . ":";
		echo $geoipcity->lookupLocation($_SERVER['REMOTE_ADDR']);
	} catch (Exception $e) {
		// Handle exception
		echo $e;
	}
	
	include('functions.php');
	dbconnect();
	$result = mysql_query("SELECT * FROM playlists WHERE 1");
	$i=0;
	while($row = mysql_fetch_array($result)){
		echo "<tr>\n";
		echo "\t<td>{$row['playlist']}</td>\n";
		$sub_result = mysql_query("SELECT * FROM users WHERE id = '{$row['user_id']}'");
		if (mysql_num_rows($sub_result) == 0){
			echo "\t<td></td>\n";
			echo "\t<td></td>\n";
			echo "\t<td></td>\n";
		}
		while($sub_row = mysql_fetch_array($sub_result)){
			echo "\t<td>{$sub_row['ip']}</td>\n";
			$location = $geoipcity->lookupLocation($sub_row['ip']);
			echo "\t<td>".$location->city.", ".$location->region."</td>\n";
			echo "\t<td>".$location->areaCode."</td>\n";
		}
		echo "</tr>\n";
	}
?>
</table>
</body>
</html>