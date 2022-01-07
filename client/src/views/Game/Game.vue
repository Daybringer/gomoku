<template>
  <GameBase
    :round="round"
    :gameState="gameState"
    :gameEnding="gameEnding"
    :lastPositionID="lastPositionID"
    :myTime="me.time"
    :myNickname="me.nickname"
    :myColor="me.color"
    :amIStartingPlayer="amIStartingPlayer"
    :enemyTime="opponent.time"
    :enemyColor="opponent.color"
    :enemyNickname="opponent.nickname"
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
import { position, GameClickDTO, GameEvents, GameType } from "@/shared/types";

// SocketIO
import io from "socket.io-client";
let socket: any;
// Components
import GameBase from "@/components/GameBase.vue";
// Pinia
import { useStore } from "@/store/store";
// Utils
import { defineComponent } from "vue";

export default defineComponent({
  name: "Game",
  components: { GameBase },
  data() {
    return {
      amIStartingPlayer: true,
      me: {
        nickname: "-",
        time: 0,
        color: "",
      },
      opponent: {
        nickname: "-",
        time: 0,
        color: "",
      },
      chatInput: "",
      lastPositionID: 0,
      round: 0,
      gameState: GameState.Waiting,
      gameEnding: Ending.None,
      messages: [] as Array<Record<string, string>>,
      boardSize: 15,
    };
  },
  methods: {
    /**
     * Forwards click event from GameBase component to game server
     */
    gameClick(position: position): void {
      const gameClickDTO: GameClickDTO = {
        roomID: this.getRoomIDFromURL || "",
        position: position,
      };
      socket.emit(GameEvents.GameClick, gameClickDTO);
    },
    /**
     *
     */
    sendMessage(message: string) {
      const messageObj = { author: "me", text: message };
      this.messages.push(messageObj);
      socket.emit(GameEvents.SendMessage, message);
    },
  },
  mounted() {
    socket = io("/game/quick", { port: "3001" });
    // initalizing Pinia store
    const store = useStore();

    const userProfile = store.getUserProfile;

    this.me.nickname = userProfile.username;
    this.me.color = userProfile.myColor;
    this.opponent.color = userProfile.enemyColor;

    if (this.getGameTypeFromURL === GameType.Quick) {
      socket.emit(GameEvents.JoinGame, {
        roomID: this.getRoomIDFromURL,
        logged: this.me.nickname ? true : false,
        username: this.me.nickname,
      });
    } else {
      // TODO implement ranked,customs, etc.
      this.$router.push("/");
    }

    socket.on(GameEvents.InvalidRoomID, () => {
      // TODO show some notification
      this.$router.push("/");
    });

    // Game has begun
    socket.on(GameEvents.GameStarted, (gameInfo) => {
      this.gameState = GameState.Coinflip;
      this.me.time = this.opponent.time = gameInfo.timeLimitInSeconds;
      setTimeout(() => {
        if (this.gameState === GameState.Coinflip) {
          this.gameState = GameState.Running;
        }
      }, COIN_SPIN_DURATION - 200);

      this.amIStartingPlayer = socket.id === gameInfo.startingPlayer.socketID;
      this.me.nickname = "This is me";
      this.opponent.nickname = "This is enemy";
    });

    socket.on(
      GameEvents.TimeCalibration,
      (socketTimeDict: Record<string, number>) => {
        for (const socketID in socketTimeDict) {
          //FIXME this scenario only works with exactly two socket IDs in the dict
          // socketID is mine
          if (socketID == socket.id) {
            this.me.time = socketTimeDict[socketID];
          } else {
            this.opponent.time = socketTimeDict[socketID];
          }
        }
      }
    );

    // New message

    socket.on(GameEvents.RecieveMessage, (message) => {
      this.messages.push({ author: "opponent", text: message });
    });

    // Player made a move
    socket.on(GameEvents.StonePlaced, (data) => {
      const { position, times } = data;

      this.round++;
      this.lastPositionID = position[1] * this.boardSize + position[0];

      for (const socketID in times) {
        //FIXME this scenario only works with exactly two socket IDs in the dict
        // socketID is mine
        if (socketID == socket.id) {
          this.me.time = times[socketID];
        } else {
          this.opponent.time = times[socketID];
        }
      }
    });

    // Different game endings

    socket.on(GameEvents.GameEndedByDisconnect, (socketID: string) => {
      // I have been disconnected
      if (socket.id === socketID) {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.DefeatDisconnect;
        // Enemy has been disconnected
      } else {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.VictoryDisconnect;
      }
    });

    socket.on(GameEvents.GameEndedByCombination, (socketID: string) => {
      this.gameState = GameState.Ended;
      this.gameEnding =
        socketID !== socket.id
          ? Ending.VictoryFiveInRow
          : Ending.DefeatFiveInRow;
    });

    socket.on(GameEvents.GameEndedByTimeout, (socketID: string) => {
      // I have timed out
      if (socket.id === socketID) {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.DefeatTimeout;
        // Enemy has timed out
      } else {
        this.gameState = GameState.Ended;
        this.gameEnding = Ending.VictoryTimeout;
      }
    });
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
