<?php
	
	/*
		Inserts the survery results into the database
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";

	//$postData = "";

	foreach($_POST as $key => $value)
	{
	    //$postData .= $key . " => " . $value . "\n";

    	$query = "INSERT INTO `project_survey_response`(participant_id, question_id, response_id) VALUES (?, ?, ?);";

			$stmt = $conn->stmt_init();
			$stmt = $conn->prepare($query);
			$stmt->bind_param('sii', $_SESSION['id'], $key, $value);
			$stmt->execute();
	}
	
	
	header("Location: /t.rawlings/BlockCoder/study/html/ThankYou.html");
	
?>