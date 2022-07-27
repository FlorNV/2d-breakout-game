const container = document.querySelector('.container');
const MAX_BLOCKS = 15;
let blocks = [];
let score = 0;
const boardWidth = 560;
const boardHeight = 300;
const ballDiameter = 20;
const userBlockWidth = 100;
const userBlockHeight = 20;
const userStartPosition = [230, 10];
const ballStartPosition = [270, 30];
let userCurrentPosition = userStartPosition;
let ballCurrentPosition = ballStartPosition;
let xPosition = random();
let yPosition = 2;
let timerId;

function random() {
    const arr = [-2, 2];
    return arr[Math.floor(Math.random() * 2)];
}

const addBlocks = () => {
    let x = 10, y = 270;
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
}

addBlocks();


const userBlock = document.createElement('div');
userBlock.classList.add('user');
positionUserBlock();
container.appendChild(userBlock);

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


document.getElementById('start').addEventListener('click', () => {
    if(!timerId){
        timerId = setInterval(moveBall, 30);
        document.addEventListener('keydown', moveUser);
    }
});

document.getElementById('pause').addEventListener('click', () => {
    clearInterval(timerId);
    timerId = null;
    document.removeEventListener('keydown', moveUser);
});

document.getElementById('restart').addEventListener('click', () => {

});

function checkForColisions() {
    for (let i = 0; i < blocks.length; i++) {
        if (
            (ballCurrentPosition[0] > blocks[i].bottomLeft[0] && ballCurrentPosition[0] < blocks[i].bottomRight[0]) &&
            (ballCurrentPosition[1] + ballDiameter > blocks[i].bottomLeft[1] && ballCurrentPosition[1] < blocks[i].topLeft[1])
        ) {
            const blockElements = document.querySelectorAll('.block');
            blockElements[i].classList.remove('block');
            blocks.splice(i, 1);
            changeDirection();
            score++;
            document.getElementById('score').innerHTML = `Score: ${score}`;
            if (blocks.length == 0) {
                clearInterval(timerId);
                document.removeEventListener('keydown', moveUser);
                document.getElementById('state').innerHTML = 'You Win!!';
            }
        }
    }
    
    if (ballCurrentPosition[0] >= (boardWidth - ballDiameter) ||
        ballCurrentPosition[1] >= (boardHeight - ballDiameter) ||
        ballCurrentPosition[0] <= 0) {
        changeDirection();
    }

    if (ballCurrentPosition[1] <= 0) {
        clearInterval(timerId);
        document.removeEventListener('keydown', moveUser);
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
    if (xPosition == 2 && yPosition == 2) {
        yPosition = -2;
        return;
    }
    if (xPosition == 2 && yPosition == -2) {
        xPosition = -2;
        return;
    }    
    if (xPosition == -2 && yPosition == -2) {
        yPosition = 2;
        return;
    }
    if (xPosition == -2 && yPosition == 2) {
        xPosition = 2;
        return;
    }
}