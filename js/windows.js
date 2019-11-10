const Sides = {
  TOP: "TOP",
  BOTTOM: "BOTTOM",
  LEFT: "LEFT",
  RIGHT: "RIGHT"
}

var activeContentWindows = new Array();
class ContentWindow{
  
  constructor(parent, width, height, isResizable){
    this.divId = "contentWindow" + activeContentWindows.length;
    this.innerContentDivId = "innerContent" + activeContentWindows.length;

    var htmlToAdd = `<div id="${this.divId}" class="contentWindow">`+
                      `<div id="${this.innerContentDivId}" class="innerContent"></div>`+
                    `</div>`;
    if(parent != null){
      var htmlToAdd = parent.getDiv().html() + htmlToAdd;
      parent.getDiv().html(htmlToAdd);
    }else{
      //document.body.insertAdjacentHTML('beforeend', `<div id="${this.divId}" class="contentWindow"></div>`);
      document.body.insertAdjacentHTML('beforeend', htmlToAdd);
    }
    
    this.children = new Array();

    this.width = width;
    this.height = height;
    $(`#${this.divId}`).css("width", this.width+"px");
    $(`#${this.divId}`).css("height", this.height+"px");
    //$(`#${this.divId}`).css("z-index", 1+activeContentWindows.length);

    this.resizerThickness = 4;
    this.innerContentBoxHeightModifier = 2;
    this.innerContentBoxWidthModifier = 2;
    //Resize innerContentBox
    var style = {
      "width": this.width - this.resizerThickness*2,
      "height": this.height - this.resizerThickness*2,
      "top": this.resizerThickness,
      "left": this.resizerThickness
      //"z-index": 1.5+activeContentWindows
    }

    $(`#${this.innerContentDivId}`).css(style);


    if(isResizable){
      this.resizers = [
        new Resizer(this.getDiv(), Sides.TOP),
        new Resizer(this.getDiv(), Sides.RIGHT),
        new Resizer(this.getDiv(), Sides.BOTTOM),
        new Resizer(this.getDiv(), Sides.LEFT)
      ];
      
      this.resizers[0].addBottomWindow(this); //TOP
      this.resizers[1].addLeftWindow(this);   //RIGHT
      this.resizers[2].addTopWindow(this);    //BOTTOM
      this.resizers[3].addRightWindow(this);  //LEFT
    

      for(var i = 0; i < this.resizers.length; i++){
        this.resizers[i].reposition();
        //CHANGE
        this.resizers[i].resizeLine();
      }

    }

    activeContentWindows.push(this);
  }

  getDiv(){
    return $(`#${this.divId}`);
  }

  getResizer(side){
      var resizerToReturn = null;
      switch(side){
      case Sides.TOP:
        resizerToReturn = this.resizers[0];
        break;
      case Sides.BOTTOM:
          resizerToReturn = this.resizers[2];
        break;
      case Sides.LEFT:
          resizerToReturn = this.resizers[3];
        break;
      case Sides.RIGHT:
        resizerToReturn = this.resizers[1];
        break;
      default:
        console.error("getResizer: incorrect side");
    }


    if(resizerToReturn == null)
      console.error(`${side} resizer for ${this.getDivId} does not exist`);
    return resizerToReturn;
  }

  addChild(w){
    this.children.push(w);
  }

  resize(side, mousePos){
    //Direction is where to resize from

    switch(side){
      case Sides.TOP:
        var amountToMoveDown = this.getDiv()[0].getBoundingClientRect().bottom;
        this.changeSize(this.width, this.getDiv()[0].getBoundingClientRect().bottom - mousePos);
        amountToMoveDown -= this.height
        this.getDiv().css("top", amountToMoveDown);
        break;
      case Sides.BOTTOM:
          this.changeSize(this.width, mousePos - this.getDiv()[0].getBoundingClientRect().top);
        break;
      case Sides.LEFT:   
          this.changeSize(this.getDiv()[0].getBoundingClientRect().right - mousePos, this.height);
          this.getDiv().css("left", mousePos +"px");
        break;
      case Sides.RIGHT:
        this.changeSize(mousePos - this.getDiv()[0].getBoundingClientRect().left, this.height);
        break;
      default:
        console.error("Window.resize: incorrect side");
    }
  }

