<template>
  <view-base-fixed-height>
    <div class="flex-1 flex flex-col-reverse md:flex-row justify-center">
      <div class="flex-1 flex flex-col justify-center">
        <swing-animation class="w-80 md:w-60 self-center md:self-end" />
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
          <base-button
            class="text-xl w-full text-gray-50 font-medium mt-5"
            :class="
              copyButtonText === 'Copied'
                ? 'bg-gray-400 dark:bg-gray-500'
                : 'bg-gomoku-blue dark:bg-gomoku-blue'
            "
            @click="copyToClipboard()"
            >{{ copyButtonText }}<clipboard-icon class="pl-2 h-6"
          /></base-button>
        </div>
      </div>
    </div>
  </view-base-fixed-height>
</template>
<script lang="ts">
import io, { Socket } from "socket.io-client";
let socket: Socket;

import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import BaseButton from "@/components/BaseButton.vue";
import ClipboardIcon from "@/assets/svg/ClipboardIcon.vue";
import SwingAnimation from "@/assets/svg/SwingAnimation.vue";
import { defineComponent } from "vue";
import {
  CreateCustomDTO,
  CustomRoomJoinedDTO,
  CustomRoomRedirectToGameDTO,
  SocketIOEvents,
} from "@/shared/socketIO";
import { Opening } from "@/shared/types";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
export default defineComponent({
  name: "CustomWaitingRoom",
  props: {},
  components: {
    ViewBaseFixedHeight,
    BaseButton,
    SwingAnimation,
    ClipboardIcon,
  },
  data(): { copyButtonText: string } {
    return {
      copyButtonText: "Copy link",
    };
  },
  computed: {
    getURLParams() {
      return new URLSearchParams(window.location.search);
    },
    roomID(): string {
      return this.$route.params.roomID as string;
    },
    hasTimeLimit(): boolean {
      return this.getURLParams.get("hasTimeLimit") === "true";
    },
    timeLimitInSeconds(): number {
      return Number(this.getURLParams.get("timeLimitInSeconds"));
    },
    opening(): Opening {
      return this.getURLParams.get("opening") as Opening;
    },
  },
  methods: {
    copyToClipboard(): void {
      navigator.clipboard.writeText(window.location.href);
      this.copyButtonText = "Copied";
      this.notification.createNotification(
        NotificationType.Success,
        "Room ID has been successfuly copied"
      );
    },
  },
  setup() {
    const notification = useNotificationsStore();
    return { notification };
  },
  mounted() {
    socket = io("/custom/waiting", { port: 3001 });
    const customRoomJoinedDTO: CustomRoomJoinedDTO = {
      waitingRoomID: this.roomID,
    };
    socket.emit(SocketIOEvents.CustomRoomJoined, customRoomJoinedDTO);

    socket.on(SocketIOEvents.InvalidCustomRoom, () => {
      this.notification.createNotification(
        NotificationType.Error,
        "Invalid custom room ID"
      );
      this.$router.push("/");
    });

    socket.on(
      SocketIOEvents.CustomRoomRedirectToGame,
      (customRoomRedirectToGameDTO: CustomRoomRedirectToGameDTO) => {
        const createCustomDTO: CreateCustomDTO = {
          hasTimeLimit: this.hasTimeLimit,
          timeLimitInSeconds: this.timeLimitInSeconds,
          opening: this.opening,
        };
        this.$router.push(
          `/game?type=custom&roomID=${customRoomRedirectToGameDTO.roomID}&hasTimeLimit=${createCustomDTO.hasTimeLimit}&timeLimitInSeconds=${createCustomDTO.timeLimitInSeconds}&opening=${createCustomDTO.opening}`
        );
      }
    );
  },
  unmounted() {
    socket.close();
  },
});
</script>
