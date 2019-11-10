<?php

	/*
		Builds the question table for the final questionnaire based on questions in the database
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/BlockCoder/php/connect.php";


	$query = "SELECT * FROM project_survey_question ORDER BY question_id;";
	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);

	$stmt->execute();
	
	$stmt->bind_result($question_id, $question_text);

	//$rows = array();
	$tableHtml = "";
	while($stmt->fetch()){
		//$row = array("question_id"=>$question_id, "question_text" => $question_text); 
		//$rows[] = $row; 
		$tableHtml .= '
		<tr id="statement'.$question_id.'">
			<td class="idColumn">'.$question_id.'</td>
			<td class="statement">'
				.$question_text.
			'</td>
			<td class="containsRadio"><input type="radio" name="'.$question_id.'" value="1"></td>
			<td class="containsRadio"><input type="radio" name="'.$question_id.'" value="2"></td>
			<td class="containsRadio"><input type="radio" name="'.$question_id.'" value="3"></td>
			<td class="containsRadio"><input type="radio" name="'.$question_id.'" value="4"></td>
			<td class="containsRadio"><input type="radio" name="'.$question_id.'" value="5"></td>
		</tr>';
	}


	echo $tableHtml;
	//echo '<tr><td class="statement">' . $question_text . "</td></tr>";

	//echo json_encode($rows);

?>