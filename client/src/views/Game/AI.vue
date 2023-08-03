<template>
  <ViewBaseResponsive>
    <TheGameBase
      :me="me"
      :opponent="ai"
      :currentPlayer="currentPlayer"
      :hasTimeLimit="true"
      :gameState="gameState"
      :turnHistory="turnHistory"
      :endingType="endingType"
      :winner="winner"
      :opening="settings.openingType"
      :openingPhase="openingPhase"
      :myColor="userStore.user.settings.playerColor"
      :enemyColor="userStore.user.settings.opponentColor"
      :messages="messages"
      :gameType="GameType.Custom"
      :winningCombination="winningCombination"
      @gameClick="gameClick"
      @sendMessage="sendMessage"
    />
  </ViewBaseResponsive>
</template>
<script setup lang="ts">
import TheGameBase from "@/components/TheGameBase.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import { useCampaignStore } from "@/store/campaign";
import { Ref, onMounted, ref } from "vue";
import {
  EndingType,
  GameChatMessage,
  GameType,
  Opening,
  OpeningPhase,
  Player,
  Symbol,
  Turn,
} from "@/shared/types";
import { GameState } from "@/utils/types.dt";
import { useStore } from "@/store/store";
import { ProfileIcon } from "@/shared/icons";
import { GomokuBoard } from "gomoku-game";
import { GameSettingsIdless } from "@/shared/interfaces/gameSettings.interface";
import { COIN_SPIN_DURATION } from "@/shared/constants";
import { computed } from "vue";

// ------- Initializing Pinia stores ------- \\
const campaignStore = useCampaignStore();
const userStore = useStore();

// ------- Setting up Player and AI profiles ------- \\
const mePlayer: Player = {
  playerSymbol: Symbol.Circle,
  profileIcon: userStore.user.settings.selectedIcon,
  userID: userStore.user.id,
  socketID: "human",
  timeLeft: 300 * 1000,
  username: userStore.user.username,
};
const me: Ref<Player> = ref(mePlayer);
const aiPlayer: Player = {
  playerSymbol: Symbol.Cross,
  profileIcon: ProfileIcon.godzilla,
  userID: 1,
  socketID: "ai",
  timeLeft: 600 * 1000,
  username: "Fearsome Opponent",
};
const ai: Ref<Player> = ref(aiPlayer);
const currentPlayer = ref(mePlayer);
const amIPlaying = computed(() => {
  return currentPlayer.value.socketID === "human";
});

// ------- Setting up game specific refs ------- \\
const gameState = ref(GameState.Coinflip);
const openingPhase = ref(OpeningPhase.Done);
const turnHistory: Ref<Turn[]> = ref([]);
const winningCombination: Ref<Turn[]> = ref([]);
const endingType = ref(EndingType.Combination);
const messages: Ref<GameChatMessage[]> = ref([]);
const winner = ref(ai);
const settings: GameSettingsIdless = {
  boardSize: 15,
  doesOverlineCount: true,
  hasTimeLimit: true,
  openingType: Opening.Standard,
  winningLineSize: 5,
};
const intervalRef = ref(0);
// ------- Settings up GameBoard from 'gomoku-game' package ------- \\

const gomokuBoard = new GomokuBoard(
  settings.boardSize,
  settings.boardSize,
  settings.winningLineSize,
  !settings.doesOverlineCount
);

// ------- Setting up Game bot ------- \\

const Engine = new Worker(new URL("../worker.js", import.meta.url));
Engine.onmessage = (e) => {
  console.log(gomokuBoard.getBoard());
  console.log("Message from worker:", e.data);
  const x = e.data.bestmove.i;
  const y = e.data.bestmove.j;
  console.log("Turn:", [x, y]);
  gameClick([y, x], true);
};
// ------- Game flow ------- \\
function gameClick(turn: Turn, isComputerPlaying = false) {
  if (
    !gomokuBoard.isPositionEmpty(...turn) ||
    (!isComputerPlaying && !amIPlaying.value) ||
    gameState.value !== GameState.Running
  )
    return;
  clearInterval(intervalRef.value);

  if (amIPlaying.value) {
    gomokuBoard.setStone(turn[0], turn[1], 1);
    currentPlayer.value = ai.value;
    turnHistory.value.push(turn);

    Engine.postMessage([gomokuBoard.getBoard(), "foo", 6000]);
  } else {
    gomokuBoard.setStone(turn[0], turn[1], -1);
    currentPlayer.value = me.value;
    turnHistory.value.push(turn);
  }

  if (gomokuBoard.hasWon(!amIPlaying.value ? 1 : -1, turn[0], turn[1])) {
    winningCombination.value = gomokuBoard.getWinningCombination();
    gameState.value = GameState.Ended;
    EndingType.Combination;
    winner.value = !amIPlaying.value ? me.value : ai.value;
  } else {
    intervalRef.value = setInterval(() => {
      deductTime();
    }, 1000);
  }
}
function sendMessage() {}
function deductTime() {
  if (amIPlaying.value) {
    me.value.timeLeft -= 1000;
  } else {
    ai.value.timeLeft -= 1000;
  }
}

onMounted(() => {
  setTimeout(() => {
    if (gameState.value === GameState.Coinflip)
      gameState.value = GameState.Running;
    intervalRef.value = setInterval(() => {
      deductTime();
    }, 1000);
  }, COIN_SPIN_DURATION);
});
</script>
