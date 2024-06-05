import { Component, Stream } from '@marcellejs/core';
import { UMAP } from 'umap-js';
import View from './umap.view.svelte';

export class Umap extends Component {
	constructor(dataset) {
		super();
		this.title = 'umap [custom component 🤖]';
		this.dataset = dataset;
		this.$embedding = new Stream([], true);
		this.$labels = new Stream([], true);
    	this.start();
	}

	async update(){
		const instances = await this.dataset.items().select(['x', 'y']).toArray();
		// Concatenate all instance features in a 2D array:
		const umapData = instances.reduce((d, { x }) => d.concat([x[0]]), []);
		const labels = instances.map(({y}) => y);
		this.$labels = labels;
		const umap = new UMAP();
		const finalEmbedding = await umap.fitAsync(umapData, () => {
		  this.$embedding.set(umap.getEmbedding());
		});
		this.$embedding.set(finalEmbedding);
	}

	mount(target) {
		const t = target || document.querySelector(`#${this.id}`);
		if (!t) return;
		this.destroy();
		this.$$.app = new View({
			target: t,
			props: {
				title: this.title,
				embedding: this.$embedding,
				labels: this.$labels,
			}
		});
	}
}
