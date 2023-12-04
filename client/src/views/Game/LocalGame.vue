<template>
  <TheGameBase
    :me="pOne"
    :opponent="pTwo"
    :currentPlayer="currentPlayer"
    :hasTimeLimit="settings.hasTimeLimit"
    :gameState="gameState"
    :turnHistory="turnHistory"
    :endingType="endingType"
    :winner="winner"
    :opening="settings.openingType"
    :openingPhase="openingPhase"
    :myColor="userStore.user.settings.playerColor"
    :enemyColor="userStore.user.settings.opponentColor"
    :messages="messages"
    :gameType="GameType.CustomLocal"
    :winningCombination="winningCombination"
    @gameClick="gameClick"
    @sendMessage="() => {}" />
</template>
<script setup lang="ts">
import TheGameBase from "@/components/TheGameBase.vue";
import { useProfileStore } from "@/store/profile";
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
import { ProfileIcon } from "@/shared/icons";
import { GomokuBoard } from "gomoku-game";
import { GameSettingsIdless } from "@/shared/interfaces/gameSettings.interface";
import { COIN_SPIN_DURATION } from "@/shared/constants";

const userStore = useProfileStore();

// ------- Setting up Player and AI profiles ------- \\
const playerOne: Player = {
  playerSymbol: Symbol.Circle,
  profileIcon: ProfileIcon.defaultBoy,
  userID: undefined,
  socketID: "one",
  timeLeft: 300 * 1000,
  username: "PlayerOne",
};
const playerTwo: Player = {
  playerSymbol: Symbol.Cross,
  profileIcon: ProfileIcon.defaultBoy,
  userID: undefined,
  socketID: "two",
  timeLeft: 300 * 1000,
  username: "PlayerTwo",
};
const pOne = ref(playerOne);
const pTwo = ref(playerTwo);
const currentPlayer = ref(playerOne);

// ------- Setting up game specific refs ------- \\
const gameState = ref(GameState.Coinflip);
const openingPhase = ref(OpeningPhase.Done);
const turnHistory: Ref<Turn[]> = ref([]);
const winningCombination: Ref<Turn[]> = ref([]);
const endingType = ref(EndingType.Combination);
const messages: Ref<GameChatMessage[]> = ref([]);
const winner = ref(pOne);
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

// ------- Game flow ------- \\
function gameClick(turn: Turn) {
  if (
    !gomokuBoard.isPositionEmpty(...turn) ||
    gameState.value !== GameState.Running
  ) {
    return;
  }

  console.log(pOne.value, pTwo.value);

  clearInterval(intervalRef.value);

  if (currentPlayer.value.socketID === pOne.value.socketID) {
    gomokuBoard.setStone(
      turn[0],
      turn[1],
      playerOne.playerSymbol === Symbol.Circle ? 1 : -1
    );
    currentPlayer.value = playerTwo;
    turnHistory.value.push(turn);
  } else {
    gomokuBoard.setStone(
      turn[0],
      turn[1],
      playerTwo.playerSymbol === Symbol.Circle ? 1 : -1
    );
    currentPlayer.value = playerOne;
    turnHistory.value.push(turn);
  }

  if (
    gomokuBoard.hasWon(
      currentPlayer.value.playerSymbol === Symbol.Cross ? 1 : -1,
      turn[0],
      turn[1]
    )
  ) {
    winningCombination.value = gomokuBoard.getWinningCombination();
    gameState.value = GameState.Ended;
    endingType.value = EndingType.Combination;

    if (currentPlayer.value.socketID === pOne.value.socketID) {
      winner.value = playerTwo;
    } else {
      winner.value = playerOne;
    }
  } else {
    intervalRef.value = setInterval(() => {
      deductTime();
    }, 1000);
  }
}

function deductTime() {
  if (currentPlayer.value.socketID === pOne.value.socketID) {
    pOne.value.timeLeft -= 1000;
    if (pOne.value.timeLeft <= 0) {
      gameState.value = GameState.Ended;
      endingType.value = EndingType.Time;
      winner.value = pTwo.value;
      clearInterval(intervalRef.value);
    }
  } else {
    pTwo.value.timeLeft -= 1000;
    if (pTwo.value.timeLeft <= 0) {
      gameState.value = GameState.Ended;
      endingType.value = EndingType.Time;
      winner.value = pOne.value;
      clearInterval(intervalRef.value);
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
