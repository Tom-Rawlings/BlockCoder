<?php

	/*
		Adds the start and end use times for the participant testing BlockCoder.js
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";

	if(isset($_SESSION['id'])){
		//echo $_SESSION['id'] . "\n";
	}else{
		//echo "No participant ID is set!";
	}

	$time_start = $_POST['time_start'];
	$time_end = $_POST['time_end'];

	$query = "INSERT INTO `project_participant_blockcoder` (participant_id, time_start, time_end) VALUES (?, ?, ?);";

	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);

	$stmt->bind_param('sss', $_SESSION['id'], $time_start, $time_end);
	$stmt->execute();

	if($_SESSION['group'] == 0){
		//Final Questionnaire
		header("Location: /t.rawlings/BlockCoder/study/html/QuestionnaireFinal.html");
	}else{
		//load challenges
		header("Location: /t.rawlings/BlockCoder/study/html/MapChallengeBlockly.html");
	}
	
?>