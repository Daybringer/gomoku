<template>
  <div ref="container" class="flex square">
    <button @click="stepBack">L</button>
    <button @click="stepForward">R</button>
    <Gameboard
      ref="gameContainer"
      :cross-color="store.user.enemyColor"
      :circle-color="store.user.playerColor"
      :turn-history="leftStack"
      :lines-width="2"
      :board-size="15"
      :interactive="false"
      :last-outline-width="4"
      :last-outline-color="'#363636'"
    ></Gameboard>
  </div>
</template>

<script setup lang="ts">
import { Game } from "@/shared/interfaces/game.interface";
import { useStore } from "@/store/store";
import Gameboard from "./Gameboard.vue";
import { Turn } from "@/shared/types";
import { reactive } from "vue";

const store = useStore();

const props = defineProps<{
  game: Game;
}>();

const leftStack: Turn[] = reactive([]);
props.game.turnHistory.forEach((turn) => {
  leftStack.push(turn);
});
const rightStack: Turn[] = reactive([]);

function stepBack() {
  const turn = leftStack.pop();
  if (turn) {
    rightStack.unshift(turn);
  }
}
function stepForward() {
  const turn = rightStack.shift();
  if (turn) {
    leftStack.push(turn);
  }
}
</script>

<style scoped>
/* md */
@media (max-width: 768px) {
  .square {
    width: 80vw;
    height: 80vw;
  }
}
@media (min-width: 768px) and (max-width: 1280px) {
  .square {
    width: 70vw;
    height: 70vw;
  }
}
@media (min-width: 1280px) {
  .square {
    width: 40vw;
    height: 40vw;
  }
}
</style>
