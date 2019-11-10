<?php

	require $_SERVER['DOCUMENT_ROOT'] . "/t.rawlings/php/admin/connect.php";

	$restaurant_id = $_SESSION["restaurant_id"];
	//$restaurant_id = 1;
	$order = $_POST["orderValues"];
	//$ingredients = array("1"=>12,"2"=>55,"2"=>2,"4"=>435,"5"=>45,"6"=>645,"7"=>75,"8"=>34,"9"=>36,"10"=>420,"11"=>546,"12"=>69);

	$query = "INSERT INTO `order`(dateAndTime,status) VALUES (Now(),'Ordered');";
	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);
	$stmt->execute();

	$query = "SELECT max(order_id) FROM `order`;";
	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);
	$stmt->execute();
	$stmt->bind_result($order_id);
	$stmt->fetch();
	$latest_order_id = $order_id;

	$query = "INSERT INTO restaurant_has_orders(restaurant_id, order_id) VALUES (?, ?);";
	$stmt = $conn->stmt_init();
	$stmt = $conn->prepare($query);
	$stmt->bind_param('ii', $restaurant_id, $latest_order_id);
	$stmt->execute();

	foreach($order as $x){
		$query = "INSERT INTO order_has_ingredients (order_id, ingredient_id, quantity) VALUES (?, ?, ?);";
		$stmt = $conn->stmt_init();
		$stmt = $conn->prepare($query);
		$stmt->bind_param('iii', $latest_order_id, $x[0], $x[1]);
		$stmt->execute();
	}
	
	
	echo ("".$order_id);

?>