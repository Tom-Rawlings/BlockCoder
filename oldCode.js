//Original blockly inject
var workspace = Blockly.inject('blocklyDiv',
  {toolbox: document.getElementById('toolbox')});

//Override console.exception
oldCallBack = console["exception"];
console["exception"] = function(){
  var args;
  console.logs.push(Array.from(arguments));
  console.stdlog.apply(console, arguments);
  $("#consoleText").html($("#consoleText").html() + '<span class="consoleException">' + console.logs[console.logs.length-1] + "</span><hr/>");
  args = Array.prototype.slice.call(arguments, 0);
  Function.prototype.apply.call(oldCallBack, console, arguments);
}


//Override console.group
oldCallBack = console["group"];
console["group"] = function(){
  var args;
  console.logs.push(Array.from(arguments));
  console.stdlog.apply(console, arguments);
  $("#consoleText").html($("#consoleText").html() + '<span class="consoleException">' + console.logs[console.logs.length-1] + "</span><hr/>");
  args = Array.prototype.slice.call(arguments, 0);
  Function.prototype.apply.call(oldCallBack, console, arguments);
}


/*
  Overriding console stuff
*/
var methods, generateNewMethod, i, j, cur, old, addEvent;

if ("console" in window) {
    methods = [
        "log", "assert", "clear", "count",
        "debug", "dir", "dirxml", "error",
        "exception", "group", "groupCollapsed",
        "groupEnd", "info", "profile", "profileEnd",
        "table", "time", "timeEnd", "timeStamp",
        "trace", "warn"
    ];

    generateNewMethod = function (oldCallback, methodName) {
    		var old
        return function () {
					var args;
			    console.logs.push(Array.from(arguments));
			    console.stdlog.apply(console, arguments);
			    $("#consoleText").html($("#consoleText").html() + `<span class="console-${methodName}">` + console.logs[console.logs.length-1] + "</span><hr/>");
			    args = Array.prototype.slice.call(arguments, 0);
		      Function.prototype.apply.call(oldCallback, console, arguments);
        };
    };

    for (i = 0, j = methods.length; i < j; i++) {
        cur = methods[i];
        if (cur in console) {
            old = console[cur];
            console[cur] = generateNewMethod(old, cur);
        }
    }

}


/*

  Resizer stuff

*/

//Array of all vertical resizers in the page
var activeVerticalResizers = new Array();
class VerticalResizer{
  constructor(parent){
    this.divId = `verticalResizer${activeVerticalResizers.length}`;
    parent.html(parent.html() + 
      `<div id="${this.divId}" class="resizer verticalResizer"></div>`);
    this.topWindows = new Array();
    this.bottomWindows = new Array();

    activeVerticalResizers.push(this);

  }

  getDiv(){
    return $(`#${this.divId}`);
  }

  addTopWindow(w){
    this.topWindows.push(w);
    console.log(`added ${w.toString()} to ${this.getDiv()[0].id} as top window`);
  }
  addBottomWindow(w){
    this.bottomWindows.push(w);
    console.log(`added ${w.toString()} to ${this.getDiv()[0].id} as bottom window`);    
  }

  reposition(){

    //Check the resizer has at least 1 neighbouring window
    if(this.topWindows.length == 0 && this.bottomWindows.length == 0){
      console.error(`${this.divId} has no neighbouring windows.`);
      //return;
    }

    //Calculate necessary width for the resizer based on neighbouring windows
    var topWidth = 0;
    for(var i = 0; i < this.topWindows.length; i++){
      console.log(`topWindows[${i}].getDiv().css("width") = `+this.topWindows[i].getDiv().css("width"));
      topWidth+= removePixelUnits(this.topWindows[i].getDiv().css("width"));
    }

    var bottomWidth = 0;
    for(var i = 0; i < this.bottomWindows.length; i++){
      bottomWidth+= removePixelUnits(this.bottomWindows[i].getDiv().css("width"));
    }
    
    if(topWidth >= bottomWidth)
      this.getDiv().css("width", topWidth+"px");
    else
      this.getDiv().css("width", bottomWidth+"px");

    //set the height of the resizer based on if there's something on both sides
    //(Resizer is twice as thick if there's a window on both sides)
    var height = 4;
    if(this.topWindows.length > 0 && this.bottomWindows.length > 0){
      this.getDiv().css("height", (height*2)+"px");
      console.log(`set ${this.divId} height to ${height*2}px`);
    }
    else{
      this.getDiv().css("height", height+"px");
      console.log(`set ${this.divId} width to ${height}px`);
    }
    

    //position the resizer above its first bottom window
    if(this.bottomWindows.length > 0){
      this.getDiv().css("left", this.bottomWindows[0].getDiv()[0].getBoundingClientRect().left +"px");
      this.getDiv().css("top", this.bottomWindows[0].getDiv()[0].getBoundingClientRect().top +"px");
    }
    //Else position the resizer below it's first top window
    else if(this.topWindows.length > 0){
      this.getDiv().css("left", this.topWindows[0].getDiv()[0].getBoundingClientRect().left +"px");
      this.getDiv().css("top", this.topWindows[0].getDiv()[0].getBoundingClientRect().bottom - height +"px"); 
    }
  }

