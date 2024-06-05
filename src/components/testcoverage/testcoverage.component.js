import { Component, Stream } from '@marcellejs/core';
import View from './testcoverage.view.svelte';

export class Testcoverage extends Component {
	constructor(dataset) {
		super();
		this.title = 'testcoverage [custom component 🤖]';
		this.dataset = dataset;
		this.$chartData = new Stream([], true);
		this.start();
	}

	ShowChart(){
		this.update();
	}

	async update(){
		
	}

	mount(target) {
		const t = target || document.querySelector(`#${this.id}`);
		if (!t) return;
		this.destroy();
		this.$$.app = new View({
			target: t,
			props: {
				title: this.title,
				chartData: this.$chartData,
			}
		});
	}
}
