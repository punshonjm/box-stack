(function () {
	'use strict';

	class Box {
		constructor() {
			var max = 125;
			if ( _.random(1,3) % 2 == 0 ) {
				max = 9;
			} else if ( _.random(1,2) % 1 == 0 ) {
				max = 55;
			}

			this.id = _.uniqueId("box");
			this.value = _.random(1, max);
			this.placed = false;
		};

		render(withContainer = true) {
			if ( withContainer ) {
				return(`<div class="box col-3 col-md-12" data-id="${this.id}">
				<h4 class="bg-orange text-center text-white p-3">${this.value}</h4>
			</div>`);
			} else {
				return(`<h4 class="bg-orange text-center text-white p-3">${this.value}</h4>`);
			}

		};
	}

	class Shelf {
		constructor() {
			this.boxes = [];
		};

		shelve(Box) {
			if ( this.boxes.length < 4 ) {
				Box.placed = true;
				this.boxes.push(Box);
				return true;
			} else {
				console.log("No free slots");
				return false;
			}
		};

		removeBox(Box) {
			return _.pull(this.boxes, Box);
		};

		render() {
			var html = "";

			if ( this.boxes.length > 0 ) {
				html += this.boxes.map((Box) => Box.render()).join("");
			}

			if ( this.boxes.length < 4 ) {
				for ( let x = 4 - this.boxes.length; x > 0; x-- ) {
					html += `<div class='empty-space col-3 col-md-12'>
					<h4 class="text-center text-white p-3 bg-orange">&nbsp;</h4>
				</div>`;
				}
			}

			return html;
		};
	}

	class Stack {
		constructor() {
			this.id = _.uniqueId("stack");
			this.value = _.random(50,199);
			this.current = 0;
			this.boxes = [ ];
			this.status = "open";
		};

		stackBox(Box) {
			if ( this.status == "open" ) {
				Box.placed = true;
				this.boxes.push(Box);
				this.current += Box.value;

				if ( this.current == this.value ) {
					this.status = "done";
					return this.value;
				} else if ( this.current > this.value ) {
					this.status = "broken";
					return 0;
				} else {
					return true;
				}
			} else {
				console.log("Stack not open");
				return false;
			}
		};

		render() {
			return (`
			<div class="Stack col-6 col-md d-flex flex-column justify-content-end" data-id="${this.id}">
				<div class="Boxes d-none d-md-block w-100">
					${this.boxes.map((Box) => Box.render()).join("")}
				</div>
				<div class="w-100 text-center text-white">
					<h4 class="p-4 m-2 bg-${ (this.status == "broken") ? "danger" : "primary" }">${(this.value - this.current)}</h4>
				</div>
			</div>
		`);
		};
	}

	class Game {
		constructor( gameMode = false ) {
			this.GameMode = gameMode || "classic";
			this.Score = 0;

			this.Current = null;
			this.Hold = null;

			this.Shelf = new Shelf();
			this.Stacks = [ ];
			for ( let x = 0; x < 6; x++ ) {
				this.Stacks.push( new Stack() );
			}
		};

		showMessage( message = null, type = "success" ) {
			if ( message != "" && message != null ) {
				$(".overlay-value").text(message);
				$(".overlay-value").addClass("text-" + type);
				$("#score-overlay").show();

				setTimeout(function() {
					$("#score-overlay").hide();
					$(".overlay-value").text("");
					$(".overlay-value").removeClass("text-" + type);
				}, 1000);
			}
		};

		getAnotherBox( moveEnd = true ) {
			if ( this.Hold != null ) {
				this.Current = this.Hold;
				this.Hold = null;
				this.render();
				return true;
			} else if ( moveEnd || ( !moveEnd && this.Current == null ) ) {
				var newBox = new Box();
				this.Current = newBox;
				this.render();
				return true;
			} else {
				return false;
			}
		};

		placeBox( stack ) {
			var thisStack = _.find(this.Stacks, { id: stack });

			if ( this.Current != null ) {
				var score = thisStack.stackBox(this.Current);

				if ( score === true ) {
					// successful move
					this.getAnotherBox();
				} else if ( score === false ) {
					this.showMessage("Can't stack here.", "danger");
				} else if ( score === 0 ) {
					// stack broken
					if ( this.GameMode == "zen" ) ; else {
						this.getAnotherBox();
						this.showMessage(" :( Machine Broke", "danger");
					}
				} else {
					// stack complete
					this.Score += score;
					this.showMessage("+" + score);

					// Remove old stack on board
					$("[data-id='" + thisStack.id + "']").remove();

					// Create new stack in its place
					var index = _.findIndex(this.Stacks, { id: thisStack.id });
					this.Stacks.splice(index, 1, new Stack() );

					this.getAnotherBox();
				}

				this.checkEnd();
			} else {
				this.showMessage("Whoops! No box to stack.", "danger");
			}
		};

		shelveBox() {
			if ( this.Current != null ) {
				this.Shelf.shelve( this.Current );
				this.getAnotherBox();
			} else {
				this.showMessage("Whoops! No box to shelve.", "danger");
			}
		};

		getBox( boxId ) {
			if ( this.Hold == null ) {
				var boxes = _.remove(this.Shelf.boxes, { id: boxId });
				this.Hold = this.Current;
				this.Current = boxes[0];

				this.render();
			} else {
				console.log("Use the number");
				this.showMessage("Use the number you already picked up.", "warning");
			}
		};

		checkEnd() {
			var ended = true;

			this.Stacks.map((stack) => {
				if ( stack.status == "open" ) {
					ended = false;
				}
			});

			if ( ended ) {
				$("#game-over").show();
			}

			return ended;
		};

		render() {
			$(".My-Score").text(this.Score);

			$(".Current-Box").html( this.Current.render(false) );

			$(".Game-Shelf").html( this.Shelf.render() );

			$(".Game-Stacks").empty();
			this.Stacks.map((Stack) => {
				$(".Game-Stacks").append( Stack.render() );
			});
		};
	}

	var game;

	var startGame = function() {
		$("#main-menu").hide();
		$("#game-over").hide();
		$("#main-game").show();

		game = new Game();
		game.getAnotherBox();
	};

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
	});

	// First we get the viewport height and we multiple it by 1% to get a value for a vh unit
	let vh = window.innerHeight * 0.01;
	document.documentElement.style.setProperty('--vh', `${vh}px`);

	// We listen to the resize event
	window.addEventListener('resize', () => {
		let vh = window.innerHeight * 0.01;
		document.documentElement.style.setProperty('--vh', `${vh}px`);
	});

}());
