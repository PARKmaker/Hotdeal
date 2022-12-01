import template from "./app.template.handlebars";
import PrdField from "./view/prd-field";
import data from "./core/firebaseApi";
import "./app.css";

export default class App {
	#template = template;
	#dataArr = data;
	#container;
	#fields;
	#ids;

	constructor(container) {
		this.#container = document.querySelector(container);
		this.#fields = [];
		this.#ids = [];
		this.#initialize();
	}

	#initialize = () => {
		this.#dataArr.forEach(
			(data) =>
				this.#priceOnlyNumber(data) ||
				(this.#fields.push(new PrdField(data.id, data)) && this.#ids.push(data.id))
		);
		this.#ids = {
			ids: this.#ids,
		};
	};

	#priceOnlyNumber = (price) => {
		const priceType = ["regularPrice", "disPrice"];

		priceType.forEach(
			(type) => (price.regularPrice[`${type}`] = price.regularPrice[`${type}`].slice(3))
		);
	};

	render = () => {
		const mainFragment = document.createElement("main");
		mainFragment.innerHTML = this.#template(this.#ids);
		this.#container.appendChild(mainFragment);

		this.#fields.forEach((field) => {
			field.render();
		});
	};
}
