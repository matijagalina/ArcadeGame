Arcade Game (Frogger Clone)
===============================

**HOW TO RUN**

To run this game you should have a browser who fully support canvas html5 element (check it here: https://caniuse.com/#search=canvas) and ES6 Javascript class features (check it here: https://caniuse.com/#search=es6%20class ). There is no mobile version of this game (you can play it only with keyboard) so be sure you are on desktop computer or laptop.
The game is accesible from this url: https://matijagalina.github.io/ArcadeGame/

**HOW TO PLAY**

The goal of this game is simple - cross the road and collect the key on the other end of the street.
To stop you from fulfilling that goal there are five bugs which will be crossing street from left to right dynamically changing their speed. You must not touch them because that will initiate a crash sequence in which the black background will briefly change it's color to red, you will be pushed back to starting position and you will lost one life. The crash is initiated when the bug enters the square which the player occupies.

At the start the player has three lifes which he can earn more by collecting the red heart symbols or by collecting five gems of the same colors. The number of the gems, hearts, stars and lifes are displayed above the playing ground.
When you lose all the lifes the game is lost.

You can also collect stars which count to you high score. At the beggining of every game (except the first one ever) you will be reminded how much stars did you collect last time and which is your high score.

When you win or lose game the modal window will appear with informations about the game and the button through you can start a new one.

Have fun!

**GAME ENGINE**

Game uses html5 canvas element to dynamically create a game and it is build using ES6 Javascript features like classes and OOP.

This project is made for Udacity Frontend Nanodegree as a part of Google Developer Scholarship 2017/2018
