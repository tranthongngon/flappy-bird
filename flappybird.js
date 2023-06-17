
//board
let clickGame;
let welcome;
let startGame;
let scoreGame;

let board;
let boardWidth = 340;
let boardHeight = 600;
let context;

//bird
let birdWidth = 40; //width/height ratio = 408/228 = 17/12
let birdHeight = 40;
let birdX = boardWidth/8;
let birdY = boardHeight/3;
let birdImg;

let bird = {
    x : birdX,
    y : birdY,
    width : birdWidth,
    height : birdHeight
}

//pipes
let pipeArray = [];
let pipeWidth = 64; //width/height ratio = 384/3072 = 1/8
let pipeHeight = 512;
let pipeX = boardWidth;
let pipeY = 0;

//gift
let giftArray = [];
let giftWidth = 50;
let giftHeight = 50;
let giftX = boardWidth + 105;
let giftY = boardHeight/3;

let topPipeImg;
let bottomPipeImg;
let gifImg;

//physics
let velocityX = -2.15;
let velocityY = 0; //bird jump speed
let gravity = 0.4;

let gameOver = true;
let score = 0;



window.onload = function() {
    board = document.getElementById("board");
    clickGame = document.getElementById("board");
    welcome = document.getElementById("welcome");
    startGame = document.getElementById("start-game");
    scoreGame = document.getElementById("score-game");
    board.height = boardHeight;
    board.width = boardWidth;
    context = board.getContext("2d"); //used for drawing on the board

    //draw flappy bird
    // context.fillStyle = "green";
    // context.fillRect(bird.x, bird.y, bird.width, bird.height);

    //load images
    birdImg = new Image();
    birdImg.src = "./pikachu.png";
    birdImg.onload = function() {
        context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);
    }

    topPipeImg = new Image();
    topPipeImg.src = "./toppipe.png";

    bottomPipeImg = new Image();
    bottomPipeImg.src = "./bottompipe.png";

    gifImg = new Image();
    gifImg.src = "./gift.png";

    requestAnimationFrame(update);
    setInterval(placePipes, 1500); //every 1.5 seconds
    setInterval(placeGift, 4500);
    // document.addEventListener("keydown", moveBird);
    board.addEventListener('click', moveBird);
    startGame.addEventListener('click', playgame);
}


function update() {
    requestAnimationFrame(update);
    if (gameOver) {
        return;
    }
    context.clearRect(0, 0, board.width, board.height);

    //bird
    velocityY += gravity;
    // bird.y += velocityY;
    bird.y = Math.max(bird.y + velocityY, 0); //apply gravity to current bird.y, limit the bird.y to top of the canvas
    context.drawImage(birdImg, bird.x, bird.y, bird.width, bird.height);

    if (bird.y > board.height) {
        gameOver = true;
    }

    //pipes
    for (let i = 0; i < pipeArray.length; i++) {
        let pipe = pipeArray[i];
        pipe.x += velocityX;
        context.drawImage(pipe.img, pipe.x, pipe.y, pipe.width, pipe.height);
        if (!pipe.passed && bird.x > pipe.x + pipe.width) {
            score += 0.5; //0.5 because there are 2 pipes! so 0.5*2 = 1, 1 for each set of pipes
            pipe.passed = true;
        }

        if (detectCollision(bird, pipe)) {
            gameOver = true;
        }
    }

    for(let i = 0; i < giftArray.length; i++) {
        let gif = giftArray[i];
        gif.x += velocityX;
        context.drawImage(gif.img, gif.x, gif.y, gif.width, gif.height);
    }

    //clear pipes
    while (pipeArray.length > 0 && pipeArray[0].x < -pipeWidth) {
        pipeArray.shift(); //removes first element from the array
    }

    //score
    // context.fillStyle = "white";
    // context.font="45px sans-serif";
    // context.fillText(score, 5, 45);
    // if (gameOver) {
    //     context.fillText("GAME OVER", 5, 90);
    // }
    scoreGame.innerHTML = score;
    if(gameOver) {
        welcome.style.display = 'flex';
    }
}
function placeGift() {
    if(gameOver) {
        return;
    }
    let randomPipeY =  Math.random()*(giftY);
    console.log('randomPipeY:', randomPipeY);

    let gif = {
        img : gifImg,
        x : giftX,
        y : giftY,
        width : giftWidth,
        height : giftHeight,
        passed : false
    }
    giftArray.push(gif);
}
function placePipes() {
    if (gameOver) {
        return;
    }

    //(0-1) * pipeHeight/2.
    // 0 -> -128 (pipeHeight/4)
    // 1 -> -128 - 256 (pipeHeight/4 - pipeHeight/2) = -3/4 pipeHeight
    let randomPipeY = pipeY - pipeHeight/4 - Math.random()*(pipeHeight/2);
    let openingSpace = board.height/4;

    let topPipe = {
        img : topPipeImg,
        x : pipeX,
        y : randomPipeY,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(topPipe);

    let bottomPipe = {
        img : bottomPipeImg,
        x : pipeX,
        y : randomPipeY + pipeHeight + openingSpace,
        width : pipeWidth,
        height : pipeHeight,
        passed : false
    }
    pipeArray.push(bottomPipe);
}

function moveBird(e) {
    // if (e.code == "Space" || e.code == "ArrowUp" || e.code == "KeyX") {
    //     //jump
    //     velocityY = -6;

    //     //reset game
    //     if (gameOver) {
    //         bird.y = birdY;
    //         pipeArray = [];
    //         score = 0;
    //         gameOver = false;
    //     }
    // }
    //jump
        velocityY = -6;

        //reset game
        if (gameOver) {
            bird.y = birdY;
            pipeArray = [];
            giftArray = [];
            score = 0;
            gameOver = false;
            scoreGame.innerHTML = 0
        }
}

function detectCollision(a, b) {
    return a.x < b.x + b.width &&   //a's top left corner doesn't reach b's top right corner
           a.x + a.width > b.x &&   //a's top right corner passes b's top left corner
           a.y < b.y + b.height &&  //a's top left corner doesn't reach b's bottom left corner
           a.y + a.height > b.y;    //a's bottom left corner passes b's top left corner
}

function playgame() {
    console.log('cliked');
    welcome.style.display = 'none'; 
    moveBird();
}
