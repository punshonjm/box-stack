import Game from './Game.js';

var game;

var startGame = function() {
	$("#main-menu").hide();
	$("#game-over").hide();
	$("#main-game").show();

	game = new Game();
	game.getAnotherBox();
}

$(document).ready(function() {

}).on("click", "#start-game", function() {
	startGame();
}).on("click", "#end-game", function() {
	$("#main-menu").show();
	$("#main-game").hide();
}).on("click", ".Game-Shelf .empty-space", function() {
	game.shelveBox();
}).on("click", ".Game-Shelf .box", function() {
	game.getBox( $(this).data().id );
}).on("click", ".Stack", function() {
	game.placeBox( $(this).data().id );
})

// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
let vh = window.innerHeight * 0.01;
document.documentElement.style.setProperty('--vh', `${vh}px`);

// We listen to the resize event
window.addEventListener('resize', () => {
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);
});
