<template>
  <SearchBase></SearchBase>
</template>
<script lang="ts">
// SocketIO

import * as io from "socket.io-client";
// @ts-ignore
const socket = io.connect("/q/search");
// Components
import SearchBase from "@/components/SearchBase.vue";
// Utils
import { defineComponent } from "vue";
export default defineComponent({
  name: "App",
  components: { SearchBase },
  mounted() {
    socket.on("gameCreated", (roomID: string) => {
      // Timeout for smoother experience (if player instantly finds game it jumps a lot)
      setTimeout(() => {
        this.$router.push({ path: "/q/game", query: { roomID: roomID } });
      }, 1000);
    });
  },
  beforeUnmount() {
    socket.close();
  },
});
</script>
