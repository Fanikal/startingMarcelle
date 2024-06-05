<script>
import { ViewContainer } from '@marcellejs/design-system';
import { onMount } from 'svelte';
import Chart from 'chart.js/auto';

let chart;

  const Utils = {
      CHART_COLORS: {
          green: 'rgb(98, 217, 85)',
          red: 'rgb(222, 75, 93)'
      },
      classes({ count }) {
          const xAxis = ["Bridge", "Park", "Road", "Square", "Monument", "Residence", "Lake", "Forest", "River", "Agriculture"];
          return xAxis.slice(0, count);
      },
      numbers({ count, min, max }) {
          const numbers = [];
          for (let i = 0; i < count; i++) {
              numbers.push(Math.floor(Math.random() * (max - min + 1)) + min);
          }
          return numbers;
      }
  };

  const DATA_COUNT = 10;
  const NUMBER_CFG = { count: DATA_COUNT, min: 0, max: 100 };
  const chartLabels = Utils.classes({ count: 10 });

  const data = {
      labels: chartLabels,
      datasets: [
          {
              label: 'Pass',
              data: Utils.numbers(NUMBER_CFG),
              backgroundColor: Utils.CHART_COLORS.green,
          },
          {
              label: 'Fail',
              data: Utils.numbers(NUMBER_CFG),
              backgroundColor: Utils.CHART_COLORS.red,
          },
      ]
  };

  const config = {
      type: 'bar',
      data: data,
      options: {
          plugins: {
              title: {
                  display: true,
                  text: 'Chart.js Bar Chart - Stacked'
              },
          },
          responsive: true,
          scales: {
              x: {
                  stacked: true,
              },
              y: {
                  stacked: true
              }
          }
      }
  };

  onMount(() => {
      const ctx = document.getElementById('stackedChartID').getContext('2d');
      chart = new Chart(ctx, config);
  });
</script>

<style>
  h1 {
      color: green;
  }
</style>

<h1>Chart JS so far</h1>

<div>
  <canvas id="stackedChartID" bind:this={chart}></canvas>
</div>

