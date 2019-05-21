import Box from './Box.js';
import Shelf from './Shelf.js';
import Stack from './Stack.js';

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
				if ( this.GameMode == "zen" ) {

				} else {
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
};

export default Game;