  toString(){
    return `divId = ${this.divId}, width = ${this.width}, height = ${this.height}`;
  }



  snapToSide(w, side, multiplier){
    switch(side){
      case Sides.TOP:
        this.changeSize(removePixelUnits(w.getDiv().css("width")), removePixelUnits(this.getDiv().css("height")));
        this.getDiv().css("top", removePixelUnits(w.getDiv().css("top")) - this.height);
        this.getDiv().css("left", w.getDiv().css("left"));
        this.shareResizer(w, Sides.BOTTOM);
        break;
      case Sides.BOTTOM:
        this.changeSize(removePixelUnits(w.getDiv().css("width")), removePixelUnits(this.getDiv().css("height")));
        this.getDiv().css("top", w.getDiv()[0].getBoundingClientRect().bottom);
        this.getDiv().css("left", w.getDiv().css("left"));
        this.shareResizer(w, Sides.TOP);
        break;
      case Sides.LEFT:
        this.changeSize(removePixelUnits(this.getDiv().css("width")), removePixelUnits(w.getDiv().css("height"))*multiplier);
        this.getDiv().css("top", w.getDiv().css("top"));
        this.getDiv().css("left", removePixelUnits(w.getDiv().css("left")) - this.width );
        this.shareResizer(w, Sides.RIGHT);
        break;
      case Sides.RIGHT:
        this.changeSize(removePixelUnits(this.getDiv().css("width")), removePixelUnits(w.getDiv().css("height"))*multiplier);
        this.getDiv().css("top", removePixelUnits(w.getDiv().css("top")) + removePixelUnits(w.getDiv().css("height"))*multiplier);
        this.getDiv().css("left",  w.getDiv()[0].getBoundingClientRect().right);
        this.shareResizer(w, Sides.LEFT);
        break;
    }
  }

  changeSize(width, height){
    this.getDiv().css("width", width);
    this.getDiv().css("height", height);
    this.width = width;
    this.height = height;
    this.repositionInnerContentBox();
    this.repositionAllResizers();

    for(var i = 0; i < this.children.length; i++){
      this.children[0].changeSize(this.width);//, this.height);
    }

  }

  shareResizer(w, side){
    switch(side){
      case Sides.TOP:
        this.resizers[0].removeWindow(this);
        this.resizers[0] = w.getResizer(Sides.BOTTOM);
        this.resizers[0].addBottomWindow(this);
        this.innerContentBoxHeightModifier--;
        this.shiftInnerContentBox(false);
        break;
      case Sides.BOTTOM:
        this.resizers[2].removeWindow(this);
        this.resizers[2] = w.getResizer(Sides.TOP);
        this.resizers[2].addTopWindow(this);
        this.innerContentBoxHeightModifier--;
        break;
      case Sides.LEFT:
        this.resizers[3].removeWindow(this);
        this.resizers[3] = w.getResizer(Sides.RIGHT);
        this.resizers[3].addRightWindow(this);
        this.innerContentBoxWidthModifier--;
        this.shiftInnerContentBox(true);
        break;
      case Sides.RIGHT:
        this.resizers[1].removeWindow(this);
        this.resizers[1] = w.getResizer(Sides.LEFT);
        this.resizers[1].addLeftWindow(this);
        this.innerContentBoxWidthModifier--;
        break;
    }
    this.repositionInnerContentBox();
    for(var i = 0; i < activeResizers.length; i++){
      activeResizers[i].resizeLine();
    }
  }

