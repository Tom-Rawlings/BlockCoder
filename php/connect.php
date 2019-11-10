<?php
	session_start();
	
	$servername = "homepages.cs.ncl.ac.uk";
	$username = "b8061615";
	$password = "dB63566143";
	$db = "b8061615";
	
	$conn = new mysqli($servername, $username, $password, $db);
	
	if($conn->connect_error){
		die("Connection failed - Please contact t.rawlings@newcastle.ac.uk: " . $conn->connect_error);
	}

	$conn->set_charset("utf8mb4");
?>
