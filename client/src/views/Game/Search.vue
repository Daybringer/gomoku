<template>
  <SearchBase></SearchBase>
</template>
<script lang="ts">
// SocketIO
import io from "socket.io-client";

let socket: any;
// Components
import SearchBase from "@/components/SearchBase.vue";
// Utils
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  components: { SearchBase },
  data() {
    return {};
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    const gameType = urlParams.get("type");

    if (gameType === "quick") {
      // @ts-ignore
      socket = io("/search/quick", { port: "3001" });
      socket.on("gameCreated", (roomID: string) => {
        // Timeout for smoother experience (if player instantly finds game it jumps a lot)
        setTimeout(() => {
          this.$router.push({
            path: "/game",
            query: { type: "quick", roomID: roomID }
          });
        }, 1000);
      });
    } else {
      this.$router.push("/");
    }
  },
  beforeUnmount() {
    socket.close();
  }
});
</script>
