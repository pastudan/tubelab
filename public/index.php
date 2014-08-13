<?php
    $version = "0.0.0.1";
    require_once 'Mobile-Detect/Mobile_Detect.php';
    $detect = new Mobile_Detect;
    header("Vary: User-Agent");

    if ($detect->isMobile() || isset($_GET['m'])){
        require("mobile.php");
        die();
    }
	
	if(!isset($_COOKIE["tubelab"])){
		$_COOKIE["tubelab"] = $user_string = rand_string(12);
		setcookie('tubelab', $user_string, 2116303200);
//		add_user($user_string, $_SERVER['REMOTE_ADDR']);
	}

    //TODO: log main page load here.
	
	//TODO: share should look at user-agent for something like this: 
	// facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)
	//
	// if so, display some relevent information. 
	//facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)

	
	$ua = $_SERVER['HTTP_USER_AGENT'];
	if ($ua == "facebookexternalhit/1.1 (+http://www.facebook.com/externalhit_uatext.php)"){
		require("facebook.php");
		die();
	}
    require("desktop.php");
?>