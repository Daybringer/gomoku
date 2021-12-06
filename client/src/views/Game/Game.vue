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
  ></GameBase>
</template>
<script lang="ts">
// Types
import { GameState, Ending } from "@/types";

// SocketIO
import io from "socket.io-client";
const socket = io("/game/quick", { port: "3001" });
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
      messages: [
        { author: "opponent", text: "I'm testing" },
        { author: "me", text: "I'm testing too" },
      ],
      boardSize: 15,
      intervalHandle: 0,
    };
  },
  methods: {
    /**
     * Forwards click event from GameBase component to game server
     */
    gameClick(position: [number, number]): void {
      socket.emit("gameClick", { roomID: this.getRoomIDFromURL, position });
    },

    /**
     * Switches countdown to my or opponent's time
     * @param {boolean} me - True if I am playing; False if an opponent is
     * @returns {number} - interval's ID
     */
    startCountdown(me: boolean): number {
      if (me) {
        return setInterval(() => {
          this.me.time = this.me.time - 1;
        }, 1000);
      } else {
        return setInterval(() => {
          this.opponent.time = this.opponent.time - 1;
        }, 1000);
      }
    },
  },
  mounted() {
    // initalizing Pinia store
    const store = useStore();

    const userProfile = store.getUserProfile;

    this.me.nickname = userProfile.username;
    this.me.color = userProfile.myColor;
    this.opponent.color = userProfile.enemyColor;

    if (this.getGameTypeFromURL === "quick") {
      socket.emit("joinGame", {
        roomID: this.getRoomIDFromURL,
        logged: this.me.nickname ? true : false,
        username: this.me.nickname,
      });
    } else {
      // TODO implement ranked,customs, etc.
      this.$router.push("/");
    }

    socket.on("invalidRoomID", () => {
      // TODO show some notification instead of console log
      console.log("Invalid Room ID");
      this.$router.push("/");
    });

    // Game has begun
    socket.on("gameStarted", (gameInfo) => {
      this.gameState = GameState.Coinflip;
      this.me.time = this.opponent.time = gameInfo.timeLimitInSeconds;
      setTimeout(() => {
        this.gameState = GameState.Running;
        this.intervalHandle = this.startCountdown(this.amIStartingPlayer);
      }, 4200);

      this.amIStartingPlayer = socket.id === gameInfo.startingPlayer.socketID;
      this.me.nickname = "This is me";
      this.opponent.nickname = "This is enemy";
    });

    // Player made a move
    socket.on("stonePlaced", (data) => {
      const { position, updatedPlayerTime } = data;

      console.log(updatedPlayerTime);

      this.round++;
      this.lastPositionID = position[1] * this.boardSize + position[0];
      clearInterval(this.intervalHandle);

      if (updatedPlayerTime.socketID == socket.id) {
        this.me.time = updatedPlayerTime.time;
        this.intervalHandle = this.startCountdown(false);
      } else {
        this.opponent.time = updatedPlayerTime.time;
        this.intervalHandle = this.startCountdown(true);
      }
    });

    // Different game endings

    socket.on("playerDisconnected", (socketID: string) => {
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

    socket.on("gameEnded", (socketID: string) => {
      this.gameState = GameState.Ended;
      this.gameEnding =
        socketID !== socket.id
          ? Ending.VictoryFiveInRow
          : Ending.DefeatFiveInRow;
    });

    // TODO refactor ending events to these
    // socket.on("gameEndedByDisconnect", () => {});
    // socket.on("gameEndedByCombination", () => {});
    // socket.on("gameEndedByTimeout", () => {});
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
