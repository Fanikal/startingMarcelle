import { Component } from '@marcellejs/core';
import View from './accuracyplot.view.svelte';

export class Accuracyplot extends Component {
	constructor(options = {}) {
		super();
		this.title = 'accuracyplot [custom component 🤖]';
		this.options = options;
	}

	mount(target) {
		const t = target || document.querySelector(`#${this.id}`);
		if (!t) return;
		this.destroy();
		this.$$.app = new View({
			target: t,
			props: {
				title: this.title,
				options: this.options
			}
		});
	}
}
