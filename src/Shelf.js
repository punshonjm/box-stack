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
};

export default Shelf;
