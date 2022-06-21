<template>
  <SearchBase />
</template>
<script lang="ts">
// SocketIO
import io from "socket.io-client";

let socket: any;
// Components
import SearchBase from "@/components/SearchBase.vue";
// Utils
import { defineComponent } from "vue";
import { GameEvents, GameType, SearchEvents } from "@/shared/types";
export default defineComponent({
  name: "App",
  components: { SearchBase },
  data() {
    return {};
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    const gameType = urlParams.get("type");

    if (gameType === GameType[GameType.Quick]) {
      // @ts-ignore
      console.log("TF");
      socket = io("/search/quick", { port: "3001" });
      console.log("TF");
      socket.on(SearchEvents.GameCreated, (roomID: string) => {
        // Timeout for smoother experience (if player instantly finds game it jumps a lot)
        setTimeout(() => {
          this.$router.push({
            path: "/game",
            query: { type: GameType.Quick, roomID: roomID },
          });
        }, 1000);
      });
    } else {
      this.$router.push("/");
    }
  },
  beforeUnmount() {
    socket.close();
  },
});
</script>
