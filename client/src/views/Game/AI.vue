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
      :gameType="GameType.AI"
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
const winner = ref(ai.value);
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
  const x = e.data.bestmove.i;
  const y = e.data.bestmove.j;
  gameClick([y, x], true);
};

const engineTimeLimit = () => {
  if (campaignStore.progress < 5) {
    return 200;
  } else if (campaignStore.progress < 9) {
    return 2000;
  } else if (campaignStore.progress < 13) {
    return 6000;
  } else {
    return 20000;
  }
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

    Engine.postMessage([gomokuBoard.getBoard(), "foo", engineTimeLimit()]);
  } else {
    gomokuBoard.setStone(turn[0], turn[1], -1);
    currentPlayer.value = me.value;
    turnHistory.value.push(turn);
  }

  if (gomokuBoard.hasWon(!amIPlaying.value ? 1 : -1, turn[0], turn[1])) {
    winningCombination.value = gomokuBoard.getWinningCombination();
    gameState.value = GameState.Ended;
    endingType.value = EndingType.Combination;
    if (!amIPlaying.value) {
      winner.value = me.value;
      campaignStore.iterate();
    } else {
      winner.value = ai.value;
    }
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
    if (me.value.timeLeft <= 0) {
      gameState.value = GameState.Ended;
      endingType.value = EndingType.Time;
      winner.value = ai.value;
    }
  } else {
    ai.value.timeLeft -= 1000;
    if (ai.value.timeLeft <= 0) {
      gameState.value = GameState.Ended;
      endingType.value = EndingType.Time;
      winner.value = me.value;
    }
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
