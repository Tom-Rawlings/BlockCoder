/*
	Global variables for the map challenge
*/
var startCoords;
var characterDirection;
var startDirection;
var characterCoords;
var goalCoords;
var challengeIndex = 0;
var currentMap;

var timeStart;
var timeEnd;
var attempts = 0;

var hasStarted = false;
var participantsGroup = 0;

var defaultText = `//Available functions:
//
//	moveForward(numberOfSteps);
//	turnLeft();
//	turnRight();
//
//All statements require parentheses and should end with a semi-colon;
//Enter code below and click the green "RUN" button.

`;

$( document ).ready(function() {

	isMapChallenge = true;
	//checkConsent();
	getGroup();

  toolboxId = "toolbox_map";
  scaleSet["blocklyArea"] = 0.45;

  //Resizable windows setup
  setupWindows($("#mainWindow"));

  generateBlocklyCode = function(){}

  if(!usingBlockly){
	  var myTextArea = $("#codeArea")[0];
  	myCodeMirror = CodeMirror(function(elt) {
    myTextArea.parentNode.replaceChild(elt, myTextArea);
  }, {value: myTextArea.value, theme: "darcula", tabSize: 2});

	  $("#codeAreaParent").css("font-size", "140%");

	  myCodeMirror.setSize("100%", "100%");

	  generateBlocklyCode = function(){
	    var code = Blockly.JavaScript.workspaceToCode(workspace);
	    myCodeMirror.getDoc().setValue(code);
	    myCodeMirror.refresh();
	  }
  }


  //Show everything once it's finished setting up
  $("body").css("display", "initial");

  //Initial setup
  makePlayAreaPannable();



  if(usingBlockly){
	  setupBlockly($("#blocklyDiv").parent()[0]);
	    //Centres the workspace at the start
  	workspace.scrollCenter();
  	defaultText = "";
  	challengeOrder = challengesBlockly;
  }else{
  	$("#runSwitch").css("bottom", 0);
  	$("#runSwitch").css("right", 50);
  	$("#runSwitch").css("top", 102);
  	$("#consoleText").css("font-size", 20);
  	challengeOrder = challengesText;
  }

  if(!usingBlockly){
  	overrideConsoleMethods();
  }

 


  document.onkeydown = checkKeyDownEditor;


  //Resizes everything to fit window
  window.onresize = resizeToFillWindow;

  windowResized = function(){
  	if(usingBlockly){
  		blocklyResize();	
  	}else{
	    myCodeMirror.refresh();
  		resizeConsole();
  	}

  }
  windowResized();

  centrePlayArea();

  if(!usingBlockly){
  	//Override console.error
		var oldCallBack = console["error"];
		console["error"] = function(){
			var args;
	    console.logs.push(Array.from(arguments));
	    console.stdlog.apply(console, arguments);
	    //$("#consoleText").html($("#consoleText").html() + '<span class="console-error">' + console.logs[console.logs.length-1] + "</span><hr/>");
	    args = Array.prototype.slice.call(arguments, 0);
	    Function.prototype.apply.call(oldCallBack, console, arguments);
	    $("#consoleText").html($("#consoleText").html() + `<span class="console-error">Available functions:\nmoveForward(numberOfSpaces);\nturnLeft();\nturnRight();</span><hr/>`);
	    scrollToBottom("consoleText");
		}
  }



  //Load the code challenge
  //challengeOrder
  setupNextChallenge();
  disableRunSwitch();

  if(!usingBlockly){
  	myCodeMirror.setValue(defaultText);
  }

  //Tutorial
	tintPanel($("body"), "black");
	$("#tutorial_parent").css("display", "initial");


});


/*
Send to server:

Start time
End time
Challenge index
*/

//--------

