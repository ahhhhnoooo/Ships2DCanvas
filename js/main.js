var game = {};
game.player1;
game.bullets = [];
game.keysPressed = [];
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

class Ship {
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

class Dashboard {
	constructor(x, y, player) {
		this.x = x;
		this.y = y;
		this.player = player;
	}
	move = () => { }
	draw = () => {
		game.ctx.save();
		game.ctx.translate(this.x, this.y);
		game.ctx.font = "30px Arial";
		game.ctx.fillText("Speed", 5, 30);
		game.ctx.fillText(this.player.speed.toString(), 150, 30);
		game.ctx.fillText("Front Dir", 5, 60);
		game.ctx.fillText(this.player.turrets[0].dir.toString(), 150, 60);
		game.ctx.fillText("Rear Dir", 5, 90);
		game.ctx.fillText(this.player.turrets[1].dir.toString(), 150, 90);
		game.ctx.fillText("Front Ang", 5, 120);
		game.ctx.fillText(this.player.turrets[0].angle.toString(), 150, 120);
		game.ctx.fillText("Rear Ang", 5, 150);
		game.ctx.fillText(this.player.turrets[1].angle.toString(), 150, 150);

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
	if (game.keysPressed[65]) //a
	{
		for (let turret of game.player1.turrets) {
			++turret.dir;
		}
	}
	if (game.keysPressed[68]) //d
	{
		for (let turret of game.player1.turrets) {
			--turret.dir;
		}
	}
	if (game.keysPressed[87]) //w
	{
		for (let turret of game.player1.turrets) {
			++turret.angle;
		}
	}
	if (game.keysPressed[83]) //s
	{
		for (let turret of game.player1.turrets) {
			--turret.angle;
		}
	}
	if (game.keysPressed[81]) //q
	{
		//TODO MultiTurrets
		--game.player1.turrets[0].dir;
		++game.player1.turrets[1].dir;
	}
	if (game.keysPressed[69]) //e
	{
		//TODO MultiTurrets
		++game.player1.turrets[0].dir;
		--game.player1.turrets[1].dir;
	}
	if (game.keysPressed[70]) //f
	{
		++game.player1.speed;
	}
	if (game.keysPressed[86]) //v
	{
		--game.player1.speed;
	}
	if (game.keysPressed[38]) //up arrow
	{
		++game.player1.speed;
	}
	if (game.keysPressed[40]) //down arrow
	{
		--game.player1.speed;
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
			if (turret.reloading) continue;

			turret.reloading = true;
			let b = new Bullet(game.player1, turret, 1);
			game.bullets.push(b);
			game.objects.push(b);
			window.setTimeout(() => { turret.reloading = false }, 2000);
		}
	}

}

function mainLoop() {
	//This clears the canvas
	game.cvs.width = game.cvs.width;

	//Update and draw all game objects, IN ORDER
	for (let o of game.objects) {
		o.move();
		o.draw();
	}
	//Need to call check on bullets specifically, in case of collision
	for (let bIndex in game.bullets) {
		game.bullets[bIndex].check(bIndex);
	}

	//Draw the dashboard last, so it goes over everything else
	game.dashboard.draw();

	window.requestAnimationFrame(mainLoop);
}

function init() {
	document.addEventListener("keydown", keyDown);
	document.addEventListener("keyup", keyUp);
	game.cvs = document.getElementById("gameCanvas");
	game.ctx = game.cvs.getContext("2d");

	game.player1 = new Ship(300, 30, 0, 0);
	game.enemy1 = new Ship(300, 600, 0, 1);
	game.dashboard = new Dashboard(0, 0, game.player1);
	game.objects = [game.player1, game.enemy1];
	mainLoop();

	window.setInterval(handlePressedKeys, 50);
	window.setInterval(()=> {--game.enemy1.dir}, 60)
}
