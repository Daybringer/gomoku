<template>
  <div class="flex-1 bg-gray-600 dark:bg-gray-700" :style="gridTemplate">
    <!-- Cell grid -->
    <div
      v-for="cellID in generateCellIDs()"
      :key="cellID"
      :id="`${cellID}`"
      class="bg-white dark:bg-gray-500 cursor-pointer relative"
      :style="
        (isCellInWinningCombination(cellID)
          ? winningCombinationOutlineStyle
          : lastCellID === cellID
          ? lastOutlineStyle
          : '') + cellStyle(cellID)
      "
      @click="
        clickedCell === cellID
          ? (emit('gameClick', cellIDToTurn(cellID)), (clickedCell = -1))
          : (clickedCell = cellID)
      "
      @mouseenter="hoveredCell = cellID"
      @mouseleave="hoveredCell = -1"
    ></div>
  </div>
</template>

<script setup lang="ts">
import { Turn, Symbol } from "@/shared/types";
import { computed, ref, watch } from "vue";

// Defines
const props = withDefaults(
  defineProps<{
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
    linesWidth: 3,
    lastOutlineColor: "#363636",
    lastOutlineWidth: 5,
    winningCombinationOutlineColor: "#ff2079",
  }
);

// const defaultProps = {
// };
const emit = defineEmits<{
  (e: "gameClick", position: Turn);
}>();

// ------- Refs ------- \\
const lastCellID = computed(() => {
  return madeTurns.value > 0
    ? turnToCellID(props.turnHistory[props.turnHistory.length - 1])
    : -1;
});
const madeTurns = computed(() => props.turnHistory.length);
const hoveredCell = ref(-1);
const clickedCell = ref(-1);

const cellDict = computed(() => {
  const res: Record<number, Symbol> = {};
  for (let i = 0; i < Math.pow(props.boardSize, 2); i++) {
    res[i] = Symbol.NotTaken;
  }
  for (let i = 0; i < madeTurns.value; i++) {
    const symbol = i % 2 == 0 ? Symbol.Circle : Symbol.Cross;
    res[turnToCellID(props.turnHistory[i])] = symbol;
  }
  return res;
});
// ------- Style Refs ------- \\
const gridTemplate = computed(() => {
  return `
  display: grid;
  row-gap: ${props.linesWidth}px;
  column-gap: ${props.linesWidth}px;
  grid-template-rows: repeat(${props.boardSize}, minmax(0, 1fr));
  grid-template-columns: repeat(${props.boardSize}, minmax(0, 1fr));
  `;
});

const lastOutlineStyle = computed(() => {
  return `z-index:10; outline:${props.lastOutlineWidth}px solid ${props.lastOutlineColor};`;
});
const winningCombinationOutlineStyle = computed(() => {
  return `z-index:10; outline:${props.lastOutlineWidth}px solid ${props.winningCombinationOutlineColor};`;
});

// ------ Functions ------ \\
function isCellInWinningCombination(cellID: number): boolean {
  if (!props.winningCombination) return false;
  return props.winningCombination.some(
    (val) =>
      val[0] === cellIDToTurn(cellID)[0] && val[1] === cellIDToTurn(cellID)[1]
  );
}
function generateCellIDs() {
  const array: number[] = [];
  for (let i = 0; i < Math.pow(props.boardSize, 2); i++) {
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
function cellStyle(cellID: number) {
  if (cellDict.value[cellID] === Symbol.Circle) {
    return `background-color:${props.circleColor};opacity:1;`;
  }
  if (cellDict.value[cellID] === Symbol.Cross) {
    return `background-color:${props.crossColor};opacity:1;`;
  }
  if (
    clickedCell.value !== -1 &&
    props.interactive &&
    cellDict.value[cellID] === Symbol.NotTaken &&
    clickedCell.value === cellID
  ) {
    if (madeTurns.value % 2 === 0)
      return `background-color:${props.circleColor};opacity:0.5;`;
    if (madeTurns.value % 2 === 1)
      return `background-color:${props.crossColor};opacity:0.5;`;
  }

  if (
    hoveredCell.value === cellID &&
    cellDict.value[cellID] === Symbol.NotTaken &&
    props.interactive
  ) {
    if (madeTurns.value % 2 === 0)
      return `background-color:${props.circleColor};opacity:0.3;`;
    if (madeTurns.value % 2 === 1)
      return `background-color:${props.crossColor};opacity:0.3;`;
  }

  return "";
}
</script>

<style scoped></style>
