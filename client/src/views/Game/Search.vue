<template>
  <BaseView>
    <div class="flex-1 flex flex-col place-items-center">
      <BaseHighHeadline>Searching</BaseHighHeadline>
      <span class="text-gray-800 dark:text-gray-200 text-3xl">{{
        humanReadableTime(currentTime)
      }}</span>
      <SwingAnimation />
    </div>
  </BaseView>
</template>
<script setup lang="ts">
// SocketIO
import io, { Socket } from "socket.io-client";
// Components
import SwingAnimation from "@/assets/svg/SwingAnimation.vue";
import BaseView from "@/components/BaseView.vue";
// Utils
import { humanReadableTime } from "@/utils/general";
import { ref, onMounted, onUnmounted } from "vue";
import { GameType } from "@/shared/types";
import { useProfileStore } from "@/store/profile";
import {
  SearchQuickGameDTO,
  SearchRankedGameDTO,
  SocketIOEvents,
} from "@/shared/socketIO";
import router from "@/router";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";

const store = useProfileStore();
let socket: Socket;
const interval = ref(0);
const currentTime = ref(0);
function timeChange() {
  currentTime.value += 1000;
}
onMounted(() => {
  interval.value = window.setInterval(timeChange, 1000);

  const urlParams = new URLSearchParams(window.location.search);

  const gameType = urlParams.get("type");

  if (gameType === GameType.Quick) {
    socket = io("/search/quick", { port: "3001" });
    socket.emit(SocketIOEvents.SearchQuickGame, {
      userID: store.isAuthenticated ? store.user.id : undefined,
    } as SearchQuickGameDTO);
    socket.on(SocketIOEvents.GameCreated, (roomID: string) => {
      // Timeout for smoother experience (if a player instantly finds game it jumps a lot)
      setTimeout(() => {
        router.push({
          path: "/game",
          query: { type: GameType.Quick, roomID: roomID },
        });
      }, 1000);
    });
  } else if (gameType === GameType.Ranked) {
    if (!store.isAuthenticated) {
      useNotificationsStore().createNotification(
        NotificationType.Error,
        "You have to be LOGGED IN in order to play RANKED.",
        true,
        6
      );
      router.push("/login");
    }
    socket = io("/search/ranked", { port: "3001" });
    const dto: SearchRankedGameDTO = { jwtToken: store.token };
    socket.emit(SocketIOEvents.SearchRankedGame, dto);
    socket.on(SocketIOEvents.GameCreated, (roomID: string) => {
      setTimeout(
        () =>
          router.push({
            path: "/game",
            query: { type: GameType.Ranked, roomID: roomID },
          }),
        1000
      );
    });
  } else {
    router.push("/");
  }
});
onUnmounted(() => {
  clearInterval(interval.value);
  if (socket) {
    socket.close();
  }
});
</script>
<style scoped>
.swing-animation {
  width: 45vh;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 3rem;
}
@media only screen and (min-width: 768px) {
  .swing-animation {
    width: 50vh;
  }
}
</style>
