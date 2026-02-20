// Глобальные переменные:
var FIELD_SIZE_X = 25; // Уменьшим поле для мобилок (было 60)
var FIELD_SIZE_Y = 25;
var SNAKE_SPEED = 400; // Интервал между перемещениями змейки
var snake = [];        // Массив объектов {x, y}
var direction = 'y+';  // Направление движения змейки
var gameIsRunning = false;
var snake_timer;
var food = { x: -1, y: -1 }; // Координаты еды
var score = 0;

function init() {
    prepareGameField(); 

    document.getElementById('snake-start').addEventListener('click', startGame);
    document.getElementById('snake-renew').addEventListener('click', refreshGame);
    
    // Клавиатура
    addEventListener('keydown', changeDirection);

    // Мобильное управление (Сенсорные кнопки)
    document.getElementById('btn-up').addEventListener('click', function() { setDirection('y+'); });
    document.getElementById('btn-down').addEventListener('click', function() { setDirection('y-'); });
    document.getElementById('btn-left').addEventListener('click', function() { setDirection('x-'); });
    document.getElementById('btn-right').addEventListener('click', function() { setDirection('x+'); });
}

/**
 * Функция генерации игрового поля
 */
function prepareGameField() {
    var game_table = document.createElement('table');
    game_table.setAttribute('class', 'game-table');

    for (var i = 0; i < FIELD_SIZE_Y; i++) {
        var row = document.createElement('tr');
        row.className = 'game-table-row row-' + i;

        for (var j = 0; j < FIELD_SIZE_X; j++) {
            var cell = document.createElement('td');
            cell.className = 'game-table-cell cell-' + i + '-' + j;
            row.appendChild(cell); 
        }
        game_table.appendChild(row);
    }
    document.getElementById('snake-field').appendChild(game_table);
}

/**
 * Старт игры
 */
function startGame() {
    if (gameIsRunning) return;
    gameIsRunning = true;
    respawn();

    snake_timer = setInterval(move, SNAKE_SPEED);
    setTimeout(createFood, 500);
}

/**
 * Функция расположения змейки (координаты)
 */
function respawn() {
    var start_coord_x = Math.floor(FIELD_SIZE_X / 2);
    var start_coord_y = Math.floor(FIELD_SIZE_Y / 2);

    snake = [
        { x: start_coord_x, y: start_coord_y + 1 }, // Хвост
        { x: start_coord_x, y: start_coord_y }      // Голова
    ];
    
    render();
}

/**
 * Отрисовка состояния змейки и еды на поле
 */
function render() {
    var cells = document.getElementsByClassName('game-table-cell');
    for (var i = 0; i < cells.length; i++) {
        cells[i].classList.remove('snake-unit', 'snake-head', 'food-unit');
    }

    for (var j = 0; j < snake.length; j++) {
        var unit = snake[j];
        var cell = document.getElementsByClassName('cell-' + unit.y + '-' + unit.x)[0];
        if (cell) {
            cell.classList.add('snake-unit');
            if (j === snake.length - 1) {
                cell.classList.add('snake-head');
            }
        }
    }

    if (food.x !== -1) {
        var foodCell = document.getElementsByClassName('cell-' + food.y + '-' + food.x)[0];
        if (foodCell) {
            foodCell.classList.add('food-unit');
        }
    }
}

/**
 * Движение змейки
 */
function move() {
    var head = snake[snake.length - 1];
    var newHead = { x: head.x, y: head.y };

    if (direction == 'x-') newHead.x--;
    else if (direction == 'x+') newHead.x++;
    else if (direction == 'y+') newHead.y--;
    else if (direction == 'y-') newHead.y++;

    if (isOutside(newHead) || isSnakeUnit(newHead.x, newHead.y)) {
        finishTheGame();
        return;
    }

    snake.push(newHead);

    if (newHead.x === food.x && newHead.y === food.y) {
        score++;
        speedUpSnake();
        createFood();
    } else {
        snake.shift(); 
    }

    render();
}

function isOutside(pos) {
    return pos.x < 0 || pos.x >= FIELD_SIZE_X || pos.y < 0 || pos.y >= FIELD_SIZE_Y;
}

function isSnakeUnit(x, y) {
    for (var i = 0; i < snake.length; i++) {
        if (snake[i].x === x && snake[i].y === y) {
            return true;
        }
    }
    return false;
}

function createFood() {
    var foodCreated = false;
    while (!foodCreated) {
        var food_x = Math.floor(Math.random() * FIELD_SIZE_X);
        var food_y = Math.floor(Math.random() * FIELD_SIZE_Y);
        if (!isSnakeUnit(food_x, food_y)) {
            food = { x: food_x, y: food_y };
            foodCreated = true;
        }
    }
    render();
}

function speedUpSnake() {
    if (SNAKE_SPEED > 100) {
        SNAKE_SPEED -= 30;
        clearInterval(snake_timer);
        snake_timer = setInterval(move, SNAKE_SPEED);
    }
}

function setDirection(newDir) {
    if (newDir == 'x-' && direction != 'x+') direction = 'x-';
    if (newDir == 'x+' && direction != 'x-') direction = 'x+';
    if (newDir == 'y+' && direction != 'y-') direction = 'y+';
    if (newDir == 'y-' && direction != 'y+') direction = 'y-';
}

function changeDirection(e) {
    switch (e.keyCode) {
        case 37: setDirection('x-'); break;
        case 38: setDirection('y+'); break;
        case 39: setDirection('x+'); break;
        case 40: setDirection('y-'); break;
    }
}

function finishTheGame() {
    gameIsRunning = false;
    clearInterval(snake_timer);
    alert('Вы проиграли! Ваш результат: ' + score);
}

function refreshGame() {
    location.reload();
}

if (typeof window !== 'undefined' && (window.onload === null || window.onload === undefined)) {
    window.onload = init;
}
