const modal = document.getElementById('victoryModal');
const modalBtn = document.getElementById('newGameBtn');

class Enemy {
    constructor() {
        this.sprite = 'images/enemy-bug.png';
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    checkCollisions() {

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
    }

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

    handleBorders() {
        if (this.y < 0) {
            this.y = 404;
            this.handleVictory();
        } else if (this.y > 404) {
            this.y = 404;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.x > 404) {
            this.x = 404;
        }
    }

    handleVictory() {
        modal.style.display = 'flex';
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const allEnemies = [];
const player = new Player();


modalBtn.addEventListener('click', function () {
    modal.style.display = 'none';
});
// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function (e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
