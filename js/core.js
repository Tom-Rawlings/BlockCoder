/*
  Global Variables
*/
var lastConsoleCommand = "";
var activePlayObjects = new Array();
var inputsUsed = new Array();
var onclicksUsed = new Array();
var repeatingFunctions = new Array();
var repeatingFunctionsNameSuffix = 0;
var waitingFunctionsNameSuffix = 0;
var playObjectDictionary = {};
var playObjectIds = 0;
var isMapChallenge = false;
var isRunning = false;

var playPanX = 0;
var playPanY = 0;

var myCodeMirror;

var settings = {
  "clearPlayArea": true
};
//---

class Coord2d{
  constructor(x, y){
    this.x = x;
    this.y = y;
  }

  toString(){
    return `(${this.x},${this.y})`;
  }
}


function removePixelUnits(pixelString){
  return pixelString.substring(0, pixelString.length-2) - 0;
}

/*
	Input
*/

var keyCodes = {
  KEYCODE_SPACE: 32,
  KEYCODE_LEFT: 37,
  KEYCODE_UP: 38,
  KEYCODE_RIGHT: 39,
  KEYCODE_DOWN: 40,
  KEYCODE_ESCAPE: 27,
  KEYCODE_ENTER: 13
};

function checkKeyDownEditor(e) {

    e = e || window.event;

    //UP
    if (e.keyCode == '38') {
    	//panPlayArea(0, -10);
    }

    //DOWN
    if (e.keyCode == '40') {
    	//panPlayArea(0, 10);
		}

    //LEFT
    if (e.keyCode == '37') {
    	//panPlayArea(-10, 0);
    }
    //RIGHT
    if (e.keyCode == '39') {
			//panPlayArea(10, 0);
    }

    //SPACE
    //*
    if(e.keyCode == '32'){
      //keyCode32();
      resizeToFillWindow();
    }
    //*/

    //ENTER
    if (e.keyCode == '13') {
    	if($("#consoleInput").is(':focus'))
	    	runConsoleCommand();
    }


}

//---

  var scaleSet = {
    "blockly_PlayArea": 0.75,
    "playArea": 0.8,
    "console": 0.4,
    "blocklyArea": 0.6
  };

function setupWindows(windowDiv){

  if(windowDiv[0].id == "mainWindow"){
    //Main parent window
    if(isMapChallenge){
      windowDiv = new ContentWindow(null, $(window).width(), $(window).height(), windowDiv[0]).getDiv();
    }else{
      windowDiv = new ContentWindow(null, $(window).width(), $(window).height() - 30, windowDiv[0]).getDiv();
      windowDiv.css("top", 30);
    }

    /* OLD
    if(isMapChallenge){
      $("#menuBar").css("display", "none");
      windowDiv = new ContentWindow(null, $(window).width(), $(window).height(), windowDiv[0]).getDiv();
    }else{
      windowDiv = new ContentWindow(null, $(window).width(), $(window).height() - 30, windowDiv[0]).getDiv();
      windowDiv.css("top", 30);
    }
    */

  }

  if(windowDiv.children(".leftWindow:first").length){

    leftDiv = windowDiv.children(".leftWindow:first")[0];
    rightDiv = windowDiv.children(".rightWindow:first")[0];
    var scaleFactor = scaleSet[leftDiv.id];
    if(scaleFactor == null)
      scaleFactor = 0.5;
    getContentWindowFromDiv(windowDiv).splitHorizontally(scaleFactor, leftDiv, rightDiv);
    var leftWindow = activeContentWindows[activeContentWindows.length-2].getDiv();
    var rightWindow = activeContentWindows[activeContentWindows.length-1].getDiv();
    setupWindows(leftWindow);
    setupWindows(rightWindow);

  }else if(windowDiv.children(".topWindow:first").length){
    topDiv = windowDiv.children(".topWindow:first")[0];
    bottomDiv = windowDiv.children(".bottomWindow:first")[0];
    var scaleFactor = scaleSet[topDiv.id];
    if(scaleFactor == null)
      scaleFactor = 0.5;
    getContentWindowFromDiv(windowDiv).splitVertically(scaleFactor, topDiv, bottomDiv);
    var topWindow = activeContentWindows[activeContentWindows.length-2].getDiv();
    var bottomWindow = activeContentWindows[activeContentWindows.length-1].getDiv();
    setupWindows(topWindow);
    setupWindows(bottomWindow);

  }
}

