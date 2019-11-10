<?php

	/*
		Adds the participant's challenge info to the database, including challenge ID, start and end time, and number of attempts
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";

	if(isset($_SESSION['id'])){
		//echo $_SESSION['id'] . "\n";
	}else{
		//echo "No participant ID is set!";
	}

	$challenge_id = $_POST['challenge_id'];
	$time_start = $_POST['time_start'];
	$time_end = $_POST['time_end'];
	$attempts = $_POST['attempts'];
	$was_successful = $_POST['was_successful'];

	/*
	$row = array("challenge" => $challenge_id, "start" => $time_start, "end" => $time_end, "attempts" => $attempts); 

	echo json_encode($row);
	*/

	$query = "INSERT INTO `project_participant_challenge` (participant_id, challenge_id, time_start, time_end, attempts, was_successful) VALUES (?, ?, ?, ?, ?, ?);";

	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);

	$stmt->bind_param('sissii', $_SESSION['id'], $challenge_id, $time_start, $time_end, $attempts, $was_successful);
	$stmt->execute();

	
?>