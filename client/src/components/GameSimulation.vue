<template>
  <canvas
    class="absolute h-full w-full z-10 opacity-80"
    id="simulationCanvas"
    ref="simulationCanvas"
  ></canvas>
</template>
<script setup lang="ts">
import { onMounted, onUnmounted } from "vue";
import GameSimulation from "../utils/gameSimulation";
import { useStore } from "@/store/store";
const store = useStore();
const gameSimulation = new GameSimulation({
  drawSpeed: 0.75,
  gridLineWidth: 1,
  primaryColor: store.user.playerColor,
  secondaryColor: store.user.enemyColor,
  gridColor: "#808080",
  // gridColor: "#000000",
  cellSize: 35,
});

onMounted(() => {
  gameSimulation.initialize("simulationCanvas");
});

onUnmounted(() => {
  gameSimulation.destroy();
});
</script>
