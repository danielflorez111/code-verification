// Canvas and context set up
const canvas = document.getElementById('canvas');
const scoreLabel = document.getElementById('score');
const gameOverMessage = document.getElementById('game-over-message');
const playAgainButton = document.getElementById('play-again-button');
const ctx = canvas.getContext('2d');

// Food and snake segment size 16px X 16px
const segment = 16;
let direction;

// maxCanvasPosition = canvas size / food and snake dimensions = 800 / 16 = 50
let maxCanvasPosition = canvas.width / 16;

// Snake initial position/segment
let snake = [];
snake[0] = {
    x: Math.floor(maxCanvasPosition / 2) * segment,
    y: Math.floor(maxCanvasPosition / 2) * segment
};


// Creates food object
let food = {};
createFood();

// Creates score variable and get previous score from localStorage
let score = 0;
const previousScore = parseInt(localStorage.getItem('score')) || 0;

document.addEventListener('keydown', driveSnake);
playAgainButton.addEventListener('click', playAgain)

// Draw
function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw every position from the snake array
    snake.forEach((position, index) => {
        ctx.fillStyle = (index === 0) ? 'black' : "green";
        ctx.fillRect(position.x, position.y, segment, segment);
    });

    // Draw food
    ctx.fillStyle = 'red';
    ctx.fillRect(food.x, food.y, segment, segment);

    // Current head position
    let snakeX = snake[0].x;
    let snakeY = snake[0].y;

    if (direction === 'LEFT') snakeX = snakeX - segment;
    if (direction === 'UP') snakeY = snakeY - segment;
    if (direction === 'RIGHT') snakeX = snakeX + segment;
    if (direction === 'DOWN') snakeY = snakeY + segment;

    // Snake eats the food
    if (snakeX === food.x && snakeY === food.y) {
        score++;
        scoreLabel.innerHTML = `Score: ${score}`;

        if (score > previousScore) {
            scoreLabel.style.color = getRandomColor();
        }

        createFood();
    } else {
        snake.pop();
    }

    // New head position
    let newHead = {
        x: snakeX,
        y: snakeY
    };

    if (checkCollision(newHead, snake)) {
        // Set current score to localStorage
        localStorage.setItem('score', score.toString());

        // Display Game over message
        gameOverMessage.style.visibility = 'visible';

        // Show Play again button
        playAgainButton.style.display = 'block';
        playAgainButton.focus();

        // Clear interval
        clearInterval(game);
    }

    if (snakeX < 0 || snakeX > maxCanvasPosition * segment || snakeY < 0 || snakeY > maxCanvasPosition * segment) {
        if (direction === 'RIGHT') {
            direction = 'LEFT';
        } else if (direction === 'DOWN') {
            direction = 'UP';
        } else if (direction === 'LEFT') {
            direction = 'RIGHT';
        } else if (direction === 'UP') {
            direction = 'DOWN';
        }

        score = 0;
        scoreLabel.innerHTML = `Score: ${score}`;
        scoreLabel.style.color = 'black';

        // Setting a minimum size to play
        if (maxCanvasPosition > 15) {
            ctx.canvas.width = canvas.width - 113;
            ctx.canvas.height = canvas.height - 113;
            maxCanvasPosition = Math.floor(canvas.width / 16);
        }

        snake = [];
        snake[0] = {
            x: Math.floor(maxCanvasPosition / 2) * segment,
            y: Math.floor(maxCanvasPosition / 2) * segment
        };
    }
    else {
        snake.unshift(newHead);
    }
}

/**
* Creates new food randomly by setting new values to food object
*/
function createFood() {
    food = {
        x: Math.floor(Math.random() * maxCanvasPosition) * segment,
        y: Math.floor(Math.random() * maxCanvasPosition) * segment
    };
}

/**
* IIFE to create new food recursively every random time
*/
(function loopCreateFood() {
    // Snake food has a random timeout between 4 to 10 seconds
    const randomTimeout = Math.round(Math.random() * (10000 - 4000)) + 4000;

    setTimeout(() => {
        createFood();
        loopCreateFood();
    }, randomTimeout);
}());

/**
* 37 left arrow
* 38 up arrow
* 39 right arrow
* 40 down arrow
* Changes snake's direction depending of user action
*/
function driveSnake(e) {
    if (e.keyCode === 37 && direction !== 'RIGHT') {
        direction = 'LEFT';
    } else if (e.keyCode === 38 && direction !== 'DOWN') {
        direction = 'UP';
    } else if (e.keyCode === 39 && direction !== 'LEFT') {
        direction = 'RIGHT';
    } else if (e.keyCode === 40 && direction !== 'UP') {
        direction = 'DOWN';
    }
}

/**
* Detects if the new head of the snake it's in the same position
* with some position of the snake (collision)
*/
function checkCollision(head, array) {
    for (let i = 0; i < array.length; i++) {
        if (head.x === array[i].x && head.y === array[i].y) {
            return true;
        }
    }

    return false;
}

/**
* Returns random color to style score label if current score > previous score
*/
function getRandomColor() {
    let letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }

    return color;
}

/**
* Reload page and restart the game
*/
function playAgain() {
    location.reload(true);
}

let game = setInterval(draw, 100);
