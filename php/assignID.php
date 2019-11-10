<?php

	/*
		Checks whether the participant has given their consent. If they have, a participant ID is created and added to the database.
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";

	$consent = isset($_POST["consent"]);
	if($consent){
		//Create a unique ID for the participant
		$id = strtoupper(uniqid());

		//Store the participants unique id as a session variable
		$_SESSION['id'] = $id;
		$_SESSION['consent'] = $consent;


		header("Location: /t.rawlings/BlockCoder/study/html/QuestionnaireBasicInfo.html");
	}else{
		//Return to Agreement page if consent not given
		header("Location: /t.rawlings/BlockCoder/study/html/Agreement.html");
	}


?>