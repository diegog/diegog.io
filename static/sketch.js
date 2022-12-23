var circles = []; //array to hold all circles

function setup() {
	var containerHeight = document.getElementById('sketch').clientHeight;
	var containerWidth = document.getElementById('sketch').clientWidth;

	var cnv = createCanvas(containerWidth, containerHeight);
	cnv.parent('sketch');
	background('#f4f4f4');
	textAlign(CENTER, CENTER);
	textSize(72);
	circles.push(new Circle(width * 0.5, height * 0.5, 0));
}

function windowResized() {
	var containerHeight = document.getElementById('sketch').clientHeight;
	var containerWidth = document.getElementById('sketch').clientWidth;

	resizeCanvas(containerWidth, containerHeight);
}

function draw() {
	//update and display our circles everytime draw loops
	for (var i = 0; i < circles.length; i++) {
		circles[i].update();
		circles[i].ellipse();

		//is circle has reached it's lifespan, then delete it
		if (circles[i].lifespan <= 0) {
			circles.splice(i, 1);
		}
	}
	fill(0);
	stroke(0);
	text('Diego.', width * 0.5, height * 0.5);
}

//add a circle whenever the mouse is clicked
function mousePressed() {
	//push a new circle to our array
	circles.push(new Circle(mouseX, mouseY, random(7, 15)));
}

//class for making circles
function Circle(x, y, s) {
	//set any properties
	this.x = x; //x position
	this.y = y; //y position
	this.s = s; //circle size

	this.r = random(255);
	this.g = random(255);
	this.b = random(255);

	//give each circle a lifespan
	this.lifespan = 1000;

	//define methods

	//this draws the ellipse
	this.ellipse = function () {
		//define visual propoerties of the ellipse
		fill(this.r, this.g, this.b);
		noStroke();

		//draw the ellipse
		ellipse(this.x, this.y, this.s);
	};

	//this makes it grow
	this.update = function () {
		this.s = this.s + 3;
		this.lifespan--;
	};
}
