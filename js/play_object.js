class PlayObject {
	constructor(name, width, height){
		this.name = name;
		this.createId();
		this.coordinates = new Coord2d(0,0);
		this.width = width;
		this.height = height;
		this.colour = "#000000";

		this.move();
		//console.log(this.toString());
	}

	changeColour(colour){
		this.colour = colour;
		this.getElement().css("background-color", colour);
	}

	moveBy(amountX, amountY){
		this.coordinates.x += amountX;
		this.coordinates.y += amountY;
		this.move();
	}

	moveTo(x, y){
		this.coordinates.x = x;
		this.coordinates.y = y;
		this.move();
	}

	getId(){
		return this.id;
	}

	createId(){
		this.id = "playObject"+playObjectIds;
		playObjectIds++;
	}

	move(){
		
		this.getElement().css("left", removePixelUnits($("#centre").css("left")) + this.coordinates.x + "px");
		this.getElement().css("top", removePixelUnits($("#centre").css("top")) - this.coordinates.y + "px");
		
	}

	getElement(){
		return $(`#${this.id}`);
	}

	delete(){
		$(`#${this.id}`)[0].parentNode.removeChild($(`#${this.id}`)[0]);
	}

	toString(){
		return "" +
		`name = ${this.name}\n` +
		`id = ${this.id}\n` +
		`coordinates = ${this.coordinates.toString()}\n` +
		`colour = ${this.colour}`;
	}

}
