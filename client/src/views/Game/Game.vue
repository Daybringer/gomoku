<template>
  <GameBase
    :me="me"
    :enemy="enemy"
    :eloGain="100"
    :currentPlayer="currentPlayer"
    :round="round"
    :hasTimeLimit="hasTimeLimit"
    :gameState="gameState"
    :turnHistory="turnHistory"
    :endingType="endingType"
    :winner="winner"
    :opening="opening"
    :openingPhase="openingPhase"
    :myColor="store.user.settings.playerColor"
    :enemyColor="store.user.settings.opponentColor"
    :messages="messages"
    :gameType="getGameTypeFromURL"
    :askingForRematch="askingForRematch"
    :winningCombination="winningCombination"
    @gameClick="gameClick"
    @sendMessage="sendMessage"
    @pickGameStone="pickGameStone"
    @rematchCustom="rematchCustom"
  />
</template>
<script lang="ts">
// Types
import { GameState } from "@/utils/types.dt";
import { COIN_SPIN_DURATION } from "@/shared/constants";
// Backend-frontend shared types
import {
  Position,
  GameType,
  Player,
  Symbol,
  Opening,
  OpeningPhase,
  EndingType,
  Turn,
} from "@/shared/types";
import {
  AskForRematchDTO,
  CreateCustomDTO,
  GameClickDTO,
  GameEndedDTO,
  GameStartedEventDTO,
  JoinGameDTO,
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
import { defineComponent } from "vue";
import { io, Socket } from "socket.io-client";
import { ProfileIcon } from "@/shared/icons";
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

export type Message = Record<string, string>;

export default defineComponent({
  name: "Game",
  components: { GameBase },
  data(): {
    hasTimeLimit: boolean;
    me: Player;
    enemy: Player;
    currentPlayer: Player;
    chatInput: string;
    round: number;
    gameState: GameState;
    endingType: EndingType;
    winner: Player;
    turnHistory: Turn[];
    messages: Array<Message>;
    boardSize: number;
    openingPhase: OpeningPhase;
    opening: Opening;
    askingForRematch: number;
    winningCombination: Array<Position>;
  } {
    return {
      me: basePlayer(),
      enemy: basePlayer(),
      hasTimeLimit: false,
      currentPlayer: basePlayer(),
      turnHistory: [],
      chatInput: "",
      round: 0,
      gameState: GameState.Waiting,
      endingType: EndingType.Tie,
      winner: basePlayer(),
      messages: [],
      boardSize: 15,
      openingPhase: OpeningPhase.Done,
      opening: Opening.Standard,
      askingForRematch: 0,
      winningCombination: [],
    };
  },
  setup() {
    const store = useStore();

    return { store };
  },
  methods: {
    gameClick(position: Position): void {
      if (this.currentPlayer.socketID === this.me.socketID) {
        const gameClickDTO: GameClickDTO = {
          roomID: this.getRoomIDFromURL || "",
          position: position,
        };
        socket.emit(SocketIOEvents.GameClick, gameClickDTO);
      }
    },
    sendMessage(message: string) {
      const messageObj = { author: "me", text: message };
      this.messages.push(messageObj);
      socket.emit(SocketIOEvents.SendMessage, message);
    },
    pickGameStone(gameStone: Symbol) {
      const dto: ToServerSwapPickGameStoneDTO = {
        roomID: this.getRoomIDFromURL as string,
        pickedSymbol: gameStone,
      };
      socket.emit(SocketIOEvents.ToServerSwapPickGameStone, dto);
    },
    rematchCustom() {
      const askForRematchDTO: AskForRematchDTO = {
        oldRoomID: this.roomID,
        createCustomDTO: this.constructSettingsDTO,
      };
      socket.emit(SocketIOEvents.AskForRematch, askForRematchDTO);
    },
  },
  async mounted() {
    socket = io("/game", { port: "3001" });
    const logged = this.store.isAuthenticated;

    if (!this.getGameTypeFromURL) this.$router.push("/");

    const joinGameDTO: JoinGameDTO = {
      roomID: this.getRoomIDFromURL || "",
      userID: logged ? this.store.user.id : undefined,
    };
    socket.emit(SocketIOEvents.JoinGame, joinGameDTO);

    socket.on(SocketIOEvents.InvalidRoomID, () => {
      // TODO show some notification
      this.$router.push("/");
    });

    socket.on(SocketIOEvents.GameStarted, (dto: GameStartedEventDTO) => {
      console.log("GAME STARTED");
      const { hasTimeLimit, startingPlayer, players, opening } = dto;
      this.currentPlayer = startingPlayer;
      this.hasTimeLimit = hasTimeLimit;

      this.opening = opening;
      if (opening === Opening.Standard) {
        this.openingPhase = OpeningPhase.Done;
      } else {
        this.openingPhase = OpeningPhase.Place3;
      }

      const [foo, bar] = players;
      if (foo.socketID === socket.id) {
        this.me = foo;
        this.enemy = bar;
      } else {
        this.me = bar;
        this.enemy = foo;
      }

      this.gameState = GameState.Coinflip;

      setTimeout(() => {
        if (this.gameState === GameState.Coinflip) {
          this.gameState = GameState.Running;
        }
      }, COIN_SPIN_DURATION);
    });

    socket.on(
      SocketIOEvents.TimeCalibration,
      (timeCalibrationDTO: TimeCalibrationDTO) => {
        const [foo, bar] = timeCalibrationDTO.players;
        if (foo.socketID === socket.id) {
          this.me.timeLeft = foo.timeLeft;
          this.enemy.timeLeft = bar.timeLeft;
        } else {
          this.me.timeLeft = bar.timeLeft;
          this.enemy.timeLeft = foo.timeLeft;
        }
      }
    );

    socket.on(SocketIOEvents.RecieveMessage, (message: string) => {
      this.messages.push({ author: "opponent", text: message });
    });

    socket.on(
      SocketIOEvents.RedirectToCustomRematch,
      (newGameRoomID: string) => {
        const dto = this.constructSettingsDTO;
        this.$router.push(
          `/game?type=custom&roomID=${newGameRoomID}&hasTimeLimit=${dto.hasTimeLimit}&timeLimitInSeconds=${dto.timeLimitInSeconds}&opening=${dto.opening}`
        );
      }
    );

    socket.on(
      SocketIOEvents.ToClientSwapPickGameStone,
      (dto: ToClientSwapPickGameStoneDTO) => {
        this.currentPlayer = dto.pickingPlayer;
        this.openingPhase = OpeningPhase.PickGameStone;
      }
    );

    socket.on(
      SocketIOEvents.SwapGameStonePicked,
      (dto: SwapGameStonePickedDTO) => {
        const { currentPlayer, players } = dto;
        const [foo, bar] = players;
        if (foo.socketID === socket.id) {
          this.me = foo;
          this.enemy = bar;
        } else {
          this.enemy = foo;
          this.me = bar;
        }

        this.currentPlayer = currentPlayer;
        this.openingPhase = OpeningPhase.Done;
      }
    );

    socket.on(SocketIOEvents.StonePlaced, (stonePlacedDTO: StonePlacedDTO) => {
      const { position, currentPlayer } = stonePlacedDTO;
      this.currentPlayer = currentPlayer;
      this.round++;
      this.turnHistory.push(position);
    });

    socket.on(SocketIOEvents.GameEnded, (dto: GameEndedDTO) => {
      const { endingType, winner, userIDToEloDiff, winningCombination } = dto;

      if (winner) this.winner = winner;
      if (winningCombination) this.winningCombination = winningCombination;

      this.endingType = endingType;
      this.gameState = GameState.Ended;
    });
  },
  computed: {
    getURLParams() {
      return new URLSearchParams(window.location.search);
    },
    getGameTypeFromURL(): GameType {
      const type = this.getURLParams.get("type");
      if (type == GameType.Quick) {
        return GameType.Quick;
      } else if (type == GameType.Ranked) {
        return GameType.Ranked;
      } else if (type == GameType.Custom) {
        return GameType.Custom;
      }
      return GameType.Quick;
    },
    getRoomIDFromURL(): string | null {
      return this.getURLParams.get("roomID");
    },
    roomID(): string {
      return this.getURLParams.get("roomID") as string;
    },
    hasTimeLimit(): boolean {
      return this.getURLParams.get("hasTimeLimit") === "true";
    },
    timeLimitInSeconds(): number {
      return Number(this.getURLParams.get("timeLimitInSeconds"));
    },
    constructSettingsDTO(): CreateCustomDTO {
      return {
        hasTimeLimit: this.hasTimeLimit,
        timeLimitInSeconds: this.timeLimitInSeconds,
        opening: this.opening,
      };
    },
    opening(): Opening {
      return this.getURLParams.get("opening") as Opening;
    },
  },
  beforeUnmount() {
    socket.close();
  },
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
