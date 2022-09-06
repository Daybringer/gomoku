<template>
  <GameBase
    :round="round"
    :hasTimeLimit="hasTimeLimit"
    :gameState="gameState"
    :gameEnding="gameEnding"
    :lastPositionID="lastPositionID"
    :myUserID="me.userID"
    :myIconName="me.profileIcon"
    :myLogged="me.logged"
    :myTime="me.timeLeft"
    :myNickname="me?.username"
    :myColor="store.user.playerColor"
    :amIStartingPlayer="amIStartingPlayer"
    :enemyLogged="enemy.logged"
    :enemyIconName="enemy.profileIcon"
    :enemyUserID="enemy.userID"
    :enemyTime="enemy.timeLeft"
    :enemyColor="store.user.enemyColor"
    :enemyNickname="enemy.username"
    :messages="messages"
    @gameClick="gameClick"
    @sendMessage="sendMessage"
  />
</template>
<script lang="ts">
// Types
import { GameState, Ending } from "@/types";
import { COIN_SPIN_DURATION } from "@/shared/constants";
// Backend-frontend shared types
import { Position, GameType, Player } from "@/shared/types";
import {
  GameClickDTO,
  GameEndedByCombinationDTO,
  GameEndedByDisconnectDTO,
  GameEndedByTimeoutDTO,
  GameStartedEventDTO,
  JoinGameDTO,
  SocketIOEvents,
  StonePlacedDTO,
  TimeCalibrationDTO,
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
    socketID: "a",
    userID: 0,
    logged: false,
    profileIcon: ProfileIcon.defaultBoy,
    username: "-",
    timeLeft: 120000,
  };
};

export default defineComponent({
  name: "Game",
  components: { GameBase },
  data(): {
    hasTimeLimit: boolean;
    amIStartingPlayer: boolean;
    me: Player;
    enemy: Player;
    chatInput: string;
    lastPositionID: number;
    round: number;
    gameState: GameState;
    gameEnding: Ending;
    messages: Array<Record<string, string>>;
    boardSize: number;
  } {
    return {
      me: basePlayer(),
      enemy: basePlayer(),
      hasTimeLimit: false,
      amIStartingPlayer: true,
      chatInput: "",
      lastPositionID: 0,
      round: 0,
      gameState: GameState.Waiting,
      gameEnding: Ending.None,
      messages: [] as Array<Record<string, string>>,
      boardSize: 15,
    };
  },
  setup() {
    const store = useStore();

    return { store };
  },
  methods: {
    /**
     * Forwards click event from GameBase component to game server
     */
    gameClick(position: Position): void {
      const gameClickDTO: GameClickDTO = {
        roomID: this.getRoomIDFromURL || "",
        position: position,
      };
      socket.emit(SocketIOEvents.GameClick, gameClickDTO);
    },
    /**
     *
     */
    sendMessage(message: string) {
      const messageObj = { author: "me", text: message };
      this.messages.push(messageObj);
      socket.emit(SocketIOEvents.SendMessage, message);
    },
  },
  async mounted() {
    socket = io("/game", { port: "3001" });
    const logged = this.store.isAuthenticated;

    if (
      this.getGameTypeFromURL === GameType.Quick ||
      this.getGameTypeFromURL === GameType.Ranked ||
      this.getGameTypeFromURL === GameType.Custom
    ) {
      const joinGameDTO: JoinGameDTO = {
        roomID: this.getRoomIDFromURL || "",
        logged,
        userID: this.store.user.id,
      };
      socket.emit(SocketIOEvents.JoinGame, joinGameDTO);
    } else {
      this.$router.push("/");
    }

    socket.on(SocketIOEvents.InvalidRoomID, () => {
      // TODO show some notification
      this.$router.push("/");
    });

    // Game has begun
    socket.on(
      SocketIOEvents.GameStarted,
      (gameStartedEventDTO: GameStartedEventDTO) => {
        this.amIStartingPlayer =
          socket.id === gameStartedEventDTO.startingPlayerSocketID;

        this.hasTimeLimit = gameStartedEventDTO.hasTimeLimit;

        const [foo, bar] = gameStartedEventDTO.players;
        if (foo.socketID === socket.id) {
          this.me = foo;
          this.enemy = bar;
        } else {
          this.me = bar;
          this.enemy = foo;
        }

        this.gameState = GameState.Coinflip;

        // FIXME magic numbers (200)
        setTimeout(() => {
          if (this.gameState === GameState.Coinflip) {
            this.gameState = GameState.Running;
          }
        }, COIN_SPIN_DURATION - 200);
      }
    );

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

    // New message
    socket.on(SocketIOEvents.RecieveMessage, (message) => {
      this.messages.push({ author: "opponent", text: message });
    });

    // Player made a successful move
    socket.on(SocketIOEvents.StonePlaced, (stonePlacedDTO: StonePlacedDTO) => {
      const { position, players } = stonePlacedDTO;

      this.round++;
      // FIXME wtf is this
      this.lastPositionID = position[1] * this.boardSize + position[0];
    });

    // Different game endings
    socket.on(
      SocketIOEvents.GameEndedByDisconnect,
      (gameEndedByDisconnectDTO: GameEndedByDisconnectDTO) => {
        // I have been disconnected
        if (socket.id !== gameEndedByDisconnectDTO.winner.socketID) {
          this.gameState = GameState.Ended;
          this.gameEnding = Ending.DefeatDisconnect;
          // Enemy has been disconnected
        } else {
          this.gameState = GameState.Ended;
          this.gameEnding = Ending.VictoryDisconnect;
        }
      }
    );

    socket.on(
      SocketIOEvents.GameEndedByCombination,
      (gameEndedByCombinationDTO: GameEndedByCombinationDTO) => {
        this.gameState = GameState.Ended;
        this.gameEnding =
          gameEndedByCombinationDTO.winner.socketID === socket.id
            ? Ending.VictoryFiveInRow
            : Ending.DefeatFiveInRow;
      }
    );

    socket.on(
      SocketIOEvents.GameEndedByTimeout,
      (gameEndedByTimeoutDTO: GameEndedByTimeoutDTO) => {
        // I have timed out
        if (socket.id !== gameEndedByTimeoutDTO.winner.socketID) {
          this.gameState = GameState.Ended;
          this.gameEnding = Ending.DefeatTimeout;
          // Enemy has timed out
        } else {
          this.gameState = GameState.Ended;
          this.gameEnding = Ending.VictoryTimeout;
        }
      }
    );
  },
  computed: {
    getURLParams() {
      return new URLSearchParams(window.location.search);
    },
    getGameTypeFromURL(): string | null {
      return this.getURLParams.get("type");
    },
    getRoomIDFromURL(): string | null {
      return this.getURLParams.get("roomID");
    },
  },
  beforeUnmount() {
    socket.close();
  },
});
</script>
