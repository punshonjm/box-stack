class Box {
	constructor() {
		var max = 125;
		if ( _.random(1,3) % 2 == 0 ) {
			max = 9
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
};

export default Box;
