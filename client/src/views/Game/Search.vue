<template>
  <SearchBase />
</template>
<script lang="ts">
// SocketIO
import io, { Socket } from "socket.io-client";

let socket: Socket;
// Components
import SearchBase from "@/components/TheSearchBase.vue";
// Utils
import { defineComponent } from "vue";
import { GameType, SearchEvents } from "@/shared/types";
import { useStore } from "@/store/store";
import {
  SearchQuickGameDTO,
  SearchRankedGameDTO,
  SocketIOEvents,
} from "@/shared/socketIO";
export default defineComponent({
  name: "App",
  components: { SearchBase },
  data() {
    return {};
  },
  setup() {
    const store = useStore();
    return { store };
  },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    const gameType = urlParams.get("type");

    if (gameType === GameType.Quick) {
      socket = io("/search/quick", { port: "3001" });
      socket.emit(SocketIOEvents.SearchQuickGame, {
        userID: this.store.isAuthenticated ? this.store.user.id : undefined,
      } as SearchQuickGameDTO);
      socket.on(SocketIOEvents.GameCreated, (roomID: string) => {
        // Timeout for smoother experience (if player instantly finds game it jumps a lot)
        setTimeout(() => {
          this.$router.push({
            path: "/game",
            query: { type: GameType.Quick, roomID: roomID },
          });
        }, 1000);
      });
    } else if (gameType === GameType.Ranked) {
      // TODO show notification
      if (!this.store.isAuthenticated) this.$router.push("/login");
      socket = io("/search/ranked", { port: "3001" });
      const dto: SearchRankedGameDTO = { jwtToken: this.store.token };
      socket.emit(SocketIOEvents.SearchRankedGame, dto);
      socket.on(SocketIOEvents.GameCreated, (roomID: string) => {
        setTimeout(() => {
          this.$router.push({
            path: "/game",
            query: { type: GameType.Ranked, roomID: roomID },
          });
        }, 1000);
      });
    } else {
      this.$router.push("/");
    }
  },
  beforeUnmount() {
    if (socket) {
      socket.close();
    }
  },
});
</script>
