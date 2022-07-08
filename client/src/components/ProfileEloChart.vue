<template>
  <canvas id="myChart" width="400" height="200"></canvas>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Chart from "chart.js/auto";

export default defineComponent({
  name: "EloChart",
  mounted() {
    const canvas = document.getElementById("myChart") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d")!;
    const myChart = new Chart(ctx, {
      type: "line",
      data: {
        labels: [
          "September",
          "October",
          "November",
          "December",
          "January",
          "February",
        ],
        datasets: [
          {
            label: "ELO",
            data: [1200, 1380, 1401, 1290, 1414, 1481],
            backgroundColor: ["rgba(255, 99, 132, 0.2)"],
            borderColor: ["rgba(255, 99, 132, 1)"],
            borderWidth: 2,
            fill: true,
            pointBackgroundColor: "rgba(255, 99, 132, 1)",
          },
        ],
      },
      options: {
        scales: {
          y: {
            beginAtZero: false,
          },
        },
      },
    });
  },
});
</script>

<style scoped></style>
