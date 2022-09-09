<template>
  <GameBase
    :me="me"
    :enemy="enemy"
    :currentPlayer="currentPlayer"
    :round="round"
    :hasTimeLimit="hasTimeLimit"
    :gameState="gameState"
    :gameEnding="gameEnding"
    :opening="opening"
    :openingPhase="openingPhase"
    :lastPositionID="lastPositionID"
    :myColor="store.user.playerColor"
    :enemyColor="store.user.enemyColor"
    :messages="messages"
    @gameClick="gameClick"
    @sendMessage="sendMessage"
    @pickGameStone="pickGameStone"
  />
</template>
<script lang="ts">
// Types
import { GameState, Ending } from "@/types";
import { COIN_SPIN_DURATION } from "@/shared/constants";
// Backend-frontend shared types
import {
  Position,
  GameType,
  Player,
  Symbol,
  Opening,
  OpeningPhase,
} from "@/shared/types";
import {
  GameClickDTO,
  GameEndedByCombinationDTO,
  GameEndedByDisconnectDTO,
  GameEndedByTimeoutDTO,
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
    socketID: "a",
    userID: 0,
    logged: false,
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
    lastPositionID: number;
    round: number;
    gameState: GameState;
    gameEnding: Ending;
    messages: Array<Message>;
    boardSize: number;
    openingPhase: OpeningPhase;
    opening: Opening;
  } {
    return {
      me: basePlayer(),
      enemy: basePlayer(),
      hasTimeLimit: false,
      currentPlayer: basePlayer(),
      chatInput: "",
      lastPositionID: 0,
      round: 0,
      gameState: GameState.Waiting,
      gameEnding: Ending.None,
      messages: [],
      boardSize: 15,
      openingPhase: OpeningPhase.Done,
      opening: Opening.Standard,
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

    /** */
    pickGameStone(gameStone: Symbol) {
      const dto: ToServerSwapPickGameStoneDTO = {
        roomID: this.getRoomIDFromURL as string,
        pickedSymbol: gameStone,
      };
      socket.emit(SocketIOEvents.ToServerSwapPickGameStone, dto);
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
        const {
          hasTimeLimit,
          startingPlayer,
          players,
          opening,
        } = gameStartedEventDTO;
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

    // Player made a successful move
    socket.on(SocketIOEvents.StonePlaced, (stonePlacedDTO: StonePlacedDTO) => {
      const { position, currentPlayer } = stonePlacedDTO;
      this.currentPlayer = currentPlayer;
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
