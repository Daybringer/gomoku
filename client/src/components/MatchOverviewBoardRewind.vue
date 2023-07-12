<template>
  <div class="flex flex-col gap-8 py-6">
    <div class="flex flex-row justify-evenly">
      <BaseButton @click="stepBack">
        <ChevronsDownIcon class="h-12 transform rotate-90" />
      </BaseButton>
      <BaseButton @click="stepForward">
        <ChevronsDownIcon class="h-12 transform -rotate-90" />
      </BaseButton>
    </div>
    <div class="square flex">
      <Gameboard
        ref="gameContainer"
        class="rounded-xl border-gray-300 dark:border-gray-600 border-4 overflow-hidden"
        :winning-combination="
          leftStack.length === game.turnHistory.length
            ? game.winningCombination
            : []
        "
        :cross-color="store.user.settings.opponentColor"
        :circle-color="store.user.settings.playerColor"
        :turn-history="leftStack"
        :lines-width="2"
        :board-size="15"
        :interactive="false"
        :last-outline-width="4"
        :last-outline-color="'#363636'"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Game } from "@/shared/interfaces/game.interface";
import { useStore } from "@/store/store";
import Gameboard from "./Gameboard.vue";
import { Turn } from "@/shared/types";
import { reactive } from "vue";
import BaseButton from "./BaseButton.vue";
import ChevronsDownIcon from "@/assets/svg/ChevronsDownIcon.vue";

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
    width: 35vw;
    height: 35vw;
  }
}
</style>
