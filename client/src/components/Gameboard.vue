<template>
  <GameboardStandard
    v-if="boardType === GameBoard.Standard"
    ref="gameContainer"
    :winning-combination="winningCombination"
    :cross-color="crossColor"
    :circle-color="circleColor"
    :turn-history="turnHistory"
    :lines-width="linesWidth"
    :board-size="boardSize"
    :interactive="interactive"
    :last-outline-width="lastOutlineWidth"
    :last-outline-color="'#363636'"
    class="select-none"
    :winning-combination-outline-color="winningCombinationOutlineColor"
    @game-click="(turn) => emit('gameClick', turn)" />
  <GameboardClassic
    v-if="boardType === GameBoard.Classic"
    ref="gameContainer"
    :winning-combination="winningCombination"
    :cross-color="crossColor"
    :circle-color="circleColor"
    :turn-history="turnHistory"
    :lines-width="linesWidth"
    :board-size="boardSize"
    :interactive="interactive"
    :last-outline-width="lastOutlineWidth"
    :last-outline-color="'#363636'"
    class="select-none"
    :winning-combination-outline-color="winningCombinationOutlineColor"
    @game-click="(turn) => emit('gameClick', turn)" />
  <GameboardModern
    v-if="boardType === GameBoard.Modern"
    ref="gameContainer"
    :winning-combination="winningCombination"
    :cross-color="crossColor"
    :circle-color="circleColor"
    :turn-history="turnHistory"
    :lines-width="linesWidth"
    :board-size="boardSize"
    :interactive="interactive"
    :last-outline-width="lastOutlineWidth"
    :last-outline-color="'#363636'"
    :winning-combination-outline-color="winningCombinationOutlineColor"
    class="select-none"
    @game-click="(turn) => emit('gameClick', turn)" />
</template>

<script setup lang="ts">
import { GameBoard, Turn } from "@/shared/types";
import GameboardStandard from "./GameboardStandard.vue";
import GameboardClassic from "./GameboardClassic.vue";
import GameboardModern from "./GameboardModern.vue";

// Defines
const props = withDefaults(
  defineProps<{
    boardType: GameBoard;
    turnHistory: Turn[];
    crossColor: string;
    circleColor: string;
    interactive: boolean;
    winningCombination?: Turn[];
    boardSize?: number;
    linesWidth?: number;
    lastOutlineWidth?: number;
    lastOutlineColor?: string;
    winningCombinationOutlineColor?: string;
  }>(),
  {
    boardSize: 15,
    linesWidth: 2,
    lastOutlineColor: "#363636",
    lastOutlineWidth: 3,
    winningCombinationOutlineColor: "#ff2079",
  }
);

// const defaultProps = {
// };
const emit = defineEmits<{
  (e: "gameClick", position: Turn);
}>();
</script>