function setupInputs(){
  var functionString = `    if (e.keyCode == '13') {
      if($("#consoleInput").is(':focus'))
        runConsoleCommand();
    }`;
  for(var i = 0; i < inputsUsed.length; i++){
    functionString += `if(e.keyCode == '${keyCodes[inputsUsed[i]]}')buttonPressed_${inputsUsed[i]}();`
  }
  document.onkeydown = new Function('e',functionString);
}

function runSwitchToggle(){
  if(isRunning){
    stopBlocks();
  }
  else{
    runBlocks();
  }
}

function disableRunSwitch(){
  $("#runSwitch").prop("onclick", null).off("click");
  tintPanel($("#runSwitch"), "black");
}

function enableRunSwitch(){
  $("#runSwitch").click(runSwitchToggle);
  cancelTint();
  runSwitchTurnOff();
  isRunning = false;
}

function runSwitchTurnOff(){
  $("#runHalf").removeClass("runSwitchDim");
  $("#runHalf").addClass("runSwitchLit");
  $("#stopHalf").removeClass("runSwitchLit");
  $("#stopHalf").addClass("runSwitchDim");
}

function runSwitchTurnOn(){
  $("#runHalf").addClass("runSwitchDim");
  $("#runHalf").removeClass("runSwitchLit");
  $("#stopHalf").addClass("runSwitchLit");
  $("#stopHalf").removeClass("runSwitchDim");
}

function runBlocks(){
  isRunning = true;
  runSwitchTurnOn();
  var code = myCodeMirror.getValue();
  console.log("Running code...");
  if(code == ""){
    console.log("Nothing to run!!");
    stopBlocks();
    return;
  }
  tintPanel($("#blocklyArea"), "black");

  //Clear play area if set
  console.log(`settings["clearPlayArea"] = ${settings["clearPlayArea"]}`);
  var setupCode = "";
  if(settings["clearPlayArea"]){
    setupCode = "removeAllPlayObjects();";
  }

  //Add try catch so that start() runs first
  code = `try{${setupCode} start()}catch{}\n` + code;
  runScript(code);

  if(isRunning)
    setupInputs();

}

function stopBlocks(){
  console.log("stop");
  isRunning = false;
  runSwitchTurnOff();
  cancelTint();
  document.onkeydown = checkKeyDownEditor;
  for(var i = 0; i < repeatingFunctions.length; i++){
    clearInterval(repeatingFunctions[i]);
  }
  repeatingFunctions = new Array();
  inputsUsed = new Array();
  clearOnclicks();
  if(isMapChallenge){
    mapChallengeStop();
  }
}

function clearOnclicks(){
  for(var i = 0; i < activePlayObjects.length; i++){
    document.getElementById(activePlayObjects[i].getId()).onclick = function(){};
  }
}

function tintPanel(div, colour){
  div.append(`<div class="overlayTint" style="background-color: ${colour}"></div>`);
  div.children(".overlayTint:first").css("display", "initial");
}

function tintAllExcept(div){
  var divsToTint = {
    "playArea": $("#playArea"),
    "blocklyArea": $("#blocklyArea"),
    "consoleArea": $("#consoleArea"),
    "menuBar": $("#menuBar"),
    "hierarchy": $("#hierarchy"),
    "codeAreaParent": $("#codeAreaParent")
  }
  for (var key in divsToTint) {
      if (divsToTint.hasOwnProperty(key)) {           
          tintPanel(divsToTint[key], "black");
      }
  }
  $(".overlayTint").css("z-index", 199);
  $(".overlayTint").css("opacity", 0.75);
  div.children(".overlayTint:first").remove();
}

function cancelTint(){
  $(".overlayTint").remove();
}

function myGenerateBlocklyCode(event) {
  repeatingFunctionsNameSuffix = 0;
  waitingFunctionsNameSuffix = 0;
  generateBlocklyCode();
}

/*
function generateBlocklyCode(event) {
  generateBlocklyCode();
}
*/

/*
	Resizing and positioning
*/

function resize(e) {
	e.preventDefault();
  $("#blocklyArea").css("width", e.pageX - document.getElementById("blocklyArea").getBoundingClientRect().left + 'px');
	$("#blocklyArea").css("height", ($(window).height()/3*2)+"px");
	resizePlayArea();
  onresize();
  resizeConsole();
  positionRunButton();
}

