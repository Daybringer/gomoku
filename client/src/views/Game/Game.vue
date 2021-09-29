<template>
  <GameBase
    :round="round"
    :gameState="gameState"
    :lastPositionID="lastPositionID"
    :myTime="myTime"
    :myNickname="myNickname"
    :myColor="myColor"
    :amIStartingPlayer="amIStartingPlayer"
    :enemyTime="enemyTime"
    :enemyColor="enemyColor"
    :enemyNickname="enemyNickname"
    :messages="messages"
    @gameClick="gameClick"
  ></GameBase>
</template>
<script lang="ts">
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
      myTime: 0,
      enemyTime: 0,
      amIStartingPlayer: true,
      myNickname: "-",
      enemyNickname: "-",
      myColor: "",
      enemyColor: "",
      chatInput: "",
      lastPositionID: 0,
      round: 0,
      gameState: "waiting", // waiting, coinflip, running, victory, defeat, tie
      messages: [
        { author: "opponent", text: "I'm testing" },
        { author: "me", text: "I'm testing too" },
      ],
      boardSize: 15,

      intervalHandle: 0,
    };
  },
  methods: {
    gameClick(position) {
      socket.emit("gameClick", { roomID: this.roomID, position });
    },
    startCountdown(meOrEnemy: string): number {
      if (meOrEnemy === "me") {
        return setInterval(() => {
          this.myTime = this.myTime - 1;
        }, 1000);
      } else {
        return setInterval(() => {
          this.enemyTime = this.enemyTime - 1;
        }, 1000);
      }
    },
  },
  mounted() {
    const store = useStore();

    const userProfile = store.getUserProfile;

    this.myNickname = userProfile.username;
    this.myColor = userProfile.myColor;
    this.enemyColor = userProfile.enemyColor;

    if (this.gameType === "quick") {
      socket.emit("joinGame", {
        roomID: this.roomID,
        logged: this.myNickname ? true : false,
        username: this.myNickname,
      });
    } else {
      this.$router.push("/");
    }

    socket.on("invalidRoomID", () => {
      // TODO show some notification instead of console log
      console.log("Invalid Room ID");
      this.$router.push("/");
    });

    socket.on("gameStarted", (gameInfo) => {
      this.gameState = "coinflip";
      this.myTime = this.enemyTime = gameInfo.timeLimitInSeconds;
      // console.log("Game started:", gameInfo, gameInfo.startingPlayer);
      setTimeout(() => {
        this.gameState = "running";
        this.intervalHandle = this.startCountdown(
          this.amIStartingPlayer ? "me" : "enemy"
        );
      }, 4200);

      this.amIStartingPlayer = socket.id === gameInfo.startingPlayer.socketID;
      this.myNickname = "This is me";
      this.enemyNickname = "This is enemy";
    });

    socket.on("stonePlaced", (data) => {
      const { position, updatedPlayerTime } = data;

      console.log(updatedPlayerTime);

      this.round++;
      this.lastPositionID = position[1] * this.boardSize + position[0];
      clearInterval(this.intervalHandle);

      if (updatedPlayerTime.socketID == socket.id) {
        this.myTime = updatedPlayerTime.time;
        this.intervalHandle = this.startCountdown("enemy");
      } else {
        this.enemyTime = updatedPlayerTime.time;
        this.intervalHandle = this.startCountdown("me");
      }
    });

    socket.on("gameEnded", (socketID: string) => {
      this.gameState = socketID !== socket.id ? "victory" : "defeat";
    });
  },
  computed: {
    URLParams() {
      return new URLSearchParams(window.location.search);
    },
    gameType(): string | null {
      return this.URLParams.get("type");
    },
    roomID(): string | null {
      return this.URLParams.get("roomID");
    },
  },
  beforeUnmount() {
    socket.close();
  },
});
</script>
