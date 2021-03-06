//jshint esversion: 6

AppContext = {

	constructor() {
		this.globals = [];
		this.listeners = [];
	},

	listen(key, cb) {
		if (!this.listeners[key]) {
			this.listeners[key] = [];
		}
		this.listeners[key].push(cb);
	},

	getValue(key) {
		return this.globals[key];
	},

	setValue(key, value) {
		let oldValue = this.globals[key];
		this.globals[key] = value;
		for (let listener of this.listeners[key]) {
			listener(value, oldValue);
		}
	}
};

window.AppContext = window.AppContext || AppContext;
