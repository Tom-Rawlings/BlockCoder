

$( document ).ready(function() {

  isMapChallenge = false;

  //Resizable windows setup
  setupWindows($("#mainWindow"));

  var myTextArea = $("#codeArea")[0];
  myCodeMirror = CodeMirror(function(elt) {
    myTextArea.parentNode.replaceChild(elt, myTextArea);
  }, {value: myTextArea.value, theme: "darcula", tabSize: 2});

  myCodeMirror.setSize("100%", "100%");

  generateBlocklyCode = function(){
    var code = Blockly.JavaScript.workspaceToCode(workspace);
    myCodeMirror.getDoc().setValue(code);
    myCodeMirror.refresh();
  }

  //Show everything once it's finished setting up
  $("body").css("display", "initial");

  //Initial setup
  makePlayAreaPannable();




  setupBlockly($("#blocklyDiv").parent()[0]);
  
  overrideConsoleMethods();
  //setupPlayArea();

  //Add hats to blocks
  Blockly.BlockSvg.START_HAT = true;

  //Load default blockly workspace
  //workspaceFromXml(workspace_default);
  
  //Centres the workspace at the start
  workspace.scrollCenter();

  document.onkeydown = checkKeyDownEditor;




  //Resizes everything to fit window
  window.onresize = resizeToFillWindow;

  windowResized = function(){
    blocklyResize();
    myCodeMirror.refresh();
    resizeConsole();
  }
  windowResized();

  //createPlayAreaGrid();
  centrePlayArea();

  
  tutorialStart();

  //Greys out blocks without parents
  workspace.addChangeListener(Blockly.Events.disableOrphans);


  //AJAX test
  /*
  $.ajax({
    url: "http://homepages.cs.ncl.ac.uk/t.rawlings/CodeBlocks/workspace/two-square-animation.txt",
    type: "GET",
    dataType: "text",
    success: function(result){
      console.log(result);
    }
  });
  */


});
