<?php

	/*
		Gets the current participant's unique ID.
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";
	
	if(isset($_SESSION['id'])){
		echo $_SESSION['id'];
	}else{
		echo "No participant ID is set!";
	}


?>