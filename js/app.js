// globally accesible variables
const $modal = document.getElementById('modal');
const $modalTitle = document.querySelector('#modal h3');
const $modalHistory = document.querySelector('#modal .scoreHistory');
const $modalStars = document.querySelector('#modal .scoreHistory .stars');
const $lifeScore = document.querySelector('.lifes');
const $starsScore = document.querySelector('.starsScore');
const $modalBtn = document.getElementById('newGameBtn');
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

let slow = getRandomNum(40, 70);
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
        this.life = 3;
        this.stars = 0;
    }

    // starts game class methods
    update(dt) {
        game.keepScore();
        game.render();
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.handleBorders();
        this.checkCollision();
        this.checkStarPickup();
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
        allEnemies = [];

        $modalTitle.innerHTML = 'YOU HAVE WON!';
        $modal.style.display = 'flex';
    }

    // defines enemy-player collision behaviour
    handleCrash() {
        this.x = 202;
        this.y = 404;

        player.life--;
        if (player.life === 0) {
            $modalTitle.innerHTML = 'YOU HAVE NO LIVES LEFT!';
            $modal.style.display = 'flex';
            allEnemies = [];
        }
        $lifeScore.innerHTML = 'Life left: ' + player.life;
    }

    // checks if the enemy-player collision has happened
    checkCollision(dt) {
        for (let i = 0; i < allEnemies.length; i++) {
            if (
                (allEnemies[i].y === this.y - 10) &&
                ((allEnemies[i].x > this.x - 70) && (allEnemies[i].x - this.x < 70))
            ) {
                this.handleCrash();
            }
        }
    }

    //handles star pickup behaviour
    checkStarPickup() {
        if (
            (game.y === this.y - 10) &&
            ((game.x > this.x - 70) && (game.x - this.x < 70))
        ) {

            game.x = game.fields.rowFields[getRandomNum(0,4)];
            game.y = game.fields.columnFields[getRandomNum(0,2)];

            game.starNum++;
            $starsScore.innerHTML = 'Stars collected: ' + game.starNum;
            sessionStorage.setItem('starNum', game.starNum);
        }
    }
}

// controls game-related aspects
class Game {

    constructor() {
        this.fields = {
            rowFields : [0, 101, 202, 303, 404],
            columnFields : [62, 145, 228]
        }
        this.star = 'images/star.png';
        this.x = this.fields.rowFields[getRandomNum(0,4)];
        this.y = this.fields.columnFields[getRandomNum(0,2)];;
        this.starNum = 0;
        
         // this.heart = 'images/heart.png';
    }

    render() {
        ctx.drawImage(Resources.get(this.star), this.x, this.y);
        // ctx.drawImage(Resources.get(this.heart), this.fields.rowFields[1], this.fields.columnFields[1]);
    }

    // shows last game stats on the start
    keepScore() {
        if (sessionStorage.getItem('didRender')) {
            let stars = sessionStorage.getItem('starNum') || 0;
            $modalHistory.style.display = 'flex';
            $modalStars.innerHTML = 'Stars: ' + stars;
        }
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

let allEnemies = [];
const player = new Player();
const game = new Game();

// This restarts the game from inside victory dialog
$modalBtn.addEventListener('click', function () {
    $modal.style.display = 'none';
    player.y = 404;
    player.life = 3;
    $lifeScore.innerHTML = 'Life left: ' + player.life;
    $starsScore.innerHTML = 'Stars collected: 0';

    for (let i = 0; i < 5; i++) {
        allEnemies.push(new Enemy());
    }

    sessionStorage.setItem('didRender', true);
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
