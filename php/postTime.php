<?php
	
	/*
		Inserts the survery results into the database
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";


	$challengeId = $_POST["challengeId"];
	$startTime = $_POST["startTime"];
	$endTime = $_POST["endTime"];
	
	/*$query = "INSERT INTO `project_survey`(test) VALUES (?);";

	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);
	$stmt->bind_param('s', $answer01);
	$stmt->execute();*/
	
	echo "\$challengeId = " . $challengeId . " | \$startTime = " . $startTime . " | \$endTime = " . $endTime;
?>