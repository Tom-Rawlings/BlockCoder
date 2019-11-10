<?php

	/*
		Adds the participant's basic information including gender, age, and programming experience along with their unique ID into the database
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";

	$gender = $_POST['gender'];
	$age = $_POST['age'];
	$experience = $_POST['experience'];

	$_SESSION['experience'] = $experience;
	
	if($_SESSION['consent'] != "true"){
		echo "Survey consent has not been given. Consent = " . $_SESSION['consent'];
		return;
	}

	$query = "INSERT INTO `project_participant` (participant_id, has_consented, date_time, gender, age, experience) VALUES (?, ?, NOW(), ?, ?, ?);";

	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);

	$stmt->bind_param('sisii', $_SESSION['id'], $_SESSION['consent'], $gender, $age, $experience);
	$stmt->execute();

	//Query which study group has more participants and assign this participant a group accordingly. Also load the correct page.
	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/assignGroup.php";

?>