function resizeConsole(){
  $("#consoleText").css("height", $("#consoleArea").height() - $("#consoleHeader").height() - $("#consoleFooter").height());
}



//Scrolls the element to the bottom when called
//Used so that console always shows latest entry
function scrollToBottom(element){
  var element = document.getElementById(element);
  element.scrollTop = element.scrollHeight;
}

function centrePlayArea(){
  var playAreaWidth = $("#playArea").css("width");
  var playAreaHeight = $("#playArea").css("height");
  $("#centre").css("left", playAreaWidth.substring(0,playAreaWidth.length-2)/2);
  $("#centre").css("top", playAreaHeight.substring(0,playAreaHeight.length-2)/2);
  for(var i = 0; i < activePlayObjects.length; i++){
    activePlayObjects[i].move();
  }
  //repositionGrid();
}

function positionRunButton(){
	var blocklyHeight = $("#blocklyArea").css("height");
	var blocklyWidth = $("#blocklyArea").css("width");
	$("#runButton").css("position", "absolute");
	$("#runButton").css("left", blocklyWidth.substring(0, blocklyWidth.length-2)-140);
	$("#runButton").css("top", blocklyHeight.substring(0, blocklyHeight.length-2)-60);
  $("#stopButton").css("position", "absolute");
  $("#stopButton").css("left", blocklyWidth.substring(0, blocklyWidth.length-2)-140);
  $("#stopButton").css("top", blocklyHeight.substring(0, blocklyHeight.length-2)-40);
}

function cancelResize(e){
	window.removeEventListener("mousemove", resize);
}
//---


/*
	Play area stuff
*/

function makePlayAreaPannable(){
	var playArea = document.getElementById("playArea");

	playArea.addEventListener("mousedown", function(e){
		playPanX = e.pageX;
		playPanY = e.pageY;
		window.addEventListener("mousemove", panPlayAreaWithMouse);
		window.addEventListener("mouseup", cancelPlayAreaPan)
	});
}

function panPlayAreaWithMouse(e){
	e.preventDefault();
	//Move centre
	var amountX = e.pageX - playPanX;
	var amountY = e.pageY - playPanY;
	playPanX = e.pageX;
	playPanY = e.pageY;
	$("#centre").css("top", removePixelUnits($("#centre").css("top")) + amountY + "px");
	$("#centre").css("left", removePixelUnits($("#centre").css("left")) +amountX + "px");
	var playObject;
	for(var i = 0; i < activePlayObjects.length; i++){
		playObject = activePlayObjects[i].id;
		$(`#${playObject}`).css("top", removePixelUnits($(`#${playObject}`).css("top")) + amountY + "px");
		$(`#${playObject}`).css("left", removePixelUnits($(`#${playObject}`).css("left")) +amountX + "px");
	}
  //repositionGrid();
}

function cancelPlayAreaPan(){
	window.removeEventListener("mousemove", panPlayAreaWithMouse);
}


//Creates a new div in the centre of the play area with the given id
function addObjectToPlayArea(name, width, height){
	var currentId = playObjectIds;

	//$("#playArea").html($("#playArea").html() + `<div id="playObject${currentId}"></div>`);
  $("#playArea").append(`<div id="playObject${currentId}"></div>`);
	var style = {
		"width": width + "px",
		"height": height + "px",
		"position": "absolute",
		"background-color": "black"
	}
	$(`#playObject${currentId}`).css(style);
 
	activePlayObjects.push(new PlayObject(name, width, height));
	playObjectDictionary[name] = currentId;

  updateHierarchy();

}


function removePlayObject(name){
  for(var i = 0; i < activePlayObjects.length; i++){
    if(activePlayObjects[i].name == name){
      activePlayObjects[i].delete();
      activePlayObjects.splice(i, 1);
    }
  }
  updateHierarchy();
}

function removeAllPlayObjects(){
  for(var i = 0; i < activePlayObjects.length; i++){
    activePlayObjects[i].delete();
  }
  activePlayObjects = new Array();
  updateHierarchy();
}

function movePlayObjectByXY(name, amountX, amountY){
	for(var i = 0; i < activePlayObjects.length; i++){
		if (activePlayObjects[i].name == name){
			activePlayObjects[i].moveBy(amountX, amountY);
			break;
		}
		
	}
  updateHierarchy();
}

