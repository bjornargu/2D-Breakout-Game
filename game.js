//Gjør klar canvas og henter tegnefunksjonalitet
var canvas = document.getElementById("myCanvas");
var ctx = canvas.getContext("2d");

//Lagre startposisjon for ball i variabler
var x = canvas.width/2;
var y = canvas.height-30;

//Lage variabler for hvor mye ballen skal "bevege" seg
var dx = 1.5;
var dy = -1.5;

//Lagre radius til ballen i en variabel
var ballRadius = 10;

//Lagrer en del ulike farger i en array, slik at vi kan hente ut en tilfeldig i changeColor
var colors = ["red", "blue", "black", "green", "purple", "orange", "cyan", "lime", "brown", "pink"];

//Lagre startfargen til ballen i en variabel, slik at vi kan endre til en tilfeldig farge senere i changeColor
var ballColor = colors[Math.floor(Math.random() * 10)];

//Tegner ballen i spillet
function drawBall() {
    ctx.beginPath();
    ctx.arc(x, y, ballRadius, 0, Math.PI*2);
    ctx.fillStyle = ballColor;
    ctx.fill();
    ctx.closePath();
}

//Endrer farge på ballen
function changeColor() {
    ballColor = colors[Math.floor(Math.random() * 10)];
}

//Setter opp høyde/bredde og startposisjon for paddle
var paddleHeight = 10;
var paddleWidth = 75;
var paddleX = (canvas.width - paddleWidth) / 2;

//Tegner paddle
function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

//Variabler for å sjekke om en knapp er trykket ned, settes som false til å begynne med
var rightPressed = false;
var leftPressed = false;

//Variabler for å opprette mursteiner/bricks
//Rad- og kolonneantall
var brickRowCount = 3;
var brickColumnCount = 5;
//Bredde/høyde og padding mellom hver brick
var brickWidth = 75;
var brickHeight = 20;
var brickPadding = 10;
//Offset fra top/left så de ikke starter helt øverst til venstre
var brickOffsetTop = 30;
var brickOffsetLeft = 30;

//Looper gjennom rader og kolonner og lager bricks
var bricks = [];
for(var c = 0; c < brickColumnCount; c++) {
    bricks[c] = [];
    for(var r = 0; r < brickRowCount; r++) {
        bricks[c][r] = { x: 0, y: 0, status: 1 };
    }
}

//Looper gjennom alle bricks i arrayen over og tegner de på brettet på riktig sted
function drawBricks() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            if(bricks[c][r].status == 1) {
                var brickX = (c * (brickWidth + brickPadding)) + brickOffsetLeft;
                var brickY = (r * (brickHeight + brickPadding)) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = "#0095DD";
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

//Score:
var score = 0;

function drawScore () {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

//Liv:
var lives = 3;

function drawLives () {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Lives: " + lives, canvas.width - 65, 20);
}


//Tegner spillet på canvas
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    drawLives();
    collisionDetection();
    x += dx;
    y += dy;

    //Sjekker om ballen treffer kantene/vegger/tak osv
    if(x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
        dx = -dx;
        changeColor();
    }
    if(y + dy < ballRadius) {
        dy = -dy;
        changeColor();
    } 
    //Sjekker om ballen treffer paddle
    else if(y + dy > canvas.height - ballRadius) {
        if(x > paddleX && x < paddleX + paddleWidth) {
            dy = -dy;
            // dx--; // Gjør ballen raskere hver gang den treffer paddle
            // dy--;
        }
        else {
            lives--;
            if(!lives) {
                alert("GAME OVER");
                document.location.reload(); // Laster inn siden på nytt
                // clearInterval(interval); // Trengs for at chrome skal avslutte spillet
            }
            else {
                x = canvas.width / 2;
                y = canvas.height -30;
                dx = 1.5;
                dy = -1.5;
                paddleX = (canvas.width-paddleWidth) / 2;
            }
        }
    }
    

    //Flytter paddle med høyre og venstre pil
    if(rightPressed) {
        paddleX += 7;
        if (paddleX + paddleWidth > canvas.width) {
            paddleX = canvas.width - paddleWidth;
        }
    }
    else if(leftPressed) {
        paddleX -= 7;
        if(paddleX < 0) {
            paddleX = 0;
        }
    }
    requestAnimationFrame(draw);
}

//Sjekk etter om noe blir trykket ned eller sluppet opp + mousemovement
document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);
document.addEventListener("mousemove", mouseMoveHandler, false);

function mouseMoveHandler(e) {
    var relativeX = e.clientX - canvas.offsetLeft;
    if(relativeX > 0 & relativeX < canvas.width) {
        paddleX = relativeX - paddleWidth / 2;
    }
}

//Sjekker om høyre/venstre blir trykket ned og setter variablene til true
function keyDownHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = true;
    } 
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = true;
    }
}

//Samme som keyDownHandler, men sjekker om knappene blir sluppet opp
function keyUpHandler(e) {
    if(e.key == "Right" || e.key == "ArrowRight") {
        rightPressed = false;
    } 
    else if(e.key == "Left" || e.key == "ArrowLeft") {
        leftPressed = false;
    }
}

//Sjekker om ballen kræsjer i en brick og endrer retning ballen beveger seg i, setter status til 0 slik at brikken ikke blir tegnet
function collisionDetection() {
    for(var c = 0; c < brickColumnCount; c++) {
        for(var r = 0; r < brickRowCount; r++) {
            var b = bricks[c][r];
            if(b.status == 1) {
                if(x + ballRadius > b.x && //Lagt til +/- ballRadius på if-sjekken for å kjøre kollisjon fra kanten av ballen
                   x - ballRadius < b.x + brickWidth && 
                   y + ballRadius > b.y && 
                   y - ballRadius < b.y + brickHeight) {
                    dy = -dy;
                    b.status = 0;
                    score++;
                    changeColor();
                    if(score == brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        document.location.reload();
                        // clearInterval(interval);
                    }
            }
            }
        }
    }
}

//Lagrer funksjonen setInterval i en variabel
// var interval = setInterval(draw, 10);

//Her brukes requestAnimationFrame for å styre interval/animasjon/tid, derfor kaller vi bare funksjonen
draw();