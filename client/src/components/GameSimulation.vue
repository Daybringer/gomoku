<template>
  <canvas
    class="absolute h-full w-full z-10 opacity-50"
    id="simulationCanvas"
    ref="simulationCanvas"
  ></canvas>
</template>

<script lang="ts">
import { defineComponent, onMounted, onUnmounted, ref } from "vue";
import GameSimulation from "../utils/gameSimulation";
export default defineComponent({
  name: "GameSimulation",
  setup(props, context) {
    const gameSimulation = new GameSimulation({
      drawSpeed: 1,
      gridLineWidth: 1,
      primaryColor: "#00b3fe",
      secondaryColor: "#ff2079",
      gridColor: "rgba(100, 100, 227, 1)",
      cellSize: 35,
    });

    onMounted(() => {
      gameSimulation.initialize("simulationCanvas");
    });

    onUnmounted(() => {
      gameSimulation.destroy();
    });
  },
});
</script>

<style></style>