function movePlayObjectBy(name, direction, amount){
  var amountX = 0;
  var amountY = 0;
  switch(direction){
      case "UP":
        amountY = amount;
        break;
      case "DOWN":
          amountY = -amount;
        break;
      case "LEFT":
          amountX = -amount;
        break;
      case "RIGHT":
        amountX = amount;
        break;
  }
  getPlayObjectByName(name).moveBy(amountX, amountY);
  updateHierarchy();
}

function movePlayObjectTo(name, x, y){
	getPlayObjectByName(name).moveTo(x, y);
  updateHierarchy();
}

function changePlayObjectColour(name, colour){
	getPlayObjectByName(name).changeColour(colour);
  updateHierarchy();
}

function getPlayObjectByName(name){
  timerStart();
	for(var i = 0; i < activePlayObjects.length; i++){
		if(activePlayObjects[i].name == name){
      return activePlayObjects[i];
    }
	}
	console.error(`getPlayObjectByName() -- ${name} not found`);
	return null;
	
}

function getPlayObjectByName2(name){
  var playObject = playObjectDictionary[name];
  if(playObject == null)
    console.error(`getPlayObjectByName() -- ${name} not found`);
  return playObject;
}

/*
  Timer Stuff
*/
var initialTime = 0;
function timerStart(){
  initialTime = new Date().getTime();
  return initialTime;
}

function timerStop(){
  return ((new Date().getTime()) - initialTime);
}

/*      */

function getLastCreatedPlayObjectName(){
  if(activePlayObjects.length < 1)
    console.log("No Play Objects exist!");
  return activePlayObjects[activePlayObjects.length-1].name;
}

function getPlayObjectById(id){
  for(var i = 0; i < activePlayObjects.length; i++){
    if(activePlayObjects[i].id == id)
      return activePlayObjects[i];
  }
  console.error(`getPlayObjectById() -- ${id} not found`);
  return null;
  
}

function panPlayArea(amountX, amountY){
	//Move centre
	$("#centre").css("top", removePixelUnits($("#centre").css("top")) + amountY + "px");
	$("#centre").css("left", removePixelUnits($("#centre").css("left")) +amountX + "px");
	var id;
	for(var i = 0; i < activePlayObjects.length; i++){
		id = activePlayObjects[i].id;
		$(`#playObject${id}`).css("top", removePixelUnits($(`#playObject${id}`).css("top")) + amountY + "px");
		$(`#playObject${id}`).css("left", removePixelUnits($(`#playObject${id}`).css("left")) +amountX + "px");
	}
}



function updateHierarchy(){
  var htmlToAdd = "Play Objects in scene:<br/><br/>";
  for(var i = 0; i < activePlayObjects.length; i++){
    htmlToAdd+= "<li>"+activePlayObjects[i].name + " " + `<div class="colourSwatch" style="background-color: ${activePlayObjects[i].colour}"></div> ${activePlayObjects[i].coordinates.x}, ${activePlayObjects[i].coordinates.y}</li>`;
  }
  $("#hierarchy:first p").html(htmlToAdd);

}

function calculatePlayObjectDropdown(){
  var dropdown = new Array();
  dropdown.push(["last created", activePlayObjects[activePlayObjects.length-1].getId()]);
  for(var i = 0; i < activePlayObjects.length; i++){
    dropdown.push([activePlayObjects[i].name, activePlayObjects[i].name]);
  }


  return dropdown;
}

function workspaceToXml(){
  var workspaceXml = Blockly.Xml.workspaceToDom(Blockly.mainWorkspace);
  return workspaceXml;
}

function workspaceFromXml(xml){
  console.log("xml 1");
  console.log(xml);
  //xml = new DOMParser().parseFromString(xml, "text/xml");
  console.log("xml 2");
  console.log(xml);

  xml = Blockly.Xml.textToDom(xml);
  Blockly.Xml.clearWorkspaceAndLoadFromXml(xml, Blockly.mainWorkspace);
}

function playObjectsToJsonString(){
  if(activePlayObjects.length == 0) return "";
  var jsonString = '{ "activePlayObjects" : [';
  for(var i = 0; i < activePlayObjects.length; i++){
    jsonString += `{"name":"${activePlayObjects[i].name}",` +
                  `"coordinates" : {"x":"${activePlayObjects[i].coordinates.x}","y":"${activePlayObjects[i].coordinates.y}"},`+
                  `"width" : "${activePlayObjects[i].width}",`+
                  `"height" : "${activePlayObjects[i].height}",`+
                  `"colour" : "${activePlayObjects[i].colour}"},`;
  }

  jsonString = jsonString.substring(0, jsonString.length-1);
  jsonString += ']}';
  return jsonString;
}


