<?php

	/*
		Takes a restaurant_id and returns an array of rows containing: order_id, 
		ingredient name, quantity, and category for all orders from that restaurant.
	*/

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/php/admin/connect.php";

	$address_id = $_POST["address_id"];


	$query = "SELECT * FROM address WHERE address_id = ?;";
	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);

	$stmt->bind_param('i', $address_id);
	$stmt->execute();
	
	$stmt->bind_result($address_id, $line1, $line2, $city, $postcode, $lat, $long);

	$rows = array();
	while($stmt->fetch()){
		$row = array("address_id"=>$address_id, "line1" => $line1, "line2" => $line2, "city" => $city, "postcode" => $postcode, "lat" => $lat, "long" => $long); 
		$rows[] = $row; 
	}
	
	echo json_encode($rows);

?>