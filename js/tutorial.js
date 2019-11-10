function tutorialStart(){
  tintPanel($("body"), "black");
  $(".overlayTint").css("z-index", 199);
  $("#tutorial_parent").css("display", "initial");
  disableRunSwitch();
}

function tutorialIntroClose(){
  cancelTint();
  $("#tutorial_parent").css("display", "none");
  nextTutorialMessage();
  //addToWindow($("#tutorial_blockly"), $("#playArea"));
}

function tutorialEnd(){
  cancelTint();
  $(tutorialOrder[tutorialPosition-1].messageDiv).css("display", "none");
  //Activate the run/stop button so blocks can run
  enableRunSwitch();
  examplesMenu();
}

function tutorialMessage(divToHighlight, messageDiv, locationDiv){
  cancelTint();
  tintAllExcept(divToHighlight);
  addToWindow(messageDiv, locationDiv);
  addToWindow($("#tutorial_buttons"), $("#"+messageDiv[0].id+" > .tutorial_text"));
  $("#tutorial_buttons > input").css("display", "initial");
}

var tutorialPosition = 0;
function nextTutorialMessage(){
  if(tutorialPosition > 0)
    $(tutorialOrder[tutorialPosition-1].messageDiv).css("display", "none");
  if(tutorialPosition >= tutorialOrder.length){
    tutorialEnd();
    return;
  }
  tutorialMessage($(tutorialOrder[tutorialPosition].divToHighlight), $(tutorialOrder[tutorialPosition].messageDiv), $(tutorialOrder[tutorialPosition].locationDiv));
  tutorialPosition++;
}

function previousTutorialMessage(){
  if(tutorialPosition > 1){
    tutorialPosition--;
    $(tutorialOrder[tutorialPosition].messageDiv).css("display", "none");
    tutorialPosition--;
    nextTutorialMessage();
  }

}

function addToWindow(messageDiv, locationDiv){

  var newDiv = locationDiv.append(messageDiv);
  messageDiv.css("display", "initial");

}


var tutorialOrder = [
  {divToHighlight: "#blocklyArea", messageDiv: "#tutorial_blockly", locationDiv: "#playArea"},
  {divToHighlight: "#blocklyArea", messageDiv: "#tutorial_runButton", locationDiv: "#hierarchy"},
  {divToHighlight: "#playArea", messageDiv: "#tutorial_playArea", locationDiv: "#blocklyArea"},
  {divToHighlight: "#codeAreaParent", messageDiv: "#tutorial_codeArea", locationDiv: "#consoleArea"},
  {divToHighlight: "#consoleArea", messageDiv: "#tutorial_console", locationDiv: "#codeAreaParent"}
]