<template>
  <GameBase></GameBase>
</template>
<script lang="ts">
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
    return {};
  },
  mounted() {
    const store = useStore();
    const username: string = store.getUsername;

    if (this.gameType === "quick") {
      // @ts-ignore
      socket = io("/game/quick", { port: "3001" });
      socket.emit("joinGame", {
        roomID: this.roomID,
        logged: username ? true : false,
        username,
      });
    } else {
      this.$router.push("/");
    }

    socket.on("invalidRoomID", () => {
      // TODO show some notification instead of console log
      console.log("Invalid Room ID");
      this.$router.push("/");
    });

    socket.on("gameStarted", (game: {}) => {
      console.log(game);
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
