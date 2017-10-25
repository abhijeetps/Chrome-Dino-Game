
function topWall(obj) {
    return obj.y;
}
function bottomWall(obj) {
    return obj.y + obj.height;
}
function leftWall(obj) {
    return obj.x;
}
function rightWall(obj) {
    return obj.x + obj.width;
}

// DINOSAUR
function Dinosaur (x, dividerY) {
    this.width = 55;
    this.height = 70;
    this.x = x;
    this.y = dividerY - this.height;
    this.vy = 0;
    this.jumpVelocity = -20;
}
Dinosaur.prototype.draw = function(context) {
    var oldFill = context.fillStyle;
    context.fillStyle = "yellow";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = oldFill;
};
Dinosaur.prototype.jump = function() {
    console.log("Jump called");
    this.vy = this.jumpVelocity;
};
Dinosaur.prototype.update = function(divider, gravity) {
    this.y += this.vy;
    this.vy += gravity;
    if (bottomWall(this) > topWall(divider) && this.vy > 0) {
        this.y = topWall(divider) - this.height;
        this.vy = 0;
        return;
    }
};
// ----------
// DIVIDER
function Divider (gameWidth, gameHeight) {
    this.width = gameWidth;
    this.height = 4;
    this.x = 0;
    this.y = gameHeight - this.height - Math.floor(0.2 * gameHeight);
}
Divider.prototype.draw = function(context) {
    context.fillRect(this.x, this.y, this.width, this.height);
};
// ----------

// ----------
// CACTUS
function Cactus(gameWidth, groundY){
    this.width = 16;    //fixed width cactus
    this.height = (Math.random() > 0.5) ? 30 : 70// two different cactus
    this.x = gameWidth;

        this.x = gameWidth;// spawn cactus at screen end
        this.y = groundY - this.height;
}

Cactus.prototype.draw = function(context){
    var oldFill = context.fillStyle;
    context.fillStyle = "green";
    context.fillRect(this.x, this.y, this.width, this.height);
    context.fillStyle = oldFill;
};

// ----------
// GAME
function Game () {
    var canvas = document.getElementById("game");
    this.width = canvas.width;
    this.height = canvas.height;
    this.context = canvas.getContext("2d");
    this.context.fillStyle = "brown";
    document.spacePressed = false;
    document.addEventListener("keydown", function(e) {
        if (e.key === " ") this.spacePressed = true;
    });
    document.addEventListener("keyup", function(e) {
        if (e.key === " ") this.spacePressed = false;
    });
    this.gravity = 1.5;
    this.divider = new Divider(this.width, this.height);
    this.dino = new Dinosaur(Math.floor(0.1 * this.width), this.divider.y);
    this.cacti = [];

    this.runSpeed = -10;
    this.paused = false;
    this.noOfFrames = 0;
}

Game.prototype.spawnCactus = function(probability)
    //Spawns a new cactus depending upon the probability
    {
    if(Math.random() <= probability){
        this.cacti.push(new Cactus(this.width, this.divider.y));
    }
}

Game.prototype.update = function () {
    // Dinosaur jump start

    if(this.paused){
        return;
    }
    if (document.spacePressed == true && bottomWall(this.dino) >= topWall(this.divider)) {
        console.log("Conditions met");
        this.dino.jump();
    }
    this.dino.update(this.divider, this.gravity);

    // Removing old cacti that cross the eft border of the screen
    if(this.cacti.length > 0 && rightWall(this.cacti[0]) < 0) {
        this.cacti.shift();
    }

    // Spawning new cacti
    //Case 1: There are no cacti on the screen
    if(this.cacti.length == 0){
        //Spawn a cactus with high probability
        this.spawnCactus(0.5);
    }
    //Case 2: There is atleast one cactus
    else if ( 
        this.cacti.length > 0 && this.width - leftWall(this.cacti[this.cacti.length-1]) > this.jumpDistance + 150)
    {
        this.spawnCactus(0.05);
    } 

    // Moving the cacti
    for (i = 0; i < this.cacti.length; i++){
        this.cacti[i].x += this.runSpeed;
    }

    //Collision Detection

    for(i = 0; i < this.cacti.length; i++){
        if(
            rightWall(this.dino) >= leftWall(this.cacti[i])
            && leftWall(this.dino) <= rightWall(this.cacti[i]) && bottomWall(this.dino) >= topWall(this.cacti[i]))
            {
                // COLLISION OCCURED
                this.paused = true;
            }
            this.noOfFrames++;
            this.score = Math.floor(this.noOfFrames/10);
    }

    //Jump Distance of the Dinosaur
    // This is a CONSTANT in this gamebecause run speed is constant
    //Equations: time = t * 2 * v / g where v is the jump velocity
    // Horizontal ditance s = vx * t where vx is the run speed
    this.jumpDistance = Math.floor(this.runSpeed * (2 * this.dino.jumpVelocity) / this.gravity);
    // Math.floor() because we only use integer value.
};
Game.prototype.draw = function () {
    // clear rectangle of game
    this.context.clearRect(0, 0, this.width, this.height);
    // draw divider line
    this.divider.draw(this.context);
    // draw the dinosaur
    this.dino.draw(this.context);
    //drawing the cactii
    for (i = 0; i < this.cacti.length; i++){
        this.cacti[i].draw(this.context);
    }

    var oldFill = this.context.fillStyle;
    this.context.fillStyle = "white";
    this.context.fillText(this.score, this.width-40, 30);
    this.context.fillStyle = oldFill;
};

var game = new Game();
function main (timeStamp) {
    game.update();
    game.draw();
    window.requestAnimationFrame(main);
}
var startGame = window.requestAnimationFrame(main);