  resize(e){
    if(currentResizer == null){
      for(var i = 0; i < activeVerticalResizers.length; i++){
        if(activeVerticalResizers[i].getDiv() == e.target){
          currentResizer = activeVerticalResizers[i];
        }
      }
    }

    //Change size of top windows
    for(var i = 0; i < currentResizer.topWindows.length; i++){
      currentResizer.topWindows[i].resize(Sides.BOTTOM, e.pageY);
    }

    //Change size of all bottom windows
    for(var i = 0; i < currentResizer.bottomWindows.length; i++){
      currentResizer.bottomWindows[i].resize(Sides.TOP, e.pageY);
    }
    
    e.preventDefault();
    
    //Reposition all resizors after change
    for(var i = 0; i < activeVerticalResizers.length; i++){
      activeVerticalResizers[i].reposition();
    }
    for(var i = 0; i < activeVerticalResizers.length; i++){
      activeVerticalResizers[i].reposition();
    }
  }

  cancelResize(e){
    window.removeEventListener("mousemove", currentResizer.resize);
    window.removeEventListener("mouseup", currentResizer.cancelResize);
    currentResizer = null;
  }

  debugInfo(){
    var groupName = `${this.divId}`;
    console.group(groupName);
    console.log(`divId = ${this.divId}`);
    console.log(`width = ${this.getDiv().css("width")}`);
    console.log(`height = ${this.getDiv().css("height")}`);
    console.log(`left = ${this.getDiv().css("left")}`);
    console.log(`top = ${this.getDiv().css("top")}`);

    var topWindows = "";
    for(var i = 0; i < this.topWindows.length; i++){
      topWindows += this.topWindows[i].toString() + "\n";
    }
    console.log(`topWindows = ${topWindows}`);
    var bottomWindows = "";
    for(var i = 0; i < this.bottomWindows.length; i++){
      bottomWindows += this.bottomWindows[i].toString() + "\n";
    }
    console.log(`bottomWindows = ${bottomWindows}`);
    console.log("activeVerticalResizers = " + activeVerticalResizers.length);

    console.groupEnd(groupName);
  }

}


//Array of all horizontal resizers in the page
var activeHorizontalResizers = new Array();
class HorizontalResizer{
  constructor(parent){
    this.divId = `horizontalResizer${activeHorizontalResizers.length}`;
    parent.html(parent.html() + 
      `<div id="${this.divId}" class="resizer horizontalResizer"></div>`);
    this.leftWindows = new Array();
    this.rightWindows = new Array();

    console.log(this);

    //Add this new resizer to the array
    activeHorizontalResizers.push(this);
   
  }

  getDiv(){
    return $(`#${this.divId}`);
  }

  addLeftWindow(w){
    this.leftWindows.push(w);
    console.log(`added ${w.toString()} to ${this.getDiv()[0].id} as left window`);
  }
  addRightWindow(w){
    this.rightWindows.push(w);
    console.log(`added ${w.toString()} to ${this.getDiv()[0].id} as right window`);
  }

