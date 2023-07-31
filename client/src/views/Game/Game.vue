<template>
  <GameBase
    :me="me"
    :opponent="opponent"
    :eloGain="100"
    :currentPlayer="currentPlayer"
    :hasTimeLimit="settings.hasTimeLimit"
    :gameState="gameState"
    :turnHistory="turnHistory"
    :endingType="endingType"
    :winner="winner"
    :opening="settings.openingType"
    :openingPhase="openingPhase"
    :myColor="store.user.settings.playerColor"
    :enemyColor="store.user.settings.opponentColor"
    :messages="messages"
    :gameType="gameType"
    :winningCombination="winningCombination"
    :rematchWaitingRoomID="rematchWaitingRoomID"
    @gameClick="gameClick"
    @sendMessage="sendMessage"
    @pickGameStone="pickGameStone"
    @rematchCustom="rematchCustom"
  />
</template>
<script setup lang="ts">
// Types
import { GameState } from "@/utils/types.dt";
import { COIN_SPIN_DURATION } from "@/shared/constants";
// Backend-frontend shared types
import {
  Position,
  GameType,
  Player,
  Opening,
  OpeningPhase,
  EndingType,
  Turn,
  GameChatMessage,
  Symbol,
} from "@/shared/types";
import {
  AskForRematchDTO,
  CreateCustomDTO,
  GameClickDTO,
  GameEndedDTO,
  GameStartedEventDTO,
  JoinGameDTO,
  RedirectToCustomRematchDTO,
  SendMessageDTO,
  SocketIOEvents,
  StonePlacedDTO,
  SwapGameStonePickedDTO,
  TimeCalibrationDTO,
  ToClientSwapPickGameStoneDTO,
  ToServerSwapPickGameStoneDTO,
} from "@/shared/socketIO";

// SocketIO
let socket: Socket;
// Components
import GameBase from "@/components/TheGameBase.vue";
// Pinia
import { useStore } from "@/store/store";
// Utils
import { computed, ref, Ref, onUnmounted, onMounted } from "vue";
import { io, Socket } from "socket.io-client";
import { ProfileIcon } from "@/shared/icons";
import router from "@/router";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import {
  GameSettings,
  GameSettingsIdless,
} from "@/shared/interfaces/gameSettings.interface";
const basePlayer = (): Player => {
  return {
    socketID: "",
    userID: undefined,
    profileIcon: ProfileIcon.defaultBoy,
    username: "-",
    timeLeft: 120000,
    playerSymbol: 0,
  };
};

const me = ref(basePlayer());
const opponent = ref(basePlayer());
const currentPlayer = ref(basePlayer());
const winner = ref(basePlayer());
const eloDiff = ref(0);
const messages: Ref<GameChatMessage[]> = ref([]);
const turnHistory: Ref<Turn[]> = ref([]);
const winningCombination: Ref<Turn[]> = ref([]);
const gameState = ref(GameState.Waiting);
const endingType = ref(EndingType.Combination);
const openingPhase = ref(OpeningPhase.Done);
const rematchWaitingRoomID: Ref<undefined | string> = ref(undefined);
const settings: Ref<GameSettingsIdless> = ref({
  boardSize: 15,
  doesOverlineCount: true,
  hasTimeLimit: true,
  openingType: Opening.Standard,
  winningLineSize: 5,
  timeLimitInSeconds: 120,
});

const store = useStore();
const notificationStore = useNotificationsStore();

function gameClick(position: Position): void {
  if (currentPlayer.value.socketID === me.value.socketID) {
    const gameClickDTO: GameClickDTO = {
      roomID: roomID.value || "",
      position: position,
    };
    socket.emit(SocketIOEvents.GameClick, gameClickDTO);
  }
}
function sendMessage(message: string) {
  const messageObj: GameChatMessage = { author: "me", message };
  messages.value.push(messageObj);
  const dto: SendMessageDTO = { message, roomID: roomID.value || "" };
  socket.emit(SocketIOEvents.SendMessage, dto);
}
function pickGameStone(gameStone: Symbol) {
  const dto: ToServerSwapPickGameStoneDTO = {
    roomID: roomID.value || "",
    pickedSymbol: gameStone,
  };
  socket.emit(SocketIOEvents.ToServerSwapPickGameStone, dto);
}

function rematchCustom() {
  const askForRematchDTO: AskForRematchDTO = {
    oldRoomID: roomID.value || "",
    settings: settings.value,
  };
  socket.emit(SocketIOEvents.AskForRematch, askForRematchDTO);
}

