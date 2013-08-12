<?php
	
	function dbconnect(){
		$conn = mysql_connect('localhost','tubelab_net',';ka0vxt(Dm3g') or die ('I cannot connect to the database because: ' . mysql_error());
		if(! mysql_select_db('tubelab_net')){
			die('<p>Couldn\'t select the database</p>');
		}
	}
	
	function rand_string($length = 4) {
		$characters = '123456789abcdefghijkmnpqrstuvwxyzABCDEFGHIJKLMNPQRSTUVWXYZ';
		$string = '';

		for ($p = 0; $p < $length; $p++) {
			$string .= $characters[mt_rand(0, strlen($characters)-1)];
		}

		return $string;
	}
	
	function new_playlistid(){
		
		while (!$unique){
			$rand_string = rand_string();
			$unique = true;
			//certainly not the most efficient, but less chance of conflicting playlistids.
			$result = mysql_query('SELECT playlist FROM songs WHERE 1 GROUP BY playlist');
			while($row = mysql_fetch_array($result)){
				if ($row['playlistid'] == $rand_string){
					$unique = false;
					break;
				}
			}
		}
		
		return $rand_string;
	}
	
	function add_user($id, $ip){
		$id = mysql_real_escape_string($id);
		$ip = mysql_real_escape_string($ip);
		mysql_query("INSERT INTO users (id, ip) VALUES ('$id', '$ip')") or die();
	}
	
	function add_action($action, $action_details = ''){
		$id = mysql_real_escape_string($_COOKIE['tubelab']);
		$action = mysql_real_escape_string($action);
		$action_details = mysql_real_escape_string($action_details);
		$time = date("Y-m-d H:i:s", time());
		mysql_query("INSERT INTO actions (user_id, action_type, action_details, date) VALUES ('$id', '$action', '$action_details', '$time')") or die(mysql_error());
	}
	
	function user_owns_playlist($user, $plid){
		$user = mysql_real_escape_string($user);
		$plid = mysql_real_escape_string($plid);
		$result = mysql_query("SELECT * FROM playlists WHERE playlist = '$plid' AND user_id = '$user'") or die(mysql_error());
		return mysql_num_rows($result);
	}
	
?>
