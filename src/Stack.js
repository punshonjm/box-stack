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
};

export default Stack;
