Window.Game = {};
(function (Game) {
    // Grab the canvas, which is the part of the screen the game is played in
    let canvas = document.getElementById('game');
    // Retrieve the context of the canvas html element, compare it to taking the image data from an image
    let context = canvas.getContext('2d');
    let scoreText = document.getElementById('score');

    // Startup values
    let frameCounter = 0;
    let acceptInput = true;
    let score = 0;
    let pauze = false;

    // Limits the game speed by reducing the rate at which frames are drawn
    let framesPerSecond = 15;

    // Set the canvas height and width
    canvas.height = canvas.width = CANVAS_SIZE * CELL_SIZE;

    // Game loop
    function loop() {
        setTimeout(function () {
            // Lets the browser decide when its best to render the game
            requestAnimationFrame(loop);

            frameCounter = 0;
            acceptInput = true;

            // Empty the entire canvas before redrawing all elements
            context.clearRect(0, 0, canvas.width, canvas.height);

            // Modify the snake's currect x and y values by their directional offsets
            if (!pauze) {
                snake.x += snake.dx;
                snake.y += snake.dy;
            }

            // Checks if the snake has reached edge of the screen
            checkEdgeCollision();

            // Draw the apple
            drawApple();

            // Loop over each part of the snake to draw it for the next frame and check for collision with itself
            moveSnake();
        }, 1000 / framesPerSecond);
    }

    // When the snake reaches a horizontal or vertical edge, wrap it around to the opposite edge
    function checkEdgeCollision() {
        // Check horizontal edges
        if (snake.x < 0) {
            // snake.x = canvas.width - CELL_SIZE;
            resetGame();
        }
        else if (snake.x >= canvas.width) {
            //snake.x = 0'
            resetGame();
        }

        // Check vertical edges
        if (snake.y < 0) {
            //snake.y = canvas.height - CELL_SIZE;
            resetGame();
        }
        else if (snake.y >= canvas.height) {
            //snake.y = 0;
            resetGame();
        }
    }
    // When the snake reaches a horizontal or vertical edge, wrap it around to the opposite edge
    function checkEdgeCollision() {
        // Check horizontal edges
        if (snake.x < 0) {
            // snake.x = canvas.width - CELL_SIZE;
            resetGame();
        }
        else if (snake.x >= canvas.width) {
            //snake.x = 0'
            resetGame();
        }
        // Check vertical edges
        else if (snake.y < 0) {
            //snake.y = canvas.height - CELL_SIZE;
            resetGame();
        }
        else if (snake.y >= canvas.height) {
            //snake.y = 0;
            resetGame();
        }
    }  

    function resetGame() {
        pauze = false;
        Window.Utils.DismissModal();
        resetScore();
        resetSnake();
        randomizeApple();
    }

    function GameOver() {
        pauze = true;
        Window.Utils.CreateModal("Game over", "You scored: <i>" + score + "</i> points");

    }

    Game.Reset = resetGame;

    function resetScore() {
        score = 0;
        updateScore();
    }

    // Increase the length of the snake and place the apple at a new location
    function eatApple() {
        // Increase the snake's length
        snake.length++;

        // Update the score text
        updateScore();

        // Place a new apple on a random location in the canvas
        randomizeApple();
    }

    // Handles movement, collision and drawing of the snake
    function moveSnake() {
        // Keep track of where snake has been, the front of the array is always the head
        snake.cells.unshift({ x: snake.x, y: snake.y });

        // Remove cells as we move away from them
        if (snake.cells.length > snake.length) {
            snake.cells.pop();
        }

        // Draw each of the snake's cells
        snake.cells.forEach(function (cell, index) {
            // Set the snake's color
            context.fillStyle = snake.color;

            // A cell is a piece of the snake, and the index and the index defines the position in the snake
            context.fillRect(cell.x, cell.y, CELL_SIZE, CELL_SIZE);

            // Check if the snake eats an apple
            if (cell.x === apple.x && cell.y === apple.y) {
                eatApple();
            }

            // Check for collision with all cells after the current one to see if the snake collides with itself
            for (var i = index + 1; i < snake.cells.length; i++) {
                // Snake has collided with itself
                if (cell.x === snake.cells[i].x && cell.y === snake.cells[i].y && !pauze) {
                    GameOver();
                }
            }
        });
    }

    // Updates the score text
    function updateScore() {
        scoreText.textContent = 'Score: ' + score;
    }

    // Draws the apple on the screen
    function drawApple() {
        context.fillStyle = apple.color;
        context.fillRect(apple.x, apple.y, CELL_SIZE - 1, CELL_SIZE - 1);
    }

    // Listens to keyboard events, used to control the snake
    document.addEventListener('keydown', function (keyBoardEvent) {
        if (false === acceptInput) {
            return;
        }

        // Change direction when the left arrow key is pressed and is not moving on the X axis
        if (keyBoardEvent.which === KEY_LEFT && snake.dx === 0) {
            snake.dx = -CELL_SIZE;
            snake.dy = 0;
            acceptInput = false;
        }
        // Change direction when the right arrow key is pressed and is not moving on the X axis
        else if (keyBoardEvent.which === KEY_RIGHT && snake.dx === 0) {
            snake.dx = CELL_SIZE;
            snake.dy = 0;
            acceptInput = false;
        }
        // Change direction when the up arrow key is pressed and is not moving on the Y axis
        else if (keyBoardEvent.which === KEY_UP && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = -CELL_SIZE;
            acceptInput = false;
        }
        // Change direction when the up arrow key is pressed and is not moving on the Y axis
        else if (keyBoardEvent.which === KEY_DOWN && snake.dy === 0) {
            snake.dx = 0;
            snake.dy = CELL_SIZE;
            acceptInput = false;
        }
    });

    // Starts the game
    requestAnimationFrame(loop);
Window.Game.frameCounterLimit = frameCounterLimit; Window.Game.eatApple = eatApple; Window.Game.pauze = new Proxy(this, { get: function() { return pauze;}}); Window.Game.score = new Proxy(this, { get: function(){ return score;}}); })(Window.Game);