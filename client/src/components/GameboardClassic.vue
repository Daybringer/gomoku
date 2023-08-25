<template>
  <div id="gameBoardContainer" class="flex-1 relative">
    <div
      class="absolute z-0 w-full h-full bg-gray-950"
      :style="backgroundGridTemplate"
    >
      <!-- Cell grid -->
      <div
        v-for="cellID in generateCellIDs(boardSize + 1)"
        :key="cellID + 'background'"
        :id="`${cellID}background`"
        class="flex"
        style="background-color: #dec26bff"
      ></div>
    </div>
    <div class="absolute z-10 flex-1" :style="gridTemplate">
      <div
        v-for="cellID in generateCellIDs(boardSize)"
        :key="cellID"
        :id="`${cellID}`"
        class="cursor-pointer relative flex justify-center items-center"
        :style="
          isCellInWinningCombination(cellID)
            ? winningCombinationOutlineStyle
            : lastCellID === cellID
            ? lastOutlineStyle
            : ''
        "
        @click="
          clickedCell === cellID
            ? (emit('gameClick', cellIDToTurn(cellID)), (clickedCell = -1))
            : (clickedCell = cellID)
        "
        @mouseenter="hoveredCell = cellID"
        @mouseleave="hoveredCell = -1"
      >
        <ClassicStone class="h-90" :style="gameStoneStyle(cellID)" />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { Turn, Symbol } from "@/shared/types";
import { computed, ref, watch } from "vue";
import ClassicStone from "@/assets/svg/ClassicStone.vue";

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
width:calc(${(props.boardSize / (props.boardSize + 1)) * 100}%);
height:calc(${(props.boardSize / (props.boardSize + 1)) * 100}%);
top:calc(${
    Math.abs((props.boardSize / (props.boardSize + 1)) * 100 - 100) / 2
  }%);
left:calc(${
    Math.abs((props.boardSize / (props.boardSize + 1)) * 100 - 100) / 2
  }%);
  `;
});

const backgroundGridTemplate = computed(() => {
  return `
  display: grid;
  row-gap: ${props.linesWidth}px;
  column-gap: ${props.linesWidth}px;
  grid-template-rows: repeat(${props.boardSize + 1}, minmax(0, 1fr));
  grid-template-columns: repeat(${props.boardSize + 1}, minmax(0, 1fr));
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
function generateCellIDs(boardSize: number) {
  const array: number[] = [];
  for (let i = 0; i < Math.pow(boardSize, 2); i++) {
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
function gameStoneStyle(cellID: number) {
  if (cellDict.value[cellID] === Symbol.Circle) {
    return "color:#fff9ca;opacity:1;";
  }
  if (cellDict.value[cellID] === Symbol.Cross) {
    return "color:#0e0e0e;opacity:1;";
  }
  if (
    clickedCell.value !== -1 &&
    props.interactive &&
    cellDict.value[cellID] === Symbol.NotTaken &&
    clickedCell.value === cellID
  ) {
    if (madeTurns.value % 2 === 0) return "color:#fff9ca;opacity:0.8;";
    if (madeTurns.value % 2 === 1) return "color:#0e0e0e;opacity:0.7;";
  }

  if (
    hoveredCell.value === cellID &&
    cellDict.value[cellID] === Symbol.NotTaken &&
    props.interactive
  ) {
    if (madeTurns.value % 2 === 0) return "color:#fff9ca;opacity:0.5;";
    if (madeTurns.value % 2 === 1) return "color:#0e0e0e;opacity:0.3;";
  }

  return "opacity:0;";
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