  reposition(){

    //Check the resizer has at least 1 neighbouring window
    if(this.leftWindows.length == 0 && this.rightWindows.length == 0){
      console.error(`${this.divId} has no neighbouring windows.`);
      return;
    }

    //Calculate necessary height for the resizer based on neighbouring windows
    var leftHeight = 0;
    for(var i = 0; i < this.leftWindows.length; i++){
      console.log(`leftWindow[${i}].getDiv().css("height") = `+this.leftWindows[i].getDiv().css("height"));
      leftHeight+= removePixelUnits(this.leftWindows[i].getDiv().css("height"));
    }

    var rightHeight = 0;
    for(var i = 0; i < this.rightWindows.length; i++){
      rightHeight+= removePixelUnits(this.rightWindows[i].getDiv().css("height"));
    }
    console.log(`leftHeight = ${leftHeight}\nrightHeight = ${rightHeight}`);
    if(leftHeight >= rightHeight)
      this.getDiv().css("height", leftHeight+"px");
    else
      this.getDiv().css("height", rightHeight+"px");

    //set the width of the resizer based on if there's something on both sides
    //(Resizer is twice as thick if there's a window on both sides)
    var width = 4;
    if(this.leftWindows.length > 0 && this.rightWindows.length > 0){
      this.getDiv().css("width", (width*2)+"px");
      console.log(`set ${this.divId} width to ${width*2}px`);
    }
    else{
      this.getDiv().css("width", width+"px");
      console.log(`set ${this.divId} width to ${width}px`);
    }
    

    //position the resizer on the right side of its first left window
    if(this.leftWindows.length > 0){
      this.getDiv().css("left", this.leftWindows[0].getDiv().css("width"));//this.leftWindows[0].getDiv()[0].getBoundingClientRect().right - 3*width +"px");
      this.getDiv().css("top", this.leftWindows[0].getDiv()[0].getBoundingClientRect().top -2*width +"px");
      console.log(`this.leftWindows[0].getDiv().css("width") = ${this.leftWindows[0].getDiv().css("width")}`);
    }
    //Else position the resizer on the left side of it's right window
    
    else if(this.rightWindows.length > 0){
      //this.getDiv().css("left", this.rightWindows[0].getDiv()[0].getBoundingClientRect().left +"px");
      //this.getDiv().css("top", this.rightWindows[0].getDiv()[0].getBoundingClientRect().top +"px");
      this.getDiv().css("left", 0-width);
      this.getDiv().css("top", 0-removePixelUnits(this.rightWindows[0].getDiv().css("border-width")));
    }


  }


  resize(e){
    //Find the resizer associated with the div from the mouse event
    if(currentResizer == null){
      for(var i = 0; i < activeHorizontalResizers.length; i++){
        if(activeHorizontalResizers[i].getDiv() == e.target){
          currentResizer = activeHorizontalResizers[i];
        }
      }
    }

    //Change size of left windows
    for(var i = 0; i < currentResizer.leftWindows.length; i++){
      currentResizer.leftWindows[i].resize("RIGHT", e.pageX);
    }
    //Change the size of the right windows
    for(var i = 0; i < currentResizer.rightWindows.length; i++){
      currentResizer.rightWindows[i].resize("LEFT", e.pageX);
    }
    

    
    e.preventDefault();
    //currentResizer.getDiv().css("left", e.pageX +'px');
    
    //Reposition all resizors after change
    for(var i = 0; i < activeHorizontalResizers.length; i++){
      activeHorizontalResizers[i].reposition();
    }
    for(var i = 0; i < activeHorizontalResizers.length; i++){
      activeHorizontalResizers[i].reposition();
    }

  }

  cancelResize(e){
    window.removeEventListener("mousemove", currentResizer.resize);
    window.removeEventListener("mouseup", currentResizer.cancelResize);
    currentResizer = null;
  }

