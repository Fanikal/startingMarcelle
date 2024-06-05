<script>
import { ScatterGL } from 'scatter-gl';
import { onMount } from 'svelte';
import { ViewContainer } from '@marcellejs/design-system';

export let title;
export let embedding;
export let labels;

let scatterContainer;
let scatterGL;

onMount(() => {
    scatterGL = new ScatterGL(scatterContainer, {
      styles: {
        point: { scaleDefault: 1.6, scaleSelected: 2, scaleHover: 2 },
      },
    });

    embedding.subscribe((points) => {
      if (points.length > 0) {
        const dataset = new ScatterGL.Dataset(points);
        scatterGL.render(dataset);
      }
    });

  labels.subscribe((labs) => {
      const uniqueLabels = Array.from(new Set(labs));
      const hues = uniqueLabels.map((_, i) => Math.floor((255 * i) / uniqueLabels.length));
      const colors = hues.map((h) => `hsla(${h}, 100%, 50%, 0.75)`);
      scatterGL.setPointColorer((i) => colors[uniqueLabels.indexOf(labs[i])]);
    });
  });

</script>

<ViewContainer {title}>
  <div id="scatter-container" bind:this={scatterContainer} />
</ViewContainer>

<style>
  #scatter-container {
    height: 400px;
  }
</style>