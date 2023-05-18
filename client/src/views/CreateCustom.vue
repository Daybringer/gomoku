<template>
  <view-base-fixed-height :placeItems="'start'">
    <div class="flex-1 py-8 px-4 gap-4 flex flex-col">
      <base-high-headline class="mb-4">Custom game</base-high-headline>
      <img
        src="@/assets/svg/puzzle.svg"
        class="h-20 md:h-32 absolute left-2 md:left-10 top-20"
        alt=""
      />
      <hr
        class="m3 border-2 w-full md:w-80 self-center rounded border-gray-500"
      />
      <div
        class="w-full md:w-80 gap-4 self-center justify-around flex-1 flex flex-col md:flex-row"
      >
        <div class="flex flex-col gap-4">
          <base-mid-headline class="my-2">Opening type</base-mid-headline>
          <div class="flex flex-row gap-6">
            <base-toggle-button
              @toggle="openingRadio(Opening.Standard)"
              :toggled="opening === Opening.Standard"
            >
              <span class="md:text-xl">Standard</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="openingRadio(Opening.Swap1)"
              :toggled="opening === Opening.Swap1"
            >
              <span class="md:text-xl">SWAP1</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="openingRadio(Opening.Swap2)"
              :toggled="opening === Opening.Swap2"
            >
              <span class="md:text-xl">SWAP2</span>
            </base-toggle-button>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <base-mid-headline class="my-2">Time limit</base-mid-headline>
          <div class="flex flex-row gap-6">
            <base-toggle-button @toggle="timeRadio(3)" :toggled="time === 3">
              <span class="md:text-xl">3min</span>
            </base-toggle-button>
            <base-toggle-button @toggle="timeRadio(5)" :toggled="time === 5">
              <span class="md:text-xl">5m</span>
            </base-toggle-button>
            <base-toggle-button @toggle="timeRadio(10)" :toggled="time === 10">
              <span class="md:text-xl">10m</span>
            </base-toggle-button>
            <base-toggle-button
              @toggle="timeRadio('infinite')"
              :toggled="time === 'infinite'"
            >
              <infinity-icon class="h-6 md:h-8" />
            </base-toggle-button>
          </div>
        </div>
      </div>
      <hr class="m-3 border-2 rounded border-gray-500" />
      <base-button
        @click="createGame()"
        class="text-xl w-60 self-center bg-gomoku-blue hover:bg-gomoku-blue-dark dark:hover:bg-gomoku-blue-dark dark:bg-gomoku-blue text-gray-50 font-medium mt-5"
        >Create game</base-button
      >
    </div>
  </view-base-fixed-height>
</template>
<script lang="ts">
import io, { Socket } from "socket.io-client";
let socket: Socket;
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseToggleButton from "@/components/BaseToggleButton.vue";
import InfinityIcon from "@/assets/svg/InfinityIcon.vue";
import { defineComponent } from "vue";

import { Opening, Time } from "@/shared/types";
import {
  SocketIOEvents,
  CustomCreatedDTO,
  CreateCustomDTO,
} from "@/shared/socketIO";

export default defineComponent({
  name: "CreateCustom",
  props: {},
  components: {
    ViewBaseFixedHeight,
    BaseButton,
    BaseHighHeadline,
    BaseMidHeadline,
    BaseToggleButton,
    InfinityIcon,
  },
  data(): { opening: Opening; time: Time } {
    return { opening: Opening.Standard, time: 5 };
  },
  setup() {
    return { Opening };
  },
  computed: {},
  unmounted() {
    if (socket) {
      socket.close();
    }
  },
  methods: {
    openingRadio(opening: Opening) {
      this.opening = opening;
    },
    timeRadio(time: Time) {
      this.time = time;
    },
    createGame(): void {
      socket = io("/custom", { port: 3001 });
      const createCustomDTO: CreateCustomDTO = {
        hasTimeLimit: this.time !== "infinite",
        timeLimitInSeconds: this.time === "infinite" ? 0 : this.time * 60,
        opening: this.opening,
      };

      socket.emit(SocketIOEvents.CreateCustomWaiting, createCustomDTO);

      socket.on(
        SocketIOEvents.CustomWaitingCreated,
        (customCreatedDTO: CustomCreatedDTO) => {
          this.$router.push(
            `/custom/${customCreatedDTO.roomID}?hasTimeLimit=${createCustomDTO.hasTimeLimit}&timeLimitInSeconds=${createCustomDTO.timeLimitInSeconds}&opening=${createCustomDTO.opening}`
          );
        }
      );
    },
  },
});
</script>
<style scoped></style>
