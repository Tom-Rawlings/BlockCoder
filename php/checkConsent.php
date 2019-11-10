<?php

	/*
		Returns whether the participant has given their consent.
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";

	$consent = isset($_SESSION["consent"]);
	
	echo $consent;


?>