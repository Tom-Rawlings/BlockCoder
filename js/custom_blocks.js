/*
  Create Rectangle
*/
Blockly.Blocks['create_rectangle'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Create Rectangle");
    this.appendValueInput("OBJECT_NAME")
        .setCheck("String")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Name");
    this.appendValueInput("WIDTH")
        .setCheck("Number")
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Width:");
    this.appendValueInput("HEIGHT")
        .setCheck(null)
        .setAlign(Blockly.ALIGN_RIGHT)
        .appendField("Height:");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("Creates a new rectangle with the given width and height and adds it to the centre of the Play Area.");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['create_rectangle'] = function(block) {
  var value_object_name = Blockly.JavaScript.valueToCode(block, 'OBJECT_NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var value_width = Blockly.JavaScript.valueToCode(block, 'WIDTH', Blockly.JavaScript.ORDER_ATOMIC);
  var value_height = Blockly.JavaScript.valueToCode(block, 'HEIGHT', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `addObjectToPlayArea(${value_object_name}, ${value_width}, ${value_height});\n`;
  return code;
};

//-----------

/*

  Start / Stop Events

*/
Blockly.Blocks['event_start'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("          Start     ");
    this.appendStatementInput("CODE")
        .setCheck(null);
    this.setColour(60);
 this.setTooltip("This block will run when start is clicked");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['event_start'] = function(block) {
  var statements_function = Blockly.JavaScript.statementToCode(block, 'CODE');
  // TODO: Assemble JavaScript into code variable.
  var code = 
`function start(){
${statements_function}
}\n`;
  return code;
};


Blockly.Blocks['event_stop'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Stop running");
    this.setPreviousStatement(true, null);
    this.setColour(65);
 this.setTooltip("This block will stop the code running. Use it at the end of your program to avoid having to click the Stop button.");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['event_stop'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'stopBlocks();\n';
  return code;
};

//----------


/*
  PlayObject Move To
*/
Blockly.Blocks['movement_moveto'] = {
  init: function() {
    this.appendValueInput("OBJECT_NAME")
        .setCheck("String")
        .appendField("Move");
    this.appendValueInput("POSX")
        .setCheck("Number")
        .appendField("To x:");
    this.appendValueInput("POSY")
        .setCheck("Number")
        .appendField("y:");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Moves the named object to the given coordinates ");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['movement_moveto'] = function(block) {
  var value_object_name = Blockly.JavaScript.valueToCode(block, 'OBJECT_NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var value_posx = Blockly.JavaScript.valueToCode(block, 'POSX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_posy = Blockly.JavaScript.valueToCode(block, 'POSY', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `movePlayObjectTo(${value_object_name}, ${value_posx}, ${value_posy});\n`;
  return code;
};




Blockly.Blocks['movement_moveby'] = {
  init: function() {
    this.appendValueInput("OBJECT_NAME")
        .setCheck("String")
        .appendField("Move");
    this.appendValueInput("POSX")
        .setCheck("Number")
        .appendField("By x:");
    this.appendValueInput("POSY")
        .setCheck("Number")
        .appendField("y:");
    this.setInputsInline(true);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("Moves the named object by the given amounts");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['movement_moveby'] = function(block) {
  var value_object_name = Blockly.JavaScript.valueToCode(block, 'OBJECT_NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var value_posx = Blockly.JavaScript.valueToCode(block, 'POSX', Blockly.JavaScript.ORDER_ATOMIC);
  var value_posy = Blockly.JavaScript.valueToCode(block, 'POSY', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `movePlayObjectByXY(${value_object_name}, ${value_posx}, ${value_posy});\n`;
  return code;
};


Blockly.Blocks['movement_get_position'] = {
  init: function() {
    this.appendValueInput("OBJECT")
        .setCheck("String")
        .appendField("Get");
    this.appendDummyInput()
        .appendField(new Blockly.FieldDropdown([["x","x"], ["y","y"]]), "COORD")
        .appendField("position");
    this.setOutput(true, "Number");
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['movement_get_position'] = function(block) {
  var value_object = Blockly.JavaScript.valueToCode(block, 'OBJECT', Blockly.JavaScript.ORDER_ATOMIC);
  var dropdown_coord = block.getFieldValue('COORD');
  // TODO: Assemble JavaScript into code variable.
  var code = `getPlayObjectByName(${value_object}).coordinates.${dropdown_coord}\n`;
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

//--------------

/*
  Change Play Object Colour
*/
Blockly.Blocks['colour_change_colour'] = {
  init: function() {
    this.appendValueInput("OBJECT_NAME")
        .setCheck("String")
        .appendField("Change colour of");
    this.appendDummyInput()
        .appendField("to");
    this.appendValueInput("COLOUR")
        .setCheck(null);
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(20);
 this.setTooltip("Changes the colour of the specified object");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['colour_change_colour'] = function(block) {
  var value_object_name = Blockly.JavaScript.valueToCode(block, 'OBJECT_NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var value_colour = Blockly.JavaScript.valueToCode(block, 'COLOUR', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `changePlayObjectColour(${value_object_name}, ${value_colour});\n`;
  return code;
};



//---------


/*
  Play object move to
*/

Blockly.Blocks['playobject_move_to_dropdown'] = {
  init: function() {
    this.appendStatementInput("NAME")
        .setCheck("String")
        .appendField("Move Play Object ")
        .appendField(new Blockly.FieldVariable("last created"), "NAME");
    this.appendValueInput("POS")
        .setCheck("Number")
        .appendField("To:   x")
        .appendField(new Blockly.FieldNumber(0), "xPos")
        .appendField("y")
        .appendField(new Blockly.FieldNumber(0), "yPos");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['playobject_move_to_dropdown'] = function(block) {
  var variable_name = Blockly.JavaScript.variableDB_.getName(block.getFieldValue('NAME'), Blockly.Variables.NAME_TYPE);
  var statements_name = Blockly.JavaScript.statementToCode(block, 'NAME');
  var number_xpos = block.getFieldValue('xPos');
  var number_ypos = block.getFieldValue('yPos');
  var value_pos = Blockly.JavaScript.valueToCode(block, 'POS', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `movePlayObjectTo("${variable_name}", ${variable_name}, ${number_ypos});\n`;
  return code;
};


//----------


/*
  Last created play object
*/
Blockly.Blocks['create_last_created'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("String")
        .appendField("Last created object");
    this.setOutput(true, null);
    this.setColour(180);
 this.setTooltip("Gets the name of the last created Play Object");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['create_last_created'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = 'getLastCreatedPlayObjectName()';
  // TODO: Change ORDER_NONE to the correct strength.
  return [code, Blockly.JavaScript.ORDER_NONE];
};

//---


/*
  
  Category - Input

*/

Blockly.Blocks['event_button_pressed'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("When")
        .appendField(new Blockly.FieldDropdown([["Space","KEYCODE_SPACE"], ["Left arrow key","KEYCODE_LEFT"], ["Right arrow key","KEYCODE_RIGHT"], ["Up arrow key","KEYCODE_UP"], ["Down arrow key","KEYCODE_DOWN"], ["Escape","KEYCODE_ESCAPE"]]), "KEY")
        .appendField("is pressed");
    this.appendStatementInput("ACTIONS")
        .setCheck(null);
    this.setColour(60);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['event_button_pressed'] = function(block) {
  var dropdown_key = block.getFieldValue('KEY');
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
  // TODO: Assemble JavaScript into code variable.
  var code = ''+
`inputsUsed.push("${dropdown_key}");\n`+
`function buttonPressed_${dropdown_key}(){
${statements_actions}}\n`;
  return code;
};



Blockly.Blocks['event_onclick'] = {
  init: function() {
    this.appendValueInput("OBJECT_NAME")
        .setCheck("String")
        .appendField("When");
    this.appendDummyInput()
        .appendField("is clicked");
    this.appendStatementInput("ACTIONS")
        .setCheck(null);
    this.setColour(60);
 this.setTooltip("Runs the specified code whenever the named Play Object is clicked.");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['event_onclick'] = function(block) {
  var value_object_name = Blockly.JavaScript.valueToCode(block, 'OBJECT_NAME', Blockly.JavaScript.ORDER_ATOMIC);
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
  // TODO: Assemble JavaScript into code variable.
  var code = `document.getElementById(getPlayObjectByName(${value_object_name}).getId()).onclick = function(){
${statements_actions}
};\n`;
  return code;
};



/*

  Category - Time

*/


Blockly.Blocks['time_wait_milliseconds'] = {
  init: function() {
    this.appendValueInput("AMOUNT")
        .setCheck("Number")
        .appendField("Wait for");
    this.appendDummyInput()
        .appendField("milliseconds");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(60);
 this.setTooltip("Pauses for the given number of milliseconds before resuming");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['time_wait_milliseconds'] = function(block) {
  var value_amount = Blockly.JavaScript.valueToCode(block, 'AMOUNT', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `setTimeout(afterWait${waitingFunctionsNameSuffix}, ${value_amount});
} 
function afterWait${waitingFunctionsNameSuffix}(){
\n`;
  waitingFunctionsNameSuffix++;
  return code;
};


Blockly.Blocks['time_repeat_milliseconds'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Repeat every")
        .appendField(new Blockly.FieldNumber(0), "AMOUNT")
        .appendField("milliseconds");
    this.appendStatementInput("ACTIONS")
        .setCheck(null);
    this.setColour(60);
 this.setTooltip("This function will continuously repeat every X milliseconds");
 this.setHelpUrl("");
  }
};



Blockly.JavaScript['time_repeat_milliseconds'] = function(block) {
  var number_amount = block.getFieldValue('AMOUNT');
  var statements_actions = Blockly.JavaScript.statementToCode(block, 'ACTIONS');
  // TODO: Assemble JavaScript into code variable.
  var code = `function repeatingFunction${repeatingFunctionsNameSuffix}_${number_amount}ms(){
  var thisFunctionId = ${repeatingFunctionsNameSuffix};
  ${statements_actions}}
repeatingFunctions.push(setInterval(repeatingFunction${repeatingFunctionsNameSuffix}_${number_amount}ms, ${number_amount}));\n`;
  repeatingFunctionsNameSuffix++;
  return code;
};


Blockly.Blocks['event_stop_repeating_function'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Stop this repeating function");
    this.setPreviousStatement(true, null);
    this.setColour(60);
 this.setTooltip("Stops the repeating function that it's placed inside");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['event_stop_repeating_function'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = `clearInterval(repeatingFunctions[thisFunctionId]);
return;\n`;
  return code;
};


//-----------------


/*
  Remove Rectangle
*/

Blockly.Blocks['remove_rectangle'] = {
  init: function() {
    this.appendValueInput("NAME")
        .setCheck("String")
        .appendField("Remove");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("Removes the selected rectangle from the Play Area");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['remove_rectangle'] = function(block) {
  var value_name = Blockly.JavaScript.valueToCode(block, 'NAME', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `removePlayObject(${value_name});\n`;
  return code;
};


/*
  Remove All
*/

Blockly.Blocks['remove_all'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Clear the Play Area");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(180);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['remove_all'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'removeAllPlayObjects();\n';
  return code;
};

//---------------


Blockly.Blocks['text_alert'] = {
  init: function() {
    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Alert");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(150);
 this.setTooltip("Alerts the given text at the top of the browser window");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['text_alert'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `alert(${value_text});\n`;
  return code;
};



Blockly.Blocks['text_consoleprint'] = {
  init: function() {
    this.appendValueInput("TEXT")
        .setCheck("String")
        .appendField("Print");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(150);
 this.setTooltip("Prints the given text to the console.");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['text_consoleprint'] = function(block) {
  var value_text = Blockly.JavaScript.valueToCode(block, 'TEXT', Blockly.JavaScript.ORDER_ATOMIC);
  // TODO: Assemble JavaScript into code variable.
  var code = `console.log(${value_text});\n`;
  return code;
};

/*
  Map blocks
*/

Blockly.Blocks['map_turn_right'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn right");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
 this.setTooltip("Turns the character 90° to the right");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['map_turn_right'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'turnRight();\n';
  return code;
};


Blockly.Blocks['map_turn_left'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Turn left");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(240);
 this.setTooltip("Turns the character 90° to the left");
 this.setHelpUrl("");
  }
};


Blockly.JavaScript['map_turn_left'] = function(block) {
  // TODO: Assemble JavaScript into code variable.
  var code = 'turnLeft();\n';
  return code;
};


Blockly.Blocks['map_move_forward'] = {
  init: function() {
    this.appendDummyInput()
        .appendField("Move forward ")
        .appendField(new Blockly.FieldNumber(1, 0), "SPACES")
        .appendField("spaces");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(230);
 this.setTooltip("");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['map_move_forward'] = function(block) {
  var number_spaces = block.getFieldValue('SPACES');
  // TODO: Assemble JavaScript into code variable.
  var code = `moveForward(${number_spaces});\n`;
  return code;
};

//------

/*
  Test Block
*/

Blockly.Blocks['test_testblock'] = {
  init: function() {
    this.appendValueInput("VALUE")
        .setCheck(null)
        .appendField("Test value:");
    this.appendDummyInput()
        .appendField("Test amount")
        .appendField(new Blockly.FieldNumber(0), "AMOUNT");
    this.setPreviousStatement(true, null);
    this.setNextStatement(true, null);
    this.setColour(0);
 this.setTooltip("TEST");
 this.setHelpUrl("");
  }
};

Blockly.JavaScript['test_testblock'] = function(block) {
  var value_value = Blockly.JavaScript.valueToCode(block, 'VALUE', Blockly.JavaScript.ORDER_ATOMIC);
  var number_amount = block.getFieldValue('AMOUNT');
  // TODO: Assemble JavaScript into code variable.
  value_value = value_value.substring(1, value_value.length - 2);
  var code = `${value_value}\n`;
  return code;
};



/*
  var code = `var startTime = new Date().getTime()\n;
  $('#mainWindow').hide().show(0);
  while ( new Date().getTime() < (startTime + ${number_amount}) ){\n
    console.log(new Date().getTime());
    console.log(startTime + ${number_amount});
  }\n`;
*/

//------------