import template from "./prd-field.handlebars";
import "./prd-field.css";

const DefaultProps = {
	id: 0,
	href: "#",
	imgSrc: "#",
	chgTime: "0일",
	prdName: "",
	puchaseNum: ".",
	regularPrice: {
		regularPrice: "",
		disPrice: "",
	},
	sale: "쇼킹딜가",
};

export default class PrdField {
	#template = template;
	#container;
	#data;

	constructor(container, data) {
		this.#container = container;
		this.#data = data;
	}

	render = () => {
		const container = document.getElementById(this.#container);
		container.innerHTML = this.#template(this.#data);
	};
}
