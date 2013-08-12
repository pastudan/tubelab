<?php

	require("functions.php");

	if(!isset($_COOKIE["tubelab"])){
		$_COOKIE["tubelab"] = $user_string = rand_string(12);
		setcookie('tubelab', $user_string, 2116303200);
		dbconnect();
		add_user($user_string, $_SERVER['REMOTE_ADDR']);
	}

	if ($_POST['method'] == 'search'){
		$start=$_POST['start'];
		$q=urlencode($_POST['q']);
		$results = json_decode(file_get_contents("https://gdata.youtube.com/feeds/api/videos?q={$q}&alt=json&start-index={$start}&max-results=25&v=2"),1);
		if ($results['feed']['openSearch$totalResults']['$t'] > 0){
			$i = 0;
			foreach ($results['feed']['entry'] as $result){
				$data[$i]['title'] = $result['title']['$t'];
				$data[$i]['ext_id'] = $result['media$group']['yt$videoid']['$t'];
				$i++;
			}
		} else {
			$data[0]['title'] = "No results found...";
			$data[0]['subtitle'] = "Instead, here's a baby panda.";
			$data[0]['ext_id'] = 'FzRH3iTQPrk';
		}
		echo json_encode($data);
	} else if ($_POST['method'] == 'update') {
		dbconnect();
		
		if(user_owns_playlist($_COOKIE["tubelab"], $_POST['plid'])){
			$plid = mysql_real_escape_string($_POST['plid']);
			mysql_query("DELETE FROM songs WHERE playlist = '$plid'") or die(mysql_error());
			$i = 0;
			foreach ($_POST['playlist'] as $playlist_item){
				$ext_id = mysql_real_escape_string($playlist_item['ext_id']);
				$title = mysql_real_escape_string($playlist_item['title']);
				mysql_query("INSERT INTO songs VALUES ('$i','$plid','$ext_id','$title')") or die(mysql_error());
				$i++;
			}
			echo $_POST['plid'];
		} else {
			$playlistid = new_playlistid();
			$user_id = mysql_real_escape_string($_COOKIE["tubelab"]);
			$from_plid = mysql_real_escape_string($_POST['plid']);
			mysql_query("INSERT INTO playlists VALUES ('$playlistid','$user_id','$from_plid')") or die(mysql_error());
			$i = 0;
			foreach ($_POST['playlist'] as $playlist_item){
				$ext_id = mysql_real_escape_string($playlist_item['ext_id']);
				$title = mysql_real_escape_string($playlist_item['title']);
				mysql_query("INSERT INTO songs VALUES ('$i','$playlistid','$ext_id','$title')") or die(mysql_error());
				$i++;
			}
			echo $playlistid;
		}
	} else if ($_POST['method'] == 'get') {
		if($_POST['plid'] != ''){
			dbconnect();
			
			$plid = mysql_real_escape_string($_POST['plid']);
			$result = mysql_query("SELECT ext_id,title FROM songs WHERE playlist = '$plid' ORDER BY list_order");
			$i=0;
			while($row = mysql_fetch_array($result)){
				$playlist[$i]['ext_id'] = $row['ext_id'];
				$playlist[$i]['title'] = stripslashes($row['title']);
				$i++;
			}
			echo json_encode($playlist);
		} else {
			/*
			$playlist[0]['ext_id'] = '0zldvi6V0ms';
			$playlist[0]['title'] = 'asian pr0n';
			echo json_encode($playlist);
			*/
			echo "";
		}
	}
	
?>