const container = document.querySelector(".game-container");
const ROW_BLOCKS = 3;
const COLS_BLOCKS = 5;
const BOARD_WIDTH = 560;
const BOARD_HEIGHT = 300;
const BALL_RADIUS = 10;
const BLOCK_WIDTH = 100;
const BLOCK_HEIGHT = 20;
const MARGIN = 10;
let blocks = new Array(ROW_BLOCKS);
let user = null;
let ball = null;
let score = 0;
document.getElementById("score").innerHTML = score;
let timerId;
let flag = true;

const createUserBlock = () => {
  user = {
    x: BOARD_WIDTH / 2 - BLOCK_WIDTH / 2,
    y: BOARD_HEIGHT - BLOCK_HEIGHT - MARGIN,
    width: BLOCK_WIDTH,
    height: BLOCK_HEIGHT,
    dx: 10,
  };
};

const createBall = () => {
  ball = {
    x: BOARD_WIDTH / 2,
    y: BOARD_HEIGHT - BLOCK_HEIGHT - MARGIN - BALL_RADIUS,
    r: BALL_RADIUS,
    dx: 3 * (Math.random() * 2 - 1),
    dy: -3,
    speed: 4,
  };
};

const addBlocks = () => {
  if (!blocks.length == 0) {
    blocks = [];
    while (container.firstChild) {
      container.removeChild(container.firstChild);
    }
  }

  let y = MARGIN;
  for (let r = 0; r < ROW_BLOCKS; r++) {
    blocks[r] = new Array(COLS_BLOCKS);
    let x = MARGIN;
    for (let c = 0; c < COLS_BLOCKS; c++) {
      blocks[r][c] = {
        x: x,
        y: y,
        width: BLOCK_WIDTH,
        height: BLOCK_HEIGHT,
        broken: false,
      };
      const blockElement = document.createElement("div");
      blockElement.style.left = blocks[r][c].x + "px";
      blockElement.style.top = blocks[r][c].y + "px";
      blockElement.classList.add("block");
      blockElement.classList.add(`r-${r}`);
      blockElement.classList.add(`c-${c}`);
      if (r == 0) {
        blockElement.classList.add("red");
      } else if (r == 1) {
        blockElement.classList.add("green");
      } else {
        blockElement.classList.add("orange");
      }
      container.appendChild(blockElement);
      x += BLOCK_WIDTH + MARGIN;
    }
    y += BLOCK_HEIGHT + MARGIN;
  }
};

const addUserBlock = () => {
  createUserBlock();
  const userBlockElement = document.createElement("div");
  userBlockElement.classList.add("user");
  userBlockElement.style.left = user.x + "px";
  userBlockElement.style.top = user.y + "px";
  container.appendChild(userBlockElement);
};

const addBall = () => {
  createBall();
  const ballElement = document.createElement("div");
  ballElement.classList.add("ball");
  container.appendChild(ballElement);
  positionBall();
};

addBlocks();
addUserBlock();
addBall();

function positionBall() {
  const ballElement = document.querySelector(".ball");
  ballElement.style.left = ball.x + "px";
  ballElement.style.top = ball.y + "px";
}

function moveBall() {
  ball.x += ball.dx;
  ball.y += ball.dy;
  positionBall();
  checkForCollisions();
}

function moveUser(e) {
  const userElement = document.querySelector(".user");
  switch (e.key) {
    case "ArrowLeft":
      if (user.x > 0) {
        user.x -= user.dx;
        userElement.style.left = user.x + "px";
      }
      break;
    case "ArrowRight":
      if (user.x < BOARD_WIDTH - user.width) {
        user.x += user.dx;
        userElement.style.left = user.x + "px";
      }
      break;
  }
}

document.getElementById("play-pause").addEventListener("click", playPauseGame);

document.getElementById("restart").addEventListener("click", restartGame);

function playPauseGame() {
  const iconButton = document.querySelector("#play-pause i");
  container.classList.toggle("active");
  if (!container.classList.contains("active")) {
    clearInterval(timerId);
    document.removeEventListener("keydown", moveUser);
    iconButton.classList.add("bi-play-fill");
    iconButton.classList.remove("bi-pause-fill");
  } else {
    if (timerId) clearInterval(timerId);
    timerId = setInterval(moveBall, 20);
    document.addEventListener("keydown", moveUser);
    iconButton.classList.add("bi-pause-fill");
    iconButton.classList.remove("bi-play-fill");
    if (flag) {
      flag = false;
      document.getElementById("restart").classList.remove("disabled");
    }
  }
}

function restartGame() {
  if (timerId) clearInterval(timerId);
  container.classList.remove("active");
  document.querySelector("#play-pause i").classList.add("bi-play-fill");
  document.querySelector("#play-pause i").classList.remove("bi-pause-fill");
  document.querySelector("#play-pause").classList.remove("disabled");
  document.getElementById("restart").classList.add("disabled");
  flag = true;
  score = 0;
  document.getElementById("score").innerHTML = score;
  addBlocks();
  addUserBlock();
  addBall();
}

function stopGame() {
  if (timerId) clearInterval(timerId);
  document.removeEventListener("keydown", moveUser);
  document.querySelector("#play-pause").classList.add("disabled");
}

function checkForCollisions() {
  // Blocks Collisions
  for (let r = 0; r < ROW_BLOCKS; r++) {
    for (let c = 0; c < COLS_BLOCKS; c++) {
      let block = blocks[r][c];
      if (!block.broken) {
        if (
          ball.x > block.x &&
          ball.x < block.x + block.width &&
          ball.y + ball.r > block.y &&
          ball.y - ball.r < block.y + block.height
        ) {
          // document.getElementById("play-pause").click();
          // const blockElement = document.querySelector(`div.r-${r}.c-${c}`);
          // blockElement.classList.add("bg-light");

          block.broken = true;
          const blockElement = document.querySelector(`div.r-${r}.c-${c}`);
          blockElement.classList.remove("block");
          ball.dy = -ball.dy;
          score++;
          document.getElementById("score").innerHTML = score;
        }
      }
    }
  }

  // User Collisions
  if (
    ball.x > user.x &&
    ball.x < user.x + user.width &&
    ball.y + ball.r > user.y
  ) {
    let collidePoint = ball.x - (user.x + user.width / 2);
    collidePoint = collidePoint / (user.width / 2);
    let angle = (collidePoint * Math.PI) / 3;

    ball.dx = ball.speed * Math.sin(angle);
    ball.dy = -ball.speed * Math.cos(angle);
  }

  // Wall Collisions
  if (ball.x + ball.r > BOARD_WIDTH || ball.x - ball.r < 0) {
    ball.dx = -ball.dx;
  }

  if (ball.y - ball.r < 0) {
    ball.dy = -ball.dy;
  }

  if (ball.y + ball.r > BOARD_HEIGHT) {
    stopGame();
    const message = document.createElement("div");
    message.textContent = "game over!!";
    message.classList.add("message");
    message.classList.add("text-danger");
    message.setAttribute("id", "message");
    container.appendChild(message);
  }

  const blockElements = document.querySelectorAll("div.block");
  if (blockElements.length == 0) {
    stopGame();
    const message = document.createElement("div");
    message.textContent = "you win!!";
    message.classList.add("message");
    message.classList.add("text-info");
    message.setAttribute("id", "message");
    container.appendChild(message);
  }
}
