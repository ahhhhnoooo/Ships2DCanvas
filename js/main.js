var game = {};
game.player1;
game.bullets = [];
game.keysPressed = [];
game.labels = [];
game.cvs;
game.ctx;
game.p = Math.PI / 180;

class Bullet {
	constructor(player, turret, speed) {
		var playerDirection = player.dir * game.p;
		this.x = player.x + turret.x * Math.cos(playerDirection) + turret.y * Math.sin(playerDirection);
		this.y = player.y + turret.y * Math.cos(playerDirection) + turret.x * Math.sin(playerDirection);
		this.dir = player.dir + turret.dir;
		this.speed = speed;
	}

	move = () => {
		this.x += this.speed * Math.cos(this.dir * game.p);
		this.y += this.speed * Math.sin(this.dir * game.p);
	}

	check = (index) => {
		//If offscreen, remove from array
		if (this.x < 0 || this.x > game.cvs.width || this.y < 0 || this.y > game.cvs.height) {
			game.bullets.splice(index, 1);
		}

		//TODO Check collision
	}

	draw = () => {
		game.ctx.save();
		game.ctx.translate(this.x, this.y);
		game.ctx.rotate(this.dir * game.p);
		game.ctx.beginPath();
		game.ctx.moveTo(3, 0);
		game.ctx.lineTo(-1, 2);
		game.ctx.lineTo(-1, -2);
		game.ctx.lineTo(3, 0);
		game.ctx.fill();
		game.ctx.restore();
	}
}

class Turret {
	RADIUS = 10;
	BARREL_WIDTH = 5;
	BARREL_LENGTH = 20;

	constructor(x, y, dir, angle) {
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.angle = angle;
		this.reloading = false;
	}

	draw = () => {
		game.ctx.save();
		game.ctx.translate(this.x, this.y);
		game.ctx.rotate(this.dir * game.p);
		game.ctx.beginPath();
		game.ctx.arc(0, 0, this.RADIUS, 0, 2 * Math.PI);
		game.ctx.lineWidth = "5";
		game.ctx.lineTo(this.BARREL_LENGTH, 0);
		game.ctx.stroke();
		game.ctx.fill();
		game.ctx.restore();
	}

	fire = () => {
		
	}
}

class Player {
	LENGTH = 200;
	WIDTH = 50;

	constructor(x, y, dir, speed) {
		this.x = x;
		this.y = y;
		this.dir = dir;
		this.speed = speed;

		let frontTurret = new Turret(50, 0, 0, 0);
		let rearTurret = new Turret(-50, 0, 180, 0);

		this.turrets = [frontTurret, rearTurret];
	}

	move = () => {
		if (this.speed != 0) {
			this.x += this.speed * Math.cos(this.dir * game.p);
			this.y += this.speed * Math.sin(this.dir * game.p);
		}
	}
	draw = () => {
		game.ctx.save();
		game.ctx.translate(this.x, this.y);
		game.ctx.rotate(this.dir * game.p);
		game.ctx.moveTo(this.LENGTH / 2, 0);
		game.ctx.quadraticCurveTo(0, this.WIDTH, -this.LENGTH / 2, 0);
		game.ctx.quadraticCurveTo(0, -this.WIDTH, this.LENGTH / 2, 0);
		game.ctx.stroke();
		game.ctx.fillStyle = "#888888";
		game.ctx.fill();
		for (let turret of this.turrets) {
			turret.draw();
		}
		game.ctx.restore();
	}
}

function keyDown(keyEvent) {
	var charCode = keyEvent.charCode ? keyEvent.charCode : keyEvent.keyCode;
	game.keysPressed[charCode] = true;
}

function keyUp(keyEvent) {
	var charCode = keyEvent.charCode ? keyEvent.charCode : keyEvent.keyCode;
	game.keysPressed[charCode] = false;
}

function handlePressedKeys() {
	var update = false;
	if (game.keysPressed[65]) //a
	{
		++game.player1.front.dir;
		++game.player1.rear.dir;
		update = true;
	}
	if (game.keysPressed[68]) //d
	{
		--game.player1.front.dir;
		--game.player1.rear.dir;
		update = true;
	}
	if (game.keysPressed[87]) //w
	{
		++game.player1.front.angle;
		++game.player1.rear.angle;
		update = true;
	}
	if (game.keysPressed[83]) //s
	{
		--game.player1.front.angle;
		--game.player1.rear.angle;
		update = true;
	}
	if (game.keysPressed[81]) //q
	{
		++game.player1.front.dir;
		--game.player1.rear.dir
		update = true;
	}
	if (game.keysPressed[69]) //e
	{
		--game.player1.front.dir;
		++game.player1.rear.dir;
		update = true;
	}
	if (game.keysPressed[70]) //f
	{
		++game.player1.speed;
		update = true;
	}
	if (game.keysPressed[86]) //v
	{
		--game.player1.speed;
		update = true;
	}
	if (game.keysPressed[37]) //left arrow
	{
		--game.player1.dir;//TODO
	}
	if (game.keysPressed[39]) //right arrow
	{
		++game.player1.dir;//TODO
	}
	if (game.keysPressed[32]) //space
	{
		for (let turret of game.player1.turrets) {

			game.bullets.push(new Bullet(game.player1, turret, 1));
		}
	}

	if (update) {
		game.labels["frontAngleLabel"].innerHTML = game.player1.front.dir.toString();
		game.labels["rearAngleLabel"].innerHTML = game.player1.rear.dir.toString();
		game.labels["frontElevationLabel"].innerHTML = game.player1.front.angle.toString();
		game.labels["rearElevationLabel"].innerHTML = game.player1.rear.angle.toString();
		game.labels["speed"].innerHTML = game.player1.speed.toString();
	}
}

function mainLoop(timestamp) {
	game.cvs.width = game.cvs.width;

	for (let o of game.objects) {
		o.move();
		o.draw();
	}

	window.requestAnimationFrame(mainLoop);
}

function init() {
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	game.cvs = document.getElementById("gameCanvas");
	game.ctx = game.cvs.getContext("2d");
	game.labels["frontAngleLabel"] = document.getElementById("frontAngleLabel");
	game.labels["rearAngleLabel"] = document.getElementById("rearAngleLabel");
	game.labels["frontElevationLabel"] = document.getElementById("frontElevationLabel");
	game.labels["rearElevationLabel"] = document.getElementById("rearElevationLabel");
	game.labels["speed"] = document.getElementById("speed");


	game.player1 = new Player(200, 30, 0, 0);
	game.objects = [game.player1];
	mainLoop();

	window.setInterval(handlePressedKeys, 50);

	/*
	
	game.images.bulletImage = new Image();
	game.images.bulletImage.src = "img/bullet.png";
	game.images.playerImage = new Image();
	game.images.playerImage.src = "img/ship.png";
	game.images.turretImage = new Image();
	game.images.turretImage.src = "img/turret.png";
	game.images.playerImage.onload=function(){
		frontTurret = new Turret(game.images.playerImage.width/3,0,0,game.images.turretImage,0);
		rearTurret = new Turret(-game.images.playerImage.width/3,0,0,game.images.turretImage,0);
		game.player1 = new Player(game.images.playerImage.width/2,
							  game.images.playerImage.height/2,
							0,
							game.images.playerImage,
							0,
							frontTurret,
							rearTurret);
	}
	
	*/
}