  shareResizerInner(w, side){
    switch(side){
      case Sides.TOP:
        this.resizers[0].removeWindow(this);
        this.resizers[0] = w.getResizer(Sides.TOP);
        this.resizers[0].addBottomWindow(this);
        this.innerContentBoxHeightModifier--;
        this.shiftInnerContentBox(false);
        break;
      case Sides.BOTTOM:
        this.resizers[2].removeWindow(this);
        this.resizers[2] = w.getResizer(Sides.BOTTOM);
        this.resizers[2].addTopWindow(this);
        this.innerContentBoxHeightModifier--;
        break;
      case Sides.LEFT:
        this.resizers[3].removeWindow(this);
        this.resizers[3] = w.getResizer(Sides.LEFT);
        this.resizers[3].addRightWindow(this);
        this.innerContentBoxWidthModifier--;
        this.shiftInnerContentBox(true);
        break;
      case Sides.RIGHT:
        this.resizers[1].removeWindow(this);
        this.resizers[1] = w.getResizer(Sides.RIGHT);
        this.resizers[1].addLeftWindow(this);
        this.innerContentBoxWidthModifier--;
        break;
    }
    this.repositionInnerContentBox();
    for(var i = 0; i < activeResizers.length; i++){
      activeResizers[i].resizeLine();
    }
  }

  removeResizer(side){
    switch(side){
      case Sides.TOP:
        this.resizers[0].delete();
        this.resizers[0] = null;
        this.innerContentBoxHeightModifier--;
        break;
      case Sides.RIGHT:
        this.resizers[1].delete();
        this.resizers[1] = null;
        this.innerContentBoxWidthModifier--;
        break;
      case Sides.BOTTOM:
        this.resizers[2].delete();
        this.resizers[2] = null;
        this.innerContentBoxHeightModifier--;
        break;
      case Sides.LEFT:
        this.resizers[3].delete();
        this.resizers[3] = null;
        this.innerContentBoxWidthModifier--;
        break;
    }
    this.repositionInnerContentBox();
  }

  makeFullscreen(){
    console.log("width = " + $(window).width());
    this.width = $(window).width();
    this.height = $(window).height();
    this.getDiv().css("left", 0);
    this.getDiv().css("top", 0);
    this.getDiv().css("width", this.width);
    this.getDiv().css("height", this.height);
    this.repositionInnerContentBox();
  }

  debugInfo(){
    var groupName = this.divId;
    console.group(groupName);
    console.log(this.toString());
    console.group("div info");
      console.log(`div width = ${this.getDiv().css("width")}`);
      console.log(`div height = ${this.getDiv().css("height")}`);
      console.log(`div left = ${this.getDiv().css("left")}`);
      console.log(`div top = ${this.getDiv().css("top")}`);
    console.groupEnd("div info");
    for(var i = 0; i < this.resizers.length; i++){
      this.resizers[i].debugInfo();
    }
    console.groupEnd(groupName);
  }

  repositionInnerContentBox(){
    var style = {
      "width": this.width - this.resizerThickness*this.innerContentBoxWidthModifier,
      "height": this.height - this.resizerThickness*this.innerContentBoxHeightModifier,
    }

    $(`#${this.innerContentDivId}`).css(style);

  }

  shiftInnerContentBox(shiftLeft){
    var top = removePixelUnits($(`#${this.innerContentDivId}`).css("top"));
    var left = removePixelUnits($(`#${this.innerContentDivId}`).css("left"));
    
    //shift left
    if(shiftLeft)
      left -= this.resizerThickness;
    else//shift up
      top -= this.resizerThickness;

    $(`#${this.innerContentDivId}`).css("top", top);
    $(`#${this.innerContentDivId}`).css("left", left);
 
  }

  repositionAllResizers(){
    for(var i = 0; i < this.resizers.length; i++){
      if(this.resizers[i] != null){
        this.resizers[i].resizeLine();
        this.resizers[i].reposition(); 
      }

    }
  }

