<?php

	/*
		Assigns a study group to the participant. Group 0 completes the challenges first. Group 1 tests BlockCoder.js first.
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";


	$query = "SELECT `group`, COUNT(*) FROM project_participant GROUP BY `group`;";
	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);

	//$stmt->bind_param('s', $_SESSION['id']);
	$stmt->execute();
	
	$stmt->bind_result($group, $count);

	
	$rows = array();

	$group0Total = 0;
	$group1Total = 0;

	$participantsGroup = 1;

	while($stmt->fetch()){
		if($group == 0){
			$group0Total = $count;
		}else if($group == 1){
			$group1Total = $count;
		}
	}

	//Pick the group with the least number of participants
	if($group1Total > $group0Total){
		$participantsGroup = 0;
	}else if($group0Total > $group1Total){
		$participantsGroup = 1;
	}
	//Else find the one with the least number of participants at that experience level
	else{

		$query = "SELECT `group`, COUNT(*) FROM project_participant WHERE experience = ? GROUP BY `group`;";
		$stmt = $conn->stmt_init();
		$stmt = $conn->prepare($query);

		$stmt->bind_param('i', $_SESSION['experience']);
		$stmt->execute();
		
		$stmt->bind_result($group, $count);

		
		$rows = array();

		$group0Total = 0;
		$group1Total = 0;
		$group0;
		$group1;

		while($stmt->fetch()){
			if($group == 0){
				$group0 = $group;
				$group0Total = $count;
			}else if($group == 1){
				$group1 = $group;
				$group1Total = $count;
			}
		}

		if($group1Total > $group0Total){
			$participantsGroup = 0;
		}else if($group0Total > $group1Total){
			$participantsGroup = 1;
		}else{
			//Pick randomly
			if(rand (0, 1) == 0){
				$participantsGroup = 0;
			}else{
				$participantsGroup = 1;
			}
		}
	}

	$query = "UPDATE `project_participant` SET `group` = ? WHERE participant_id = ?;";

	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);

	$stmt->bind_param('is', $participantsGroup, $_SESSION['id']);
	$stmt->execute();

	$_SESSION['group'] = $participantsGroup;

	if($_SESSION['group'] == 0){
		//load challenge
		header("Location: /t.rawlings/BlockCoder/study/html/MapChallengeBlockly.html");
	}else{
		//load BlockCoder
		header("Location: /t.rawlings/BlockCoder/study/html/BlockCoderStudy.html");
	}

?>