function loadPlayObjectsFromJsonString(playObjectsString){
  removeAllPlayObjects();
  if(playObjectsString == "") return;
  var playObjects = JSON.parse(playObjectsString).activePlayObjects;
  console.log(`playObjects = ${playObjects}`);
  for(var i = 0; i < playObjects.length; i++){
    addObjectToPlayArea(playObjects[i].name, playObjects[i].width, playObjects[i].height);
    changePlayObjectColour(playObjects[i].name, playObjects[i].colour);
    movePlayObjectTo(playObjects[i].name, playObjects[i].coordinates.x, playObjects[i].coordinates.y);
  }

}

var isMenuPanelOpen = false;
function toggleMenuPanelPopup(){
  if(isMenuPanelOpen){
    //Disable all menus
    $("#menuPopup").css("display", "none");
    $(".menuPopup-loadMenu").css("display", "none");
    $(".menuPopup-saveMenu").css("display", "none");
    $("#menuPopup-optionsMenu").css("display", "none");
    $("#menuPopup-examplesMenu").css("display", "none");
    isMenuPanelOpen = false;
    cancelTint();
  }else{
    $("#menuPopup").css("display", "initial");
    isMenuPanelOpen = true;
    tintPanel($("body"), "black");
    $(".overlayTint").css("z-index", 199);
  }
  return isMenuPanelOpen;
}


function optionsMenu(){
  if(!toggleMenuPanelPopup()) return;
  setupOptions();
  $("#menuPopup > textarea").css("display", "none");
  $("#menuPopup-optionsMenu").css("display", "initial");
}

function saveWorkspace(){
  if(!toggleMenuPanelPopup()) return;
  $(".menuPopup-saveMenu").css("display", "initial");
  $("#menuPopup > textarea").css("display", "initial");
  var oSerializer = new XMLSerializer();
  var sXML = oSerializer.serializeToString(workspaceToXml());
  //sXML = escapeCharacter(sXML, '`');
  var jsonString = playObjectsToJsonString();
  $("#menuPopup > textarea").val(sXML+"[split]"+jsonString);
}


function escapeCharacter(input, characterToEscape){
  for(var i = 0; i < input.length; i++){
    if(input[i] == characterToEscape){
      console.log(`input[i] = ${input[i]}, characterToEscape = ${characterToEscape}`);
      console.log(`i = ${i}, input[i-1] = ${input[i-1]}`);
      if(i > 0 && input[i-1] == '\\' ){
        console.log("found special case");
        input = insertString(input, "\\\\", i);
        i+=2;
      }else{
        input = insertString(input, '\\', i);
        i++;      
      }
    }
  }
  return input;
}

function insertString(originalString, stringToInsert, insertionPoint){
  return [originalString.slice(0, insertionPoint), stringToInsert, originalString.slice(insertionPoint)].join('');
}

function loadWorkspaceMenu(){
  if(!toggleMenuPanelPopup()) return;
  $("#menuPopup > textarea").css("display", "initial");
  $("#menuPopup > textarea").val("");
  $(".menuPopup-loadMenu").css("display", "initial");
}

function loadWorkspace(){
  var inputData = $("#menuPopup > textarea").val().split("[split]");
  var xml = inputData[0];
  console.log(xml);
  var jsonString = inputData[1];
  workspaceFromXml(xml);
  loadPlayObjectsFromJsonString(jsonString);
  $(".menupPopup-loadMenu").css("display", "none");
  toggleMenuPanelPopup();
  
}

function examplesMenu(){
  if(!toggleMenuPanelPopup()) return;
  $("#menuPopup-examplesMenu").css("display", "initial");
  $("#menuPopup > textarea").css("display", "none");
}

function setupOptions(){
  for(var key in settings) {
    //console.log(key + " = " + settings[key]);
  }
}

function applySetting(settingName){
  settings[settingName] = $(`#menuPopup-optionsMenu input[name=${settingName}]`).is(':checked');
  console.log(`${settingName} = ${settings[settingName]}`);
}

function proceedToMapChallenge(){
  window.location.href = '/t.rawlings/BlockCoder/html/MapChallengeBlockly.html';
}

//loadPlayObjectsFromJsonString(testPlayObjects);