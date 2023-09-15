<template>
  <ViewBaseResponsive class="md:flex-row flex-col-reverse">
    <div class="flex-1 flex flex-col justify-center">
      <SwingAnimation class="w-80 md:w-60 self-center md:self-end" />
    </div>
    <div class="flex-1 flex justify-center place-items-center mb-20">
      <div class="flex flex-col gap-1 place-items-center">
        <p
          class="text-5xl text-gray-700 dark:text-current font-light md:mb-2 self-start"
        >
          Room ID:
        </p>
        <div
          class="text-gray-400 dark:text-gray-500 md:text-8xl text-7xl relative"
          style="letter-spacing: 0.5rem"
        >
          <!--SHADOW -->
          <span>{{ roomID }}</span>
          <!-- Real text -->
          <span class="absolute -left-1 -top-1 text-gomoku-pink z-0">
            {{ roomID }}
          </span>
        </div>
        <BaseButton
          class="w-full mt-5 text-xl"
          :gomoku-blue="true"
          @click="copyToClipboard()"
          >{{ copyButtonText }}<ClipboardIcon class="pl-2 h-6"
        /></BaseButton>
      </div>
    </div>
  </ViewBaseResponsive>
</template>
<script setup lang="ts">
import io, { Socket } from "socket.io-client";
let socket: Socket;

import BaseButton from "@/components/BaseButton.vue";
import ClipboardIcon from "@/assets/svg/ClipboardIcon.vue";
import SwingAnimation from "@/assets/svg/SwingAnimation.vue";
import {
  CustomRoomJoinedDTO,
  CustomRoomRedirectToGameDTO,
  SocketIOEvents,
} from "@/shared/socketIO";
import { ref, computed, onMounted, onUnmounted } from "vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import { useRoute } from "vue-router";
import router from "@/router";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
const copyButtonText = ref("Copy link");
const notification = useNotificationsStore();
const roomID = computed(() => useRoute().params.roomID as string);
function copyToClipboard(): void {
  navigator.clipboard.writeText(window.location.href);
  copyButtonText.value = "Copied";
  useNotificationsStore().createNotification(
    NotificationType.Success,
    "Room ID has been successfuly copied"
  );
}
onMounted(() => {
  socket = io("/custom/waiting", { port: 3001 });
  const customRoomJoinedDTO: CustomRoomJoinedDTO = {
    waitingRoomID: roomID.value,
  };
  socket.emit(SocketIOEvents.CustomRoomJoined, customRoomJoinedDTO);

  socket.on(SocketIOEvents.InvalidCustomRoom, () => {
    notification.createNotification(
      NotificationType.Error,
      "Invalid custom room ID"
    );
    router.push("/");
  });

  socket.on(
    SocketIOEvents.CustomRoomRedirectToGame,
    (customRoomRedirectToGameDTO: CustomRoomRedirectToGameDTO) => {
      router.push(
        `/game?type=custom&roomID=${customRoomRedirectToGameDTO.roomID}`
      );
    }
  );
});
onUnmounted(() => socket.close());
</script>
