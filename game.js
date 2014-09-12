var canvas = document.getElementById('canvas');
var ctx = canvas.getContext('2d');
var h = canvas.height;
var w = canvas.width;
var time = 0;
var firstPlay = 0;
var playing = 0;
var enemies = [];
var maxEnemies = 5;
var enemyColors = ["#0000FF", "#FF0000", "#00FF00", "#FFFF00"];
var enemyMinSpeed = 0.25;
var enemyMaxSpeed = 1;
var enemyMinSize = 5;
var enemyMaxSize = 15;
var touched = 0;
var enemyNumbers = [5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 7, 7, 7, 7, 8, 8, 9, 9, 9, 10, 10, 10, 12, 12, 12, 15, 15, 15, 17, 17, 18, 18, 20, 20, 20];

ctx.fillStyle = "#8A8A8A";
ctx.font = "50px sans-serif";
ctx.fillText("Click to begin.", canvas.width / 2 - 155, canvas.height / 2);

function random(min, max) {
    return Math.floor(Math.random() * (max - min + 1) + min);
}

function randomDec(min, max) {
    return Math.random() * (max - min + 1) + min;
}

function distance(x1, y1, x2, y2) {
    return Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2));
}

function Ball(x, y, size, speed, maxSpeed, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.xv = 0;
    this.yv = 0;
    this.speed = speed;
    this.maxSpeed = maxSpeed;
    this.color = color;
}

function Enemy(x, y, size, speed, direction, color) {
    this.x = x;
    this.y = y;
    this.size = size;
    this.speed = speed;
    this.direction = direction;
    this.color = color;
}

function drawBall(ball) {
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.size, 0, 2 * Math.PI);
    ctx.fillStyle = ball.color;
    ctx.fill();
    ctx.closePath();
}

user = new Ball(canvas.width / 2, canvas.height / 2, 10, 0.1, 2, "#8A8A8A");

var keys = {};
//Up:87  Down:83  Left:65  Right:68

//[keys.length - 1]
$(document).keydown(function (e) {
    keys[e.which] = true;
});

$(document).keyup(function (e) {
    delete keys[e.which];
});

function fillEnemies() {
    for (var i = enemies.length - 1; i < maxEnemies; i++) {
        //decide if vertical or horizontal
        var rand = random(0, 1);
        var rand2 = random(0, 1);
        if (rand == 1) {
            if (rand2 == 1) {
                //Comes from top
                enemies[i] = new Enemy(random(0, 400), 0, random(enemyMinSize, enemyMaxSize), randomDec(enemyMinSpeed, enemyMaxSpeed), 1, enemyColors[random(0, enemyColors.length - 1)]);
            } else {
                //comes from bottom
                enemies[i] = new Enemy(random(0, 400), 400, random(enemyMinSize, enemyMaxSize), randomDec(enemyMinSpeed, enemyMaxSpeed), 2, enemyColors[random(0, enemyColors.length - 1)]);
            }
        } else {
            if (rand2 == 1) {
                //comes from left
                enemies[i] = new Enemy(0, random(0, 400), random(enemyMinSize, enemyMaxSize), randomDec(enemyMinSpeed, enemyMaxSpeed), 3, enemyColors[random(0, enemyColors.length - 1)]);
            } else {
                //comes from right
                enemies[i] = new Enemy(400, random(0, 400), random(enemyMinSize, enemyMaxSize), randomDec(enemyMinSpeed, enemyMaxSpeed), 4, enemyColors[random(0, enemyColors.length - 1)]);
            }
        }
    }
}

function drawEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        drawBall(enemies[i]);
    }
}

function moveEnemies() {
    for (var i = 0; i < enemies.length; i++) {
        if (enemies[i].direction == 1) {
            //from top
            enemies[i].y += enemies[i].speed;
            if (enemies[i].y > canvas.height) {
                enemies.splice(i, 1);
            }
        } else if (enemies[i].direction == 2) {
            //from bottom
            enemies[i].y -= enemies[i].speed;
            if (enemies[i].y < 0) {
                enemies.splice(i, 1);
            }
        } else if (enemies[i].direction == 3) {
            //from left
            enemies[i].x += enemies[i].speed;
            if (enemies[i].x > canvas.width) {
                enemies.splice(i, 1);
            }
        } else if (enemies[i].direction == 4) {
            //from right
            enemies[i].x -= enemies[i].speed;
            if (enemies[i].x < 0) {
                enemies.splice(i, 1);
            }
        }
    }
}

function aiHandler() {
    if (enemies.length < maxEnemies) {
        fillEnemies();
    }
    drawEnemies();
    moveEnemies();
}

function move() {
    drawBall(user);

    if (keys["83"] && !keys["87"]) {
        user.yv += user.speed;
    } else if (keys["87"] && !keys["83"]) {
        user.yv -= user.speed;
    }

    if (keys["65"] && !keys["68"]) {
        user.xv -= user.speed;
    } else if (keys["68"] && !keys["65"]) {
        user.xv += user.speed;
    }
    user.y += user.yv;
    user.x += user.xv;
    user.yv *= 0.98;
    user.xv *= 0.98;
    if (user.xv > user.maxSpeed) {
        user.xv = user.maxSpeed;
    }
    if (user.xv < 0 - user.maxSpeed) {
        user.xv = 0 - user.maxSpeed;
    }
    if (user.yv > user.maxSpeed) {
        user.yv = user.maxSpeed;
    }
    if (user.yv < 0 - user.maxSpeed) {
        user.yv = 0 - user.maxSpeed;
    }
    if (user.y > canvas.height || user.y < 0) {
        user.yv *= -1;
    }
    if (user.x > canvas.width || user.x < 0) {
        user.xv *= -1;
    }
}



function timer() {
    ctx.fillStyle = "#8A8A8A";
    ctx.font = "20px sans-serif";
    ctx.fillText(time, 5, 20);
}

function checkCollision() {
    for (var i = 0; i < enemies.length; i++) {
        if (distance(user.x, user.y, enemies[i].x, enemies[i].y) < (enemies[i].size + 10)) {
            touched = 1;
        }
    }
}

function gameOver() {
    enemies = [];
    user.xv = 0;
    user.yv = 0;
    user.x = canvas.width / 2;
    user.y = canvas.height / 2;
    ctx.fillStyle = "#8A8A8A";
    ctx.font = "50px sans-serif";
    ctx.fillText("Game Over!", canvas.width / 2 - 135, canvas.height / 2);
    ctx.font = "25px sans-serif";
    ctx.fillText("Click to restart.", canvas.width / 2 - 80, canvas.height / 2 + 35);
}

function run() {
    if (touched === 0) {
        move();
        aiHandler();
        checkCollision();
        timer();
    } else {
        gameOver();
        playing = 0;
        timer();
    }
}

function clear() {
    ctx.fillStyle = "rgba(255, 255, 255, .25)";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function updateTime() {
    if (playing == 1) {
        time++;
        maxEnemies = enemyNumbers[time - 1];
    }
}

$('#canvas').click(function () {
    if (firstPlay === 0) {
        setInterval(run, 5);
        setInterval(clear, 25);
        setInterval(updateTime, 1000);
        playing = 1;
    } else if (playing === 0) {
        touched = 0;
        playing = 1;
        time = 0;
    }
    firstPlay = 1;
});
