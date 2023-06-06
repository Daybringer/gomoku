<template>
  <div
    class="flex-1 bg-gray-600 dark:bg-gray-700 w-0 relative"
    :style="gridTemplate"
  >
    <!-- Cell grid -->
    <div
      v-for="cellID in generateCellIDs()"
      :key="cellID"
      :id="`${cellID}`"
      class="bg-white dark:bg-gray-500 cursor-pointer relative"
      :style="`${
        lastCellID === cellID
          ? `z-index:10;outline:${lastOutlineColor} solid ${lastOutlineWidth}px;`
          : ''
      }`"
      @click="emit('gameClick', cellIDToTurn(cellID))"
      @mouseenter="hoveredCell = cellID"
      @mouseleave="hoveredCell = -1"
    >
      <game-stone-circle
        class="svgCC"
        :style="`color:${circleColor};opacity:${cellOpacity(
          cellID,
          true
        )} !important;`"
      />
      <game-stone-cross
        class="svgCC"
        :style="`color:${crossColor};opacity:${cellOpacity(
          cellID,
          false
        )} !important;`"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Turn } from "@/shared/types";
import { computed, ref } from "vue";
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";

// Defines
const props = defineProps<{
  turnHistory: Turn[];
  crossColor: string;
  circleColor: string;
  boardSize: number;
  linesWidth: number;
  lastOutlineWidth: number;
  interactive: boolean;
  lastOutlineColor: string;
}>();
const emit = defineEmits<{
  (e: "gameClick", position: Turn);
}>();

// ------ Refs ------
const lastCellID = computed(() => {
  return madeTurns.value > 0
    ? turnToCellID(props.turnHistory[props.turnHistory.length - 1])
    : -1;
});

const madeTurns = computed(() => props.turnHistory.length);
const hoveredCell = ref(-1);

enum Symbol {
  NotTaken,
  Circle,
  Cross,
}
const cellDict = computed(() => {
  const res: Record<number, Symbol> = {};
  for (let i = 0; i < props.boardSize * props.boardSize; i++) {
    res[i] = Symbol.NotTaken;
  }
  for (let i = 0; i < madeTurns.value; i++) {
    const symbol = i % 2 == 0 ? Symbol.Circle : Symbol.Cross;
    res[turnToCellID(props.turnHistory[i])] = symbol;
  }
  return res;
});

const gridTemplate = computed(() => {
  return `
  display: grid;
  row-gap: ${props.linesWidth}px;
  column-gap: ${props.linesWidth}px;
  grid-template-rows: repeat(${props.boardSize}, minmax(0, 1fr));
  grid-template-columns: repeat(${props.boardSize}, minmax(0, 1fr));
  `;
});

// ------ Functions ------ \\
function generateCellIDs() {
  const array: number[] = [];
  for (let i = 0; i < props.boardSize * props.boardSize; i++) {
    array.push(i);
  }
  return array;
}
function turnToCellID(turn: Turn): number {
  return turn[0] + turn[1] * props.boardSize;
}
function cellIDToTurn(cellID: number): Turn {
  return [cellID % props.boardSize, Math.floor(cellID / props.boardSize)];
}
function cellOpacity(cellID: number, isCircle: boolean) {
  if (cellDict.value[cellID] === Symbol.Circle && isCircle) {
    return "1";
  }
  if (cellDict.value[cellID] === Symbol.Cross && !isCircle) {
    return "1";
  }
  if (
    hoveredCell.value === cellID &&
    cellDict.value[cellID] === Symbol.NotTaken &&
    props.interactive
  ) {
    if (madeTurns.value % 2 === 0 && isCircle) return "0.3";
    if (madeTurns.value % 2 === 1 && !isCircle) return "0.3";
  }

  return 0;
}
</script>

<style scoped>
.svgCC {
  width: 85%;
  position: absolute;
  display: block !important;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  -webkit-animation: opacityIn 0.5s forwards;
  animation: opacityIn 0.5s forwards;
  opacity: 1;
}
</style>
