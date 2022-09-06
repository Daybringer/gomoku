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
import { useStore } from "@/store/store";
export default defineComponent({
  name: "GameSimulation",
  setup(props, context) {
    const store = useStore();
    const gameSimulation = new GameSimulation({
      drawSpeed: 0.75,
      gridLineWidth: 0.5,
      // primaryColor: "#00b3fe",
      primaryColor: store.user.playerColor,
      // secondaryColor: "#ff2079",
      secondaryColor: store.user.enemyColor,
      gridColor: "#8f8f8f",
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