  debugInfo(){
    var groupName = `${this.divId}`;
    console.group(groupName);
    console.log(`divId = ${this.divId}`);
    console.log(`width = ${this.getDiv().css("width")}`);
    console.log(`height = ${this.getDiv().css("height")}`);
    console.log(`left = ${this.getDiv().css("left")}`);
    console.log(`top = ${this.getDiv().css("top")}`);

    var leftWindows = "";
    for(var i = 0; i < this.leftWindows.length; i++){
      leftWindows += this.leftWindows[i].toString() + "\n";
    }
    console.log(`leftWindow = ${leftWindows}`);
    var rightWindows = "";
    for(var i = 0; i < this.rightWindows.length; i++){
      rightWindows += this.rightWindows[i].toString() + "\n";
    }
    console.log(`rightWindow = ${rightWindows}`);
    console.log("activehorizontalResizers = " + activeHorizontalResizers.length);

    console.groupEnd(groupName);
  }

}


  childrenResize(){
    console.log("childrenResize called");
    var childDiv;
    if(this.isSplitHorizontally){
      childDiv = this.children[0].getDiv();
      childDiv.css("height", this.height);
      childDiv.css("width", this.width * this.children[0].sizeFractionOfParent);
      childDiv = this.children[1].getDiv();
      childDiv.css("height", this.height);
      childDiv.css("width", this.width * this.children[1].sizeFractionOfParent);
      childDiv.css("left", removePixelUnits(this.children[0].getDiv().css("width")) + this.childResizer.lineThickness);
    }else if(this.isSplitVertically){
      childDiv = this.children[0].getDiv();
      childDiv.css("height", this.height * this.children[0].sizeFractionOfParent);
      childDiv.css("width", this.width);
      childDiv = this.children[1].getDiv();
      childDiv.css("height", this.height * this.children[1].sizeFractionOfParent);
      childDiv.css("width", this.width);
      childDiv.css("top", removePixelUnits(this.children[0].getDiv().css("height")) + this.childResizer.lineThickness);
    }
    this.repositionChildResizer();

  }


    {
      }else{
      if(width > this.parent.width - this.minWidth){
        width = this.parent.width - this.minWidth;
        console.log(`special width applied\nwidth = ${width}, this.parent.width = ${this.parent.width}, this.minWidth = ${this.minWidth}`);
      }
      if(height > this.parent.height - this.minHeight){
        height = this.parent.height - this.minHeight;
        console.log(`special height applied`);
      }
    }

    function setupWindows(windowDiv){

  if(windowDiv == null){
    //Main parent window
    windowDiv = new ContentWindow(null, $(window).width(), $(window).height() - 30).getDiv();
    windowDiv.css("top", 30);
    windowDiv.append($("#mainWindow").detach());
    windowDiv.children("#mainWindow").children().unwrap();
  }
  console.log(windowDiv);
  for(var i = 0; i < activeContentWindows.length; i++){
    console.log(activeContentWindows[i].getDiv());
  }
  if(windowDiv.children(".leftWindow:first").length){
    console.log("leftWindow found");
    getContentWindowFromDiv(windowDiv).splitHorizontally();
    var leftWindow = activeContentWindows[activeContentWindows.length-2].getDiv();
    var rightWindow = activeContentWindows[activeContentWindows.length-1].getDiv();
    if(leftWindow != null && rightWindow != null){
      activeContentWindows[activeContentWindows.length-2].sizeFractionOfParent = 
      leftWindow.append(windowDiv.children(".leftWindow:first").detach());
      leftWindow.children(".leftWindow:first").children().unwrap();
      rightWindow.append(windowDiv.children(".rightWindow:first").detach());
      rightWindow.children(".rightWindow:first").children().unwrap();
      setupWindows(leftWindow);
      setupWindows(rightWindow);
    }

  }else if(windowDiv.children(".topWindow:first").length){
    console.log("topWindow found");
    getContentWindowFromDiv(windowDiv).splitVertically();
    var topWindow = activeContentWindows[activeContentWindows.length-2].getDiv();
    var bottomWindow = activeContentWindows[activeContentWindows.length-1].getDiv();
    if(topWindow != null && bottomWindow != null){
      topWindow.append(windowDiv.children(".topWindow:first").detach());
      topWindow.children(".topWindow:first").children().unwrap();
      bottomWindow.append(windowDiv.children(".bottomWindow:first").detach());
      bottomWindow.children(".bottomWindow:first").children().unwrap();
      setupWindows(topWindow);
      setupWindows(bottomWindow);
    }

  }
  console.log($("body > .leftWindow:first"));
  console.log($("body > .topWindow:first").length);
  console.log($("body > .bottomWindow:first").length);
}


function createPlayAreaGrid(){
  $(`#playArea`).append(`<div id="grid"></div>`);
  var grid = document.getElementById("grid");
  var gridHtml = "";
  var gridHeight = 1000;
  var gridWidth = 1000;
  for(var y = 0; y < gridHeight; y+=50){
    for(var x = 0; x < gridWidth; x+=50){
      gridHtml = gridHtml + (`<div id="grid${x+','+y}">${x+","+y}</div>`);
      grid.innerHTML = gridHtml;

      document.getElementById(`grid${x+','+y}`).style.left = "500px";
    }

  }
  for(var y = 0; y < gridHeight; y+=50){
    for(var x = 0; x < gridWidth; x+=50){
      document.getElementById(`grid${x+','+y}`).style.left = x+"px";
      document.getElementById(`grid${x+','+y}`).style.top = y+"px";
    }
  }

  $(`#grid`).css("top", $("#centre").css("top"));
  $(`#grid`).css("left", $("#centre").css("left"));

}

function repositionGrid(){
  //Pan grid
  $(`#grid`).css("top", $("#centre").css("top") );
  $(`#grid`).css("left", $("#centre").css("left"));
}