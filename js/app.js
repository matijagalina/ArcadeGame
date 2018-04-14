// globally accesible variables
const modal = document.getElementById('modal');
const modalTitle = document.querySelector('#modal h3');
const modalBtn = document.getElementById('newGameBtn');
const rowOne = 62;
const rowTwo = 145;
const rowThree = 228;
const rows = [rowOne, rowTwo, rowThree];

// helper function
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

let slow = getRandomNum(30, 70);
let fast = getRandomNum(100, 300);

class Enemy {
    constructor() {
        this.sprite = 'images/enemy-bug.png';
        this.x = 0;
        this.y = this.appendToRow();
        this.speed = this.calculateSpeed();
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.x + (this.speed * dt);
        this.handleBorders();
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    // returns random speed for enemies
    calculateSpeed() {
        let speed = (getRandomNum(slow, fast));
        return speed;
    }

    // returns enemies to the start and defines them new speed
    handleBorders() {
        if (this.x > 404) {
            this.x = 0;
            this.y = this.appendToRow();
            this.speed = this.calculateSpeed();
        }
    }

    // returns a random row number
    appendToRow() {
        let row = rows[getRandomNum(0, 2)];
        return row;
    }
}

class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 202;
        this.y = 404;
    }

    update(dt) {

    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.handleBorders();
        this.checkCollision();
    }

    // defines the key input behaviour
    handleInput(key) {
        if (key === 'up') {
            this.y = this.y - 83;
        } else if (key === 'down') {
            this.y = this.y + 83;
        } else if (key === 'left') {
            this.x = this.x - 101;
        } else if (key === 'right') {
            this.x = this.x + 101;
        }
        this.render();
    }

    // constricts player movement inside game field
    handleBorders() {
        if (this.y < 0) {
            this.handleVictory();
        } else if (this.y > 404) {
            this.y = 404;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.x > 404) {
            this.x = 404;
        }
    }

    // handles game behaviour when player arrive to the water block
    handleVictory() {
        modalTitle.innerHTML = 'YOU HAVE WON!';
        modal.style.display = 'flex';
    }

    // defines enemy-player collision behaviour
    handleCrash() {
        this.x = 202;
        this.y = 404;
        for (let i = 0; i < allEnemies.length; i++) {
            allEnemies[i].x = 0;
        }

        modalTitle.innerHTML = 'YOU HAVE LOST!';
        modal.style.display = 'flex';
    }

    // checks if the enemy-player collision has happened
    checkCollision() {
        for (let i = 0; i < allEnemies.length; i++) {
            if (
                (allEnemies[i].y === this.y - 10) &&
                ((allEnemies[i].x > this.x - 70) && (allEnemies[i].x - this.x < 70))
            ) {
                this.handleCrash();
            }
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player
const enemyOne = new Enemy();
const enemyTwo = new Enemy();
const enemyThree = new Enemy();
const allEnemies = [enemyOne, enemyTwo, enemyThree];
const player = new Player();

// This restarts the game from inside victory dialog
modalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
    player.y = 404;
    for (let i = 0; i < allEnemies.length; i++) {
        allEnemies[i].x = 0;
    }
});

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    const allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
