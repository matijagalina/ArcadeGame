// globally accesible variables
const $modal = document.getElementById('modal');
const $modalTitle = document.querySelector('#modal h3');
const $modalHistory = document.querySelector('#modal .scoreHistory');
const $modalStars = document.querySelector('#modal .scoreHistory .stars');
const $modalHighScore = document.querySelector('#modal .highScore');
const $lifeScore = document.querySelector('.lifes');
const $starsScore = document.querySelector('.starsScore');
const $blueGemScore = document.querySelector('.blueGemScore');
const $greenGemScore = document.querySelector('.greenGemScore');
const $orangeGemScore = document.querySelector('.orangeGemScore');
const $modalBtn = document.getElementById('newGameBtn');

let slow = getRandomNum(40, 70);
let fast = getRandomNum(100, 300);

// helper function
function getRandomNum(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

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
        let row = game.fields.rowFields[getRandomNum(0, 2)];
        return row;
    }
}

class Player {
    constructor() {
        this.sprite = 'images/char-boy.png';
        this.x = 202;
        this.y = 404;
        this.life = 3;
    }

    // starts game class methods
    update(dt) {
        game.keepScore();
        game.render();
    }

    // renders the player and checks for borders, pickup or crash
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.handleBorders();
        this.checkCollision();
        this.checkElementPickup();
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
            this.y = -11;
            this.checkKeyPickup();
        } else if (this.y > 404) {
            this.y = 404;
        } else if (this.x < 0) {
            this.x = 0;
        } else if (this.x > 404) {
            this.x = 404;
        }
    }

    // checks if the enemy-player collision has happened
    checkCollision(dt) {
        for (let i = 0; i < allEnemies.length; i++) {
            if (
                (allEnemies[i].y === this.y - 10) &&
                ((allEnemies[i].x > this.x - 65) && (allEnemies[i].x - this.x < 65))
            ) {
                game.signalLifeLost();
                this.handleCrash();
            }
        }
    }

    // defines enemy-player collision behaviour
    handleCrash() {
        this.x = 202;
        this.y = 404;

        player.life--;
        $lifeScore.innerHTML = 'Life left: ' + player.life;

        if (player.life === 0) {
            $modalTitle.innerHTML = 'YOU HAVE NO LIVES LEFT!';
            $modal.style.display = 'flex';
            allEnemies = [];
        }
    }

    //handles star pickup behaviour
    checkElementPickup() {
        if (
            (game.y === this.y - 10) &&
            ((game.x > this.x - 70) && (game.x - this.x < 70))
        ) {
            game.incrementCollected();

            game.sprite = game.extras[getRandomNum(0, 4)];
            game.x = game.fields.columnFields[getRandomNum(0, 4)];
            game.y = game.fields.rowFields[getRandomNum(0, 2)];
        }
    }

    // checks if the player has collected key and won the game
    checkKeyPickup() {
        if (
            (game.endPointRow === this.y - 10) &&
            ((game.endPointColumn > this.x - 70) && (game.endPointColumn - this.x < 70))
        ) {
            game.handleVictory();
        }
    }
}

// controls game-related aspects
class Game {

    constructor() {
        this.fields = {
            columnFields: [0, 101, 202, 303, 404],
            rowFields: [62, 145, 228],
            endFields: [-21]
        };
        this.extras = [
            'images/Star.png',
            'images/Heart.png',
            'images/Gem Blue.png',
            'images/Gem Green.png',
            'images/Gem Orange.png'
        ];
        this.sprite = this.extras[getRandomNum(0, 4)];
        this.x = this.fields.columnFields[getRandomNum(0, 4)];
        this.y = this.fields.rowFields[getRandomNum(0, 2)];
        this.starNum = 0;
        this.blueGemNum = 0;
        this.greenGemNum = 0;
        this.orangeGemNum = 0;
        this.endPoint = 'images/Key.png';
        this.endPointRow = this.fields.endFields[0];
        this.endPointColumn = this.fields.columnFields[getRandomNum(0, 4)];
    }

    // renders collectibles and key
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        ctx.drawImage(Resources.get(this.endPoint), this.endPointColumn, this.endPointRow);
    }

    // shows last game stats on the start
    keepScore() {
        if (localStorage.getItem('didRender')) {
            let stars = localStorage.getItem('starNum') || 0;
            $modalHistory.style.display = 'flex';
            $modalStars.innerHTML = stars + ' stars';
            game.handleHighScore();
            $modalHighScore.innerHTML = localStorage.getItem('highScore') + ' stars';
        }
    }

    // handles game behaviour when player arrive to the key
    handleVictory() {
        allEnemies = [];

        $modalTitle.innerHTML = 'YOU HAVE WON!';
        $modal.style.display = 'flex';
    }

    // update high score
    handleHighScore() {
        let high_score = localStorage.getItem('highScore');
        if (high_score === null) {
            localStorage.setItem('highScore', 0);
        }
        if (this.starNum > high_score) {
            localStorage.setItem('highScore', this.starNum);
        }
    }

    // flash body element background red when life lost
    signalLifeLost() {
        document.querySelector('body').style.backgroundColor = '#f92f2f';
        setTimeout(function () {
            document.querySelector('body').style.backgroundColor = '#1b1b1b';
        }, 200);
    }

    // handles collecting the extra elements, five gems add one life
    incrementCollected() {
        if (game.sprite === 'images/Star.png') {
            game.starNum++;
            $starsScore.innerHTML = 'Stars collected: ' + game.starNum;
            localStorage.setItem('starNum', game.starNum);
        }

        if (game.sprite === 'images/Heart.png') {
            player.life++;
            $lifeScore.innerHTML = 'Life left: ' + player.life;
        }

        if (game.sprite === 'images/Gem Blue.png') {
            game.blueGemNum++;
            if (game.blueGemNum === 5) {
                player.life++;
                $lifeScore.innerHTML = 'Life left: ' + player.life;
                game.blueGemNum = 0;
            }
            $blueGemScore.innerHTML = 'Blue gems: ' + game.blueGemNum;
        }

        if (game.sprite === 'images/Gem Green.png') {
            game.greenGemNum++;
            if (game.greenGemNum === 5) {
                player.life++;
                $lifeScore.innerHTML = 'Life left: ' + player.life;
                game.greenGemNum = 0;
            }
            $greenGemScore.innerHTML = 'Green gems: ' + game.greenGemNum;
        }

        if (game.sprite === 'images/Gem Orange.png') {
            game.orangeGemNum++;
            if (game.orangeGemNum === 5) {
                player.life++;
                $lifeScore.innerHTML = 'Life left: ' + player.life;
                game.orangeGemNum = 0;
            }
            $orangeGemScore.innerHTML = 'Orange gems: ' + game.orangeGemNum;
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
    game.starNum = 0;
    localStorage.setItem('starNum', game.starNum);
    $lifeScore.innerHTML = 'Life left: ' + player.life;

    game.endPointColumn = game.fields.columnFields[getRandomNum(0, 4)];
    $starsScore.innerHTML = 'Stars collected: 0';
    $blueGemScore.innerHTML = 'Blue gems: 0';
    $greenGemScore.innerHTML = 'Green gems: 0';
    $orangeGemScore.innerHTML = 'Orange gems: 0';

    for (let i = 0; i < 5; i++) {
        allEnemies.push(new Enemy());
    }

    localStorage.setItem('didRender', true);
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