var mapLayout1 = [
	[' ', ' ', ' ', ' ', 'X', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', ' ', ' '],
	[' ', ' ', 'X', 'X', 'X', 'X', 'X'],
	[' ', ' ', 'X', ' ', 'X', ' ', ' '],
	['X', 'X', 'X', ' ', 'X', 'X', 'X'],
	[' ', ' ', 'X', ' ', 'X', ' ', ' '],
	[' ', ' ', 'X', 'X', 'X', ' ', ' '],
	[' ', ' ', 'X', ' ', ' ', ' ', ' '],
	[' ', ' ', 'X', ' ', ' ', ' ', ' '],
	[' ', ' ', 'X', ' ', ' ', ' ', ' ']
];

var mapLayout2 = [
	[' ', ' ', ' ', 'X', ' ', ' ', ' '],
	[' ', ' ', ' ', 'X', ' ', ' ', ' '],
	['X', ' ', 'X', 'X', ' ', ' ', ' '],
	['X', ' ', 'X', ' ', ' ', ' ', ' '],
	['X', 'X', 'X', ' ', ' ', ' ', ' '],
	[' ', ' ', 'X', ' ', ' ', ' ', ' '],
	['X', 'X', 'X', ' ', ' ', ' ', ' '],
	[' ', ' ', 'X', 'X', 'X', ' ', ' '],
	[' ', ' ', ' ', ' ', 'X', 'X', ' '],
	[' ', ' ', ' ', ' ', 'X', ' ', ' ']
];

var challengeOrder = new Array();

var challengesBlockly = [
	{map: mapLayout1, startCoords: new Coord2d(2,9), goalCoords: new Coord2d(6,2), startDirection: "NORTH"},
	{map: mapLayout1, startCoords: new Coord2d(4,0), goalCoords: new Coord2d(0,4), startDirection: "SOUTH"},
	{map: mapLayout1, startCoords: new Coord2d(6,4), goalCoords: new Coord2d(0,4), startDirection: "WEST"}
];

var challengesText = [
	{map: mapLayout2, startCoords: new Coord2d(3,0), goalCoords: new Coord2d(4,9), startDirection: "SOUTH"},
	{map: mapLayout2, startCoords: new Coord2d(5,8), goalCoords: new Coord2d(0,6), startDirection: "WEST"},
	{map: mapLayout2, startCoords: new Coord2d(0,2), goalCoords: new Coord2d(5,8), startDirection: "SOUTH"}
];

function checkConsent(){
  $.ajax({
    url: "http://homepages.cs.ncl.ac.uk/t.rawlings/BlockCoder/php/checkConsent.php",
    type: "POST",
    dataType: "text",
    success: function(result){
    	if(result != 1){
    		//Participant has not consented
    		alert("You must agree to the terms before taking part in the study.");

    		window.location.href = "Agreement.html";
    	}
    },
    error: function(xhr, status, error){
    	$("#test").html(xhr + " | " + status + " | " + error);
    	console.error("sendChallengeData()");
    	console.error(error);
    	console.error(xhr);
    	console.error(status);
    }
  });
}

function startChallenge(){
	$("#tutorial_parent").css("display", "none");
	enableRunSwitch();
	hasStarted = true;
	timeStart = new Date().getTime();
}

function setupNextChallenge(){
	if(challengeIndex >= challengeOrder.length){
		//Completed the map challenge
		if(usingBlockly){
			window.location.href = "MapChallengeText.html";
		}else{
			//if group 0, move to blockcoder
			if(participantsGroup == 0){
				window.location.href = "BlockCoderStudy.html";
			}else{
				//else thank you page
				window.location.href = "QuestionnaireFinal.html";
			}

		}
		return;
	}
	if(hasStarted){
		timeStart = new Date().getTime();
		attempts = 0;
	}
	if(usingBlockly){
		workspace.clear();	
	}
	
	removeAllPlayObjects();
	cancelTint();
	$("#map_message").css("display", "none");
	enableRunSwitch();
	//$("#playArea").html('');
	var tileWidth = 30;
	var tileHeight = 30;
	var currentId = playObjectIds;
	addObjectToPlayArea("map", 0, 0);
	var mapId = '#'+activePlayObjects[activePlayObjects.length-1].id;

	currentMap = challengeOrder[challengeIndex].map;
	startCoords = challengeOrder[challengeIndex].startCoords;
	goalCoords = challengeOrder[challengeIndex].goalCoords;
	characterCoords = new Coord2d(startCoords.x, startCoords.y);
	startDirection = challengeOrder[challengeIndex].startDirection
	characterDirection = startDirection;



	//Create the map tiles html
	for(var y = 0; y < currentMap.length; y++){
		for(var x = 0; x < currentMap[y].length; x++){
			if(currentMap[y][x] == 'X'){
				$(mapId).append(`<div id="mapTile${x}_${y}" class="map_tile"></div>`);
				tileWidth = $(`#mapTile${x}_${y}`).width();
				tileHeight = $(`#mapTile${x}_${y}`).height();
				$(`#mapTile${x}_${y}`).css("top", (tileHeight+2)*y);
				$(`#mapTile${x}_${y}`).css("left",(tileWidth+2)*x);
			}
		}
	}

	//Centre map
	activePlayObjects[activePlayObjects.length-1].moveTo(-(currentMap[0].length*tileWidth/2), (currentMap.length*tileHeight/2));
	activePlayObjects[activePlayObjects.length-1].changeColour("#ff1d1d");
	//updateHierarchy();


	//Hide the centre dot
	$("#centre").css("display", "none");

	//Create the character and the goal
	createCharacter(characterCoords.x, characterCoords.y);
	createGoal(goalCoords.x, goalCoords.y);

	//Fake add Maze, player and goal to hierarchy
	setupHierarchy();
	challengeIndex++;
}

function createCharacter(x, y){
	$(`#mapTile${x}_${y}`).append(`<div id="map_character"></div>`);
	$(`#map_character`).append(`<div id="map_character_eye1" class="map_character_eye"></div>`);
	$(`#map_character`).append(`<div id="map_character_eye2" class="map_character_eye"></div>`);
	//Cente the character within the map tile
	$(`#map_character`).css("left", (($(`#mapTile${x}_${y}`).width() - $(`#map_character`).width()) / 2));
	$(`#map_character`).css("top", (($(`#mapTile${x}_${y}`).height() - $(`#map_character`).height()) / 2));
	positionCharacterEyes();
	
}

function positionCharacterEyes(){
	var eyeInset = 3;
	switch(characterDirection){
		case "NORTH":
			$("#map_character_eye1").css("left", ($(`#map_character`).width()/2 - $("#map_character_eye1").width()) / 2);
			$("#map_character_eye2").css("left", ($(`#map_character`).width()/2) +($(`#map_character`).width()/2 - $("#map_character_eye2").width()) / 2);
			$("#map_character_eye1").css("top", eyeInset);
			$("#map_character_eye2").css("top", eyeInset);
			break;
		case "EAST":
			$("#map_character_eye1").css("left", $(`#map_character`).width() - $("#map_character_eye1").width() - eyeInset);
			$("#map_character_eye2").css("left", $(`#map_character`).width() - $("#map_character_eye2").width() - eyeInset);
			$("#map_character_eye1").css("top", ($(`#map_character`).height()/2 - $("#map_character_eye1").height()) / 2);
			$("#map_character_eye2").css("top", ($(`#map_character`).height()/2) +($(`#map_character`).height()/2 - $("#map_character_eye2").height()) / 2);
			break;
		case "SOUTH":
			$("#map_character_eye1").css("left", ($(`#map_character`).width()/2 - $("#map_character_eye1").width()) / 2);
			$("#map_character_eye2").css("left", ($(`#map_character`).width()/2) +($(`#map_character`).width()/2 - $("#map_character_eye2").width()) / 2);
			$("#map_character_eye1").css("top", $(`#map_character`).height() - $("#map_character_eye1").width() - eyeInset);
			$("#map_character_eye2").css("top", $(`#map_character`).height() - $("#map_character_eye2").width() - eyeInset);
			break;
		case "WEST":
			$("#map_character_eye1").css("left", eyeInset);
			$("#map_character_eye2").css("left", eyeInset);
			$("#map_character_eye1").css("top", ($(`#map_character`).height()/2 - $("#map_character_eye1").height()) / 2);
			$("#map_character_eye2").css("top", ($(`#map_character`).height()/2) +($(`#map_character`).height()/2 - $("#map_character_eye2").height()) / 2);
			break;
	}
}

//Add the player and goal to the hierarchy
function setupHierarchy(){
	var htmlToAdd = "Play Objects in scene:<br/><br/>";
	htmlToAdd+= `<li>Maze <div class="colourSwatch" style="background-color: #ff1d1d"></div></li>`;
		htmlToAdd+= `<li>Character <div class="colourSwatch" style="background-color: ${$("#map_character").css("background-color")}"></div></li>`;
		htmlToAdd+= `<li>Goal <div class="colourSwatch" style="background-color: ${$("#map_goal").css("background-color")}"></div></li>`;
  
  $("#hierarchy:first p").html(htmlToAdd);
}

function turnRight(){
	switch(characterDirection){
		case "NORTH":
			characterDirection = "EAST";
			break;
		case "EAST":
			characterDirection = "SOUTH";
			break;
		case "SOUTH":
			characterDirection = "WEST";
			break;
		case "WEST":
			characterDirection = "NORTH";
			break;
	}
	positionCharacterEyes();
}

function turnLeft(){
	switch(characterDirection){
		case "NORTH":
			characterDirection = "WEST";
			break;
		case "EAST":
			characterDirection = "NORTH";
			break;
		case "SOUTH":
			characterDirection = "EAST";
			break;
		case "WEST":
			characterDirection = "SOUTH";
			break;
	}
	positionCharacterEyes();
}

//This needs changing for the mapchallengetext
runSwitchToggle = function(){
  if(isRunning){
    stopBlocks();
  }
  else{
  	if(usingBlockly){
  		executeInstructions(Blockly.JavaScript.workspaceToCode(workspace));    
  	}else{
  		executeInstructions(myCodeMirror.getDoc().getValue());
  	}
		
  }
};




//add instructions to list repeat them slowly
var instructionIndex = 0;
var instructionsToRun = new Array();
var repeating;
var timeInbetween = 600;
function executeInstructions(code){
  isRunning = true;
  runSwitchTurnOn();
  tintPanel($("#blocklyArea"), "black");
	//split the code into individual function strings
	if(!usingBlockly){
			tintPanel($("#codeAreaParent"), "white");
	}

	var currentFunction = "";
	instructionsToRun = new Array();
	instructionIndex = 0;
	//Add newline to end if not already there
	if(code[code.length-1] != ';' && code[code.length-1] != '\n'){
		code+=';';
	}
	var isComment = false;
	for(var i = 0; i < code.length; i++){
		if(isComment){
			if(code[i] == '\n'){
				isComment = false;
			}
		}
		if(i < code.length-1 && !isComment){
			if(code[i] == '/' && code[i+1] == '/'){
				isComment = true;
				i++;
			}
		}
		if(!isComment && code[i] != '\n'){
			currentFunction+= code[i];
			if(code[i] == ';' || code[i] == '\n'){
				instructionsToRun.push(currentFunction);
				currentFunction = "";
			}
		}

	}
	for(var i = 0; i < instructionsToRun.length; i++){
		console.log(`instructionsToRun[${i}]: ${instructionsToRun[i]}`);
	}
	if(instructionsToRun.length > 0){
		repeating = setInterval(executeNextInstruction, timeInbetween);	
	}

}

function executeNextInstruction(){

	if(instructionIndex >= instructionsToRun.length){
		console.log("End of instructions");
		clearInterval(repeating);
		runSwitchToggle();
		return;
	}
	//Find errors (check against 3 legal function names)
	if(instructionsToRun[instructionIndex].includes("turnRight") || instructionsToRun[instructionIndex].includes("turnLeft") || instructionsToRun[instructionIndex].includes("moveForward")){
		//valid
		if(!(instructionsToRun[instructionIndex].includes('(') && instructionsToRun[instructionIndex].includes(')'))){
			console.error("Invalid function call");
		}
	}


	runScript(instructionsToRun[instructionIndex]);
	instructionIndex++;
}

function moveForward(numberOfSpaces){
	clearInterval(repeating);
	if(isNaN(numberOfSpaces)){
		console.error("Invalid parameter for function moveForward()");
		instructionIndex++;
		repeating = setInterval(executeNextInstruction, timeInbetween);
		return;
	}
	if(numberOfSpaces <= 0){
		return;
	}else if(numberOfSpaces == null){
		numberOfSpaces = 1;
	}

	
	moveSingleSquareForward();
	if(checkIfCharacterReachedGoal()){
		goalReached(1);
		return;
	}
	numberOfSpaces--;
	if(numberOfSpaces <= 0){
		clearInterval(repeating);
		repeating = setInterval(executeNextInstruction, timeInbetween);
	}else{
		repeating = setInterval(moveForward, timeInbetween, numberOfSpaces);
	}
}

function moveSingleSquareForward(){
	var x = characterCoords.x;
	var y = characterCoords.y;
	switch(characterDirection){
		case "NORTH":
			y--;
			break;
		case "EAST":
			x++;
			break;
		case "SOUTH":
			y++;
			break;
		case "WEST":
			x--;
			break;
	}
	if(currentMap[y][x] == ' ' || y >= currentMap.length || x >= currentMap[0].length){
		console.log(`Can't move there!`);
	}else{
		$(`#mapTile${x}_${y}`).append($(`#map_character`).detach());
		characterCoords.x = x;
		characterCoords.y = y;
	}

}

function moveCharacterTo(x, y){
	if(currentMap[y][x] == ' '){
		console.log(`Can't move there!`);
		return;
	}
	$(`#mapTile${x}_${y}`).append($(`#map_character`).detach());
	characterCoords.x = x;
	characterCoords.y = y;
}

function createGoal(x, y){
	$(`#mapTile${x}_${y}`).append(`<div id="map_goal"></div>`);
	//Cente the goal within the map tile
	$(`#map_goal`).css("left", (($(`#mapTile${x}_${y}`).width() - $(`#map_character`).width()) / 2));
	$(`#map_goal`).css("top", (($(`#mapTile${x}_${y}`).height() - $(`#map_character`).height()) / 2));
}

function checkIfCharacterReachedGoal(){
	return (characterCoords.x == goalCoords.x && characterCoords.y == goalCoords.y);
}

function skipChallenge(){
	disableRunSwitch();
	timeEnd = new Date().getTime();
	attempts++;
	sendChallengeData(0);
	setupNextChallenge();
}

function goalReached(wasSuccessful){
	tintPanel($("body"), "black");
	$("#playArea").append($("#map_message").detach());
	$("#map_message").css("display", "initial");
	disableRunSwitch();
	timeEnd = new Date().getTime();
	attempts++;
	sendChallengeData(wasSuccessful);
}

function sendChallengeData(wasSuccessful){
	var challenge_id = challengeIndex * 1;
	if(!usingBlockly) challenge_id += 3;
  $.ajax({
    url: "http://homepages.cs.ncl.ac.uk/t.rawlings/BlockCoder/php/postChallenge.php",
    type: "POST",
    data: {"challenge_id": challenge_id, "time_start": ''+timeStart, "time_end": ''+timeEnd, "attempts": attempts, "was_successful": wasSuccessful},
    dataType: "json",
    success: function(result){
    	/*console.group("sendChallengeData");
    	console.log(`challenge_id = ${result['challenge']}`);
    	console.log(`time_start = ${result['start']}`);
    	console.log(`time_end = ${result['end']}`);
    	console.log(`attemps = ${result['attempts']}`);
    	console.log(result);
    	console.groupEnd("sendChallengeData");
    	*/
    },
    error: function(xhr, status, error){
    	$("#test").html(xhr + " | " + status + " | " + error);
    	console.error("sendChallengeData()");
    	console.error(error);
    	console.error(xhr);
    	console.error(status);
    }
  });
}

function mapChallengeStop(){
	clearInterval(repeating);
	attempts++;
	moveCharacterTo(startCoords.x, startCoords.y);
	characterDirection = startDirection;
	positionCharacterEyes();
	$("#map_message").css("display", "none");
}


function getGroup(){
	  $.ajax({
    url: "http://homepages.cs.ncl.ac.uk/t.rawlings/BlockCoder/php/getGroup.php",
    type: "GET",
    dataType: "text",
    success: function(result){
    	participantsGroup = result;
    }
  });
}