  changeContent(html){
    $(`#${this.innerContentDivId}`).html(html);
  }

  getContent(){
    return $(`#${this.innerContentDivId}`).html();
  }

}

var currentResizer = null;


function attachResizerEvents(){
  var element = document.querySelectorAll('.horizontalResizer, .verticalResizer')
  if (element) {
    element.forEach(function(el){
      el.addEventListener('mousedown', function(e) {
        console.log("mousedown event: " + e);
        currentResizer = getResizerFromDiv(el.id);
        window.addEventListener('mousemove', currentResizer.resize);
        window.addEventListener('mouseup', currentResizer.cancelResize);
      });
    });
  }
}

function getResizerFromDiv(divId){
  for(var i = 0; i < activeResizers.length; i++){
    if(activeResizers[i].getDiv()[0].id == divId){
      return activeResizers[i];
    }
  }
  console.error("getResizerFromDiv failed to find resizer");
  return null;
}

function removePixelUnits(pixelString){
  return pixelString.substring(0, pixelString.length-2) - 0;
}
















var activeResizers = new Array();
class Resizer{
  constructor(parent, side){
    this.divId = `resizer${activeResizers.length}`;
    this.isHorizontal = (side == Sides.LEFT || side == Sides.RIGHT);
    console.log(`${this.divId} isHorizontal = ${this.isHorizontal}`);
    this.parent = parent;
    this.orientationFromParent = side;
    parent.html(parent.html() + 
      `<div id="${this.divId}" class="resizer"></div>`);
    if(this.isHorizontal){
      this.getDiv().addClass("horizontalResizer");
      this.leftWindows = new Array();
      this.rightWindows = new Array();
    }else{
      this.getDiv().addClass("verticalResizer");
      this.topWindows = new Array();
      this.bottomWindows = new Array();
    }

    this.lineThickness = 4;

    activeResizers.push(this);

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

  addLeftWindow(w){
    this.leftWindows.push(w);
  }

  addRightWindow(w){
    this.rightWindows.push(w);
  }

  reposition(){

    //Check the resizer has at least 1 neighbouring window
    if(this.isHorizontal){
      if(this.leftWindows.length > 0 || this.rightWindows.length > 0){
      //Resizer has at least 1 neighbouring window. Proceed;
      }else{
        console.error(`${this.divId} has no neighbouring windows.`);
        return;
      }
    }else{
      if(this.topWindows.length > 0 || this.bottomWindows.length > 0){
      //Resizer has at least 1 neighbouring window. Proceed;
      }else{
        console.error(`${this.divId} has no neighbouring windows.`);
        return;
      }
    }

    if(this.orientationFromParent == Sides.TOP){
      this.getDiv().css("left", 0);
      this.getDiv().css("top", 0);
    }else if (this.orientationFromParent == Sides.BOTTOM){
      this.getDiv().css("left", 0);
      this.getDiv().css("top", removePixelUnits(this.parent.css("height")) - this.lineThickness);
    }else if (this.orientationFromParent == Sides.LEFT){
      this.getDiv().css("left", 0);
      this.getDiv().css("top", 0);
    }else if (this.orientationFromParent == Sides.RIGHT){
      this.getDiv().css("left", removePixelUnits(this.parent.css("width")) - this.lineThickness);
      this.getDiv().css("top", 0);
    }
  

  }

  resizeLine(){

    var width1 = 0;
    var height1 = 0;
    var width2 = 0;
    var height2 = 0;

    if(this.isHorizontal){
      for(var i = 0; i < this.leftWindows.length; i++){
        height1 += removePixelUnits(this.leftWindows[i].getDiv().css("height"));
      }
      for(var i = 0; i < this.rightWindows.length; i++){
        height2 += removePixelUnits(this.rightWindows[i].getDiv().css("height"));
      }
      width1 = this.lineThickness;
    }else{
      for(var i = 0; i < this.topWindows.length; i++){
        width1 += removePixelUnits(this.topWindows[i].getDiv().css("width"));
      }
      for(var i = 0; i < this.bottomWindows.length; i++){
        width2 += removePixelUnits(this.bottomWindows[i].getDiv().css("width"));
      }
      height1 = this.lineThickness;
    }
    if(width2 > width1)
      width1 = width2;
    if(height2 > height1)
      height1 = height2;

    this.getDiv().css("width", width1);
    this.getDiv().css("height", height1);
  }

  resize(e){
    e.preventDefault();

    //Find the current resizer being clicked
    if(currentResizer == null){
      for(var i = 0; i < activeResizers.length; i++){
        if(activeResizers[i].getDiv() == e.target){
          currentResizer = activeResizers[i];
        }
      }
    }

    if(currentResizer.isHorizontal){
      //Change size of left windows
      for(var i = 0; i < currentResizer.leftWindows.length; i++){
        currentResizer.leftWindows[i].resize(Sides.RIGHT, e.pageX);
      }
      //Change the size of the right windows
      for(var i = 0; i < currentResizer.rightWindows.length; i++){
        currentResizer.rightWindows[i].resize(Sides.LEFT, e.pageX);
      }
    }else{
      //Change size of top windows
      for(var i = 0; i < currentResizer.topWindows.length; i++){
        currentResizer.topWindows[i].resize(Sides.BOTTOM, e.pageY);
      }

      //Change size of all bottom windows
      for(var i = 0; i < currentResizer.bottomWindows.length; i++){
        currentResizer.bottomWindows[i].resize(Sides.TOP, e.pageY);
      }
    }

    //Reposition all resizors after change
    for(var i = 0; i < activeResizers.length; i++){
      activeResizers[i].resizeLine();
      activeResizers[i].reposition();
    }

  }

  removeWindow(w){
    if(this.isHorizontal){
      for(var i = 0; i < this.leftWindows.length; i++){
        if(this.leftWindows[i] == w)
          this.leftWindows.splice(i, 1);
          console.log(`Removing ${w.getDiv()[0].id} from ${this.divId}`);
        }
      for(var i = 0; i < this.rightWindows.length; i++){
        if(this.rightWindows[i] == w)
          this.rightWindows.splice(i, 1);
          console.log(`Removing ${w.getDiv()[0].id} from ${this.divId}`);
        }
    }else{
      for(var i = 0; i < this.topWindows.length; i++){
        if(this.topWindows[i] == w)
          this.topWindows.splice(i, 1);
        console.log(`Removing ${w.getDiv()[0].id} from ${this.divId}`);
      }
      for(var i = 0; i < this.bottomWindows.length; i++){
        if(this.bottomWindows[i] == w)
          this.bottomWindows.splice(i, 1);
          console.log(`Removing ${w.getDiv()[0].id} from ${this.divId}`);
      }     
    }

    if(this.checkNeighbours() == false){
      this.delete();
    }

  }

  checkNeighbours(){
    //Check the resizer has at least 1 neighbouring window
    var hasNeighbours = false;
    if(this.isHorizontal){
      if(this.leftWindows.length > 0 || this.rightWindows.length > 0)
        hasNeighbours = true;
    }else{
      if(this.topWindows.length > 0 || this.bottomWindows.length > 0)
        hasNeighbours = true;
    }

    return hasNeighbours;

  }

  delete(){
    for(var i = 0; i < activeResizers.length; i++){
      if(activeResizers[i] == this)
        activeResizers.splice(i,1);
    }
    this.getDiv()[0].parentNode.removeChild(this.getDiv()[0]);
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
    
    if(this.isHorizontal){
      console.log("HORIZONTAL RESIZER");
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
    }else{
      console.log("VERTICAL RESIZER");
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
    }
    console.log("activeResizers = " + activeResizers.length);

    console.groupEnd(groupName);
  }

}