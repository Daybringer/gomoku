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
import { useProfileStore } from "@/store/profile";
import { storeToRefs } from "pinia";
const { user } = storeToRefs(useProfileStore());
const gameSimulation = new GameSimulation({
  drawSpeed: 0.75,
  gridLineWidth: 1,
  primaryColor: user.value.settings.playerColor,
  secondaryColor: user.value.settings.opponentColor,
  gridColor: "#808080",
  cellSize: 35,
});

onMounted(() => {
  gameSimulation.initialize("simulationCanvas");
});

onUnmounted(() => {
  gameSimulation.destroy();
});
</script>