onMounted(() => {
  socket = io("/game", { port: "3001" });
  if (!gameType.value) router.push("/");

  const joinGameDTO: JoinGameDTO = {
    roomID: roomID.value || "",
    userID: isLogged.value ? store.user.id : undefined,
  };
  socket.emit(SocketIOEvents.JoinGame, joinGameDTO);

  // ------- SOCKET.IO HANDLERS ------- \\

  socket.on(SocketIOEvents.InvalidRoomID, () => {
    notificationStore.createNotification(
      NotificationType.Error,
      "Invalid game room ID"
    );
    router.push("/");
  });

  socket.on(SocketIOEvents.GameStarted, (dto: GameStartedEventDTO) => {
    const { startingPlayer, players, gameSettings } = dto;
    currentPlayer.value = startingPlayer;
    settings.value = gameSettings;

    if (settings.value.openingType !== Opening.Standard)
      openingPhase.value = OpeningPhase.Place3;

    if (players[0].socketID === socket.id) {
      me.value = players[0];
      opponent.value = players[1];
    } else {
      me.value = players[1];
      opponent.value = players[0];
    }
    gameState.value = GameState.Coinflip;

    setTimeout(() => {
      if (gameState.value === GameState.Coinflip)
        gameState.value = GameState.Running;
    }, COIN_SPIN_DURATION);
  });

  socket.on(SocketIOEvents.TimeCalibration, (dto: TimeCalibrationDTO) => {
    const [foo, bar] = dto.players;
    if (foo.socketID === socket.id) {
      me.value.timeLeft = foo.timeLeft;
      opponent.value.timeLeft = bar.timeLeft;
    } else {
      me.value.timeLeft = bar.timeLeft;
      opponent.value.timeLeft = foo.timeLeft;
    }
  });

  socket.on(SocketIOEvents.RecieveMessage, (message: string) => {
    messages.value.push({ author: "opponent", message });
  });

  socket.on(
    SocketIOEvents.RedirectToCustomRematch,
    (dto: RedirectToCustomRematchDTO) => {
      if (socket.id === dto.askeeSocketID) {
        router.push(`/custom/${dto.waitingRoomID}`);
      } else {
        rematchWaitingRoomID.value = dto.waitingRoomID;
      }
    }
  );

  // ------- SWAP HANDLES ------- \\

  socket.on(
    SocketIOEvents.ToClientSwapPickGameStone,
    (dto: ToClientSwapPickGameStoneDTO) => {
      currentPlayer.value = dto.pickingPlayer;
      openingPhase.value = OpeningPhase.PickGameStone;
    }
  );

  socket.on(
    SocketIOEvents.SwapGameStonePicked,
    (dto: SwapGameStonePickedDTO) => {
      const { players } = dto;
      if (players[0].socketID === socket.id) {
        me.value = players[0];
        opponent.value = players[1];
      } else {
        me.value = players[1];
        opponent.value = players[0];
      }
      currentPlayer.value = dto.currentPlayer;
      openingPhase.value = OpeningPhase.Done;
    }
  );

  socket.on(SocketIOEvents.StonePlaced, (dto: StonePlacedDTO) => {
    currentPlayer.value = dto.currentPlayer;
    turnHistory.value.push(dto.position);
  });

  socket.on(SocketIOEvents.GameEnded, (dto: GameEndedDTO) => {
    if (dto.winner) winner.value = dto.winner;
    if (dto.winningCombination)
      winningCombination.value = dto.winningCombination;
    if (dto.userIDToEloDiff)
      eloDiff.value = dto.userIDToEloDiff[me.value.socketID];

    endingType.value = dto.endingType;
    gameState.value = GameState.Ended;
  });
});

function getURLParams() {
  return new URLSearchParams(window.location.search);
}
const isLogged = computed(() => store.isAuthenticated);
const gameType = computed(() => {
  const type = getURLParams().get("type");
  if (type == GameType.Quick) {
    return GameType.Quick;
  } else if (type == GameType.Ranked) {
    return GameType.Ranked;
  } else if (type == GameType.Custom) {
    return GameType.Custom;
  }
  return GameType.Quick;
});

const roomID = computed(() => {
  return getURLParams().get("roomID");
});

onUnmounted(() => {
  socket.close();
});
</script>
<style>
.bounce-enter-active {
  animation: bounce-in 0.4s ease-out !important;
  animation-fill-mode: forwards;
}
.bounce-leave-active {
  animation: bounce-in 0.4s reverse ease-out !important;
  animation-fill-mode: forwards;
}

.sad-animation {
  animation: down 3s infinite;
  animation-delay: 0.4s;
}

@keyframes down {
  0%,
  100% {
    transform: translateY(15%);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
.animation-bounce {
  animation: bounce 1s infinite;
  animation-delay: 0.4s;
}
@keyframes bounce {
  0%,
  100% {
    transform: translateY(-15%) rotate(10deg);
    animation-timing-function: cubic-bezier(0.8, 0, 1, 1);
  }
  50% {
    transform: translateY(0);
    animation-timing-function: cubic-bezier(0, 0, 0.2, 1);
  }
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0%;
  }
  100% {
    transform: scale(1);
    opacity: 100%;
  }
}
</style>
