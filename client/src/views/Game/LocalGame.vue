<template>
  <TheGameBase
    :me="pOne"
    :opponent="pTwo"
    :currentPlayer="currentPlayer"
    :hasTimeLimit="settings.hasTimeLimit"
    :gameState="gameState"
    :turnHistory="turnHistory"
    :endingType="endingType"
    :winner="winner!"
    :opening="settings.openingType"
    :openingPhase="openingPhase"
    :myColor="userStore.user.settings.playerColor"
    :enemyColor="userStore.user.settings.opponentColor"
    :messages="messages"
    :gameType="GameType.CustomLocal"
    :winningCombination="winningCombination"
    @gameClick="gameClick"
    @pickGameStone="pickGameStone"
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
import { useRoute } from "vue-router";

const userStore = useProfileStore();
const route = useRoute();

// ------- Setting up Player and AI profiles ------- \\
const playerOne: Player = {
  playerSymbol: Symbol.Circle,
  profileIcon: ProfileIcon.defaultBoy,
  userID: undefined,
  socketID: "one",
  timeLeft: Number(route.query.timeLimitInSeconds) * 1000,
  username: "PlayerOne",
};
const playerTwo: Player = {
  playerSymbol: Symbol.Cross,
  profileIcon: ProfileIcon.defaultBoy,
  userID: undefined,
  socketID: "two",
  timeLeft: Number(route.query.timeLimitInSeconds) * 1000,
  username: "PlayerTwo",
};
const pOne = ref(playerOne);
const pTwo = ref(playerTwo);
const currentPlayer = ref(playerOne);

// ------- Setting up game specific refs ------- \\
const gameState = ref(GameState.Coinflip);
const openingPhase = ref(
  route.query.openingType === "SWAP1" ? OpeningPhase.Place3 : OpeningPhase.Done
);
const turnHistory: Ref<Turn[]> = ref([]);
const winningCombination: Ref<Turn[]> = ref([]);
const endingType = ref(EndingType.Combination);
const messages: Ref<GameChatMessage[]> = ref([]);
const winner: Ref<undefined | Player> = ref(undefined);
const settings: GameSettingsIdless = {
  boardSize: 15,
  doesOverlineCount: true,
  hasTimeLimit: route.query.timeLimitInSeconds !== "0",
  openingType: route.query.openingType as Opening,
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

function pickGameStone(gameStone: Symbol) {
  clearInterval(intervalRef.value);
  if (gameStone === Symbol.Cross) {
    pOne.value.playerSymbol = Symbol.Circle;
    pTwo.value.playerSymbol = Symbol.Cross;
    currentPlayer.value = playerTwo;
  } else {
    pOne.value.playerSymbol = Symbol.Cross;
    pTwo.value.playerSymbol = Symbol.Circle;
    currentPlayer.value = playerOne;
  }
  openingPhase.value = OpeningPhase.Done;
  intervalRef.value = setInterval(() => {
    deductTime();
  }, 1000);
}

// ------- Game flow ------- \\
function gameClick(turn: Turn) {
  if (
    !gomokuBoard.isPositionEmpty(...turn) ||
    gameState.value !== GameState.Running ||
    openingPhase.value === OpeningPhase.PickGameStone
  ) {
    return;
  }

  clearInterval(intervalRef.value);

  if (currentPlayer.value.socketID === pOne.value.socketID) {
    gomokuBoard.setStone(
      turn[0],
      turn[1],
      turnHistory.value.length % 2 === 0 ? 1 : -1
    );
    if (
      !(
        openingPhase.value === OpeningPhase.Place3 &&
        turnHistory.value.length < 2
      )
    ) {
      currentPlayer.value = playerTwo;
    }
  } else {
    gomokuBoard.setStone(
      turn[0],
      turn[1],
      turnHistory.value.length % 2 === 0 ? 1 : -1
    );
    if (
      !(
        openingPhase.value === OpeningPhase.Place3 &&
        turnHistory.value.length < 2
      )
    ) {
      currentPlayer.value = playerOne;
    }
  }

  turnHistory.value.push(turn);

  if (
    turnHistory.value.length === 3 &&
    openingPhase.value === OpeningPhase.Place3
  ) {
    openingPhase.value = OpeningPhase.PickGameStone;
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
    if (settings.hasTimeLimit) {
      intervalRef.value = setInterval(() => {
        deductTime();
      }, 1000);
    }
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
    if (settings.hasTimeLimit) {
      intervalRef.value = setInterval(() => {
        deductTime();
      }, 1000);
    }
  }, COIN_SPIN_DURATION);
});
</script>
