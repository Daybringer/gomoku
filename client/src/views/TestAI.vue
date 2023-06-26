<template>
  <ViewBaseResponsive>
    <BaseHighHeadline>AI Testing lab</BaseHighHeadline>
    <div class="border-4 border-red-400 h-96 w-96 flex">
      <Gameboard
        :boardSize="15"
        :circleColor="'green'"
        :crossColor="'red'"
        :interactive="isMyTurn"
        :turnHistory="turnHistory"
        :onGameClick="gameClick"
      />
    </div>
  </ViewBaseResponsive>
</template>

<script setup lang="ts">
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import Gameboard from "@/components/Gameboard.vue";
import { Turn } from "@/shared/types";
import { reactive, ref, Ref } from "vue";

const Engine = new Worker(new URL("./worker.js", import.meta.url));
const turnHistory: Turn[] = reactive([]);

const isMyTurn = ref(true);
const board = [
  //0 1  2  3  4  5  6  7  8  9  0  1  2  3  4
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //0
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //1
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //2
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //3
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //4
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //5
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //6
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //7
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //8
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //9
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //10
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //11
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //12
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //13
  [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0], //14
];
function gameClick(turn: Turn) {
  const [x, y] = [...turn];
  if (board[x][y] !== 0 && !isMyTurn.value) return;

  // Play my turn
  isMyTurn.value = false;
  board[x][y] = 1;
  turnHistory.push(turn);

  // Hand over to AI
  Engine.onmessage = (e) => {
    console.log("Message from worker:", e.data);
    const x = e.data.bestmove.i;
    const y = e.data.bestmove.j;
    console.log("Turn:", [x, y]);
    board[x][y] = -1;
    turnHistory.push([x, y]);
    isMyTurn.value = true;
  };
  Engine.postMessage([board, "foo", 6000]);
}

// Engine.onmessage = function (e) {
//   console.log(`Best move:`, e.data.bestmove);
//   console.log(`Cache Hits: ${e.data.CacheHits}`);
//   console.log(`Cache Cutoffs: ${e.data.CacheCutoffs}`);
//   console.log(`Cache Puts: ${e.data.CachePuts}`);
//   console.log(`function calls ${e.data.fc}`);
//   console.log(`Call to iterative mtdf took ${e.data.time} seconds.`);
//   console.log(`StateCacheHits: ${e.data.StateCacheHits}`);
//   console.log(`StateCachePuts: ${e.data.StateCachePuts}`);
//   console.log(e.data.firstMoves);
// };
</script>
