const container = document.querySelector('.container');
const MAX_BLOCKS = 15;
let blocks = [];
let blocksAUX = [];
let score = 0;
document.getElementById('score').innerHTML = `Score: ${score}`;
let userBlock;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
const userBlockWidth = 100;
const userBlockHeight = 20;
const userStartPosition = [230, 10];
const ballStartPosition = [270, 30];
let userCurrentPosition = userStartPosition.slice();
let ballCurrentPosition = ballStartPosition.slice();
let xPosition = randomPosition();
let yPosition = 2;
let timerId;

function randomPosition() {
    const arr = [-2, 2];
    return arr[Math.floor(Math.random() * 2)];
}

const addBlocks = () => {
    let x = 10, y = 270;
    if (blocks.length ==  0) {
        for (let i = 1; i <= MAX_BLOCKS ; i++) {
            const block = new Block(x, y);
            const divBlock = document.createElement('div');
            divBlock.classList.add('block');
            divBlock.style.left = block.bottomLeft[0] + 'px';
            divBlock.style.bottom = block.bottomLeft[1] + 'px';
            container.appendChild(divBlock);
            x += 110;
            if ( i % 5 == 0) {
                x = 10;
                y -= 30;
            }
            blocks.push(block);
        }
    } else {
        const blockElements = document.querySelectorAll('div.container > div');
        for (let i = 0; i < blockElements.length - 2; i++) {
            if (!blockElements[i].classList.contains('block')) {
                blockElements[i].classList.add('block');
            }
        }
    }
    blocksAUX = blocks.slice();
}

addBlocks();

const addUserBlock = () => {
    userBlock = document.createElement('div');
    userBlock.classList.add('user');
    positionUserBlock();
    container.appendChild(userBlock);
}

addUserBlock();

function positionUserBlock() {
    userBlock.style.left = userCurrentPosition[0] + 'px';
    userBlock.style.bottom = userCurrentPosition[1] + 'px';
}

function moveUser(e) {
    switch (e.key) {
        case 'ArrowLeft':
            if (userCurrentPosition[0] > 0) {
                userCurrentPosition[0] -= 10;
                positionUserBlock();
            }
            break;
        case 'ArrowRight':
            if (userCurrentPosition[0] < boardWidth - userBlockWidth) {
                userCurrentPosition[0] += 10;
                positionUserBlock();
            }    
            break;
    }
}

const ball = document.createElement('div');
ball.classList.add('ball');
positionBall();
container.appendChild(ball);

function positionBall() {
    ball.style.left = ballCurrentPosition[0] + 'px';
    ball.style.bottom = ballCurrentPosition[1] + 'px';
}

function moveBall() {
    ballCurrentPosition[0] += xPosition;
    ballCurrentPosition[1] += yPosition;
    positionBall();
    checkForColisions();
}


document.getElementById('start').addEventListener('click', startGame);

document.getElementById('pause').addEventListener('click', pauseGame);

document.getElementById('restart').addEventListener('click', restartGame);

function startGame() {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(moveBall, 30);
    this.classList.add('disabled');
    document.addEventListener('keydown', moveUser);
    document.getElementById('pause').classList.remove('disabled');
    document.getElementById('restart').classList.remove('disabled');
}

function pauseGame(e) {
    container.classList.toggle('paused');
    if (container.classList.contains('paused')) {
        clearInterval(timerId);
        e.target.innerText = 'RESUME';
    } else {
        if (timerId) clearInterval(timerId);
        timerId = setInterval(moveBall, 30);
        e.target.innerText = 'PAUSE';
    }
}

function restartGame() {
    if (timerId) clearInterval(timerId);
    document.getElementById('start').classList.remove('disabled');
    document.getElementById('pause').innerText = 'PAUSE';
    document.getElementById('pause').classList.add('disabled');
    document.getElementById('restart').classList.add('disabled');
    document.getElementById('state').innerHTML = '';
    score = 0;
    document.getElementById('score').innerHTML = `Score: ${score}`;
    xPosition = randomPosition();
    yPosition = 2;
    userCurrentPosition = userStartPosition.slice();
    ballCurrentPosition = ballStartPosition.slice();
    addBlocks();
    positionUserBlock();
    positionBall();
}

function stopGame() {
    if (timerId) clearInterval(timerId);
    document.removeEventListener('keydown', moveUser);
    document.getElementById('pause').classList.add('disabled');
}

function checkForColisions() {
    for (let i = 0; i < blocksAUX.length; i++) {
        if (
            (ballCurrentPosition[0] > blocksAUX[i].bottomLeft[0] && ballCurrentPosition[0] < blocksAUX[i].bottomRight[0]) &&
            (ballCurrentPosition[1] + ballDiameter > blocksAUX[i].bottomLeft[1] && ballCurrentPosition[1] < blocksAUX[i].topLeft[1])
        ) {
            const blockElements = document.querySelectorAll('.block');
            blockElements[i].classList.remove('block');
            blocksAUX.splice(i, 1);
            changeDirection();
            score++;
            document.getElementById('score').innerHTML = `Score: ${score}`;
            if (blocksAUX.length == 0) {
                stopGame();
                document.getElementById('state').innerHTML = 'You Win!!';
            }
        }
    }
    
    if (
        ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0
    ) {
        changeDirection();
    }

    if (ballCurrentPosition[1] <= 0) {
        stopGame();
        document.getElementById('state').innerHTML = 'Game Over!!';
    }

    
    if (
        (ballCurrentPosition[0] >= userCurrentPosition[0] && ballCurrentPosition[0] <= userCurrentPosition[0] + userBlockWidth) &&
        (ballCurrentPosition[1] > userCurrentPosition[1] && ballCurrentPosition[1] <= userCurrentPosition[1] + userBlockHeight)
    ) {
        changeDirection();
    }
}

function changeDirection() {
    if (xPosition > 0 && yPosition > 0) {
        yPosition = -yPosition;
        return;
    }
    if (xPosition > 0 && yPosition < 0) {
        xPosition = -xPosition;
        return;
    }    
    if (xPosition < 0 && yPosition < 0) {
        yPosition = -yPosition;
        return;
    }
    if (xPosition < 0 && yPosition > 0) {
        xPosition = -xPosition;
        return;
    }
}