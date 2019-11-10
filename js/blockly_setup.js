/*
	Setup
*/

//Global blockly variables
var blocklyArea;
var blocklyDiv;
var workspace;
var onresize;
var toolboxId = "toolbox";
//

//Takes the div that blockly will resize with as a parameter
function setupBlockly(blocklyArea){

	//Blockly Resizing Stuff
	blocklyDiv = document.getElementById('blocklyDiv');
	workspace = Blockly.inject(blocklyDiv,
	    {toolbox: document.getElementById(toolboxId),
	  zoom:
         {controls: true,
          wheel: true,
          startScale: 1.0,
          maxScale: 3,
          minScale: 0.3,
          scaleSpeed: 1.2},
     trashcan: true});
	blocklyResize = function(e) {
	  // Compute the absolute coordinates and dimensions of blocklyArea.
	  var element = blocklyArea;
	  var x = 0;
	  var y = 0;
	  do {
	    //x += element.offsetLeft;
	    //y += element.offsetTop;
	    element = element.offsetParent;
	  } while (element);
	  // Position blocklyDiv over blocklyArea.
	  blocklyDiv.style.left = x + 'px';
	  blocklyDiv.style.top = y + 'px';
	  blocklyDiv.style.width = blocklyArea.offsetWidth + 'px';
	  blocklyDiv.style.height = blocklyArea.offsetHeight + 'px';
	  Blockly.svgResize(workspace);
	};
	//window.addEventListener('resize', onresize, false);

	blocklyResize();
	Blockly.svgResize(workspace);
	workspace.addChangeListener(myGenerateBlocklyCode);
	//workspace.addChangeListener(onBlockDelete);
	//workspace.addChangeListener(onBlockCreate);
}

/*
function onBlockDelete(event) {
  if (event.type == Blockly.Events.DELETE) {
    //alert('Congratulations on deleting your first block!')
    //alert(`Block id = ${event.ids[0]}`);
    
    var deletedXml = new XMLSerializer().serializeToString(event.oldXml);
    //alert(deletedXml);

    parser = new DOMParser();
    xmlDoc = parser.parseFromString(deletedXml,"text/xml");
    console.log(xmlDoc);
    var timedBlocksList = xmlDoc.querySelectorAll('[type="time_every_x_seconds"]');

    
    for(var i = 0; i < timedBlocksList.length; i++){
      console.log("time_every_x_seconds deleted");
    }
    
    
  }
}


function onBlockCreate(event) {
  if (event.type == Blockly.Events.CREATE) {
    var createdXml = new XMLSerializer().serializeToString(event.xml);
    parser = new DOMParser();
    xmlDoc = parser.parseFromString(createdXml,"text/xml");

  }
}
*/


//Required function stub.
function blocklyResize(){

}
