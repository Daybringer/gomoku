<template>
  <ViewBaseResponsive>
    <div
      class="flex-1 w-full py-8 px-4 pt-20 md:pt-8 gap-8 flex flex-col place-items-center"
    >
      <BaseHighHeadline class="-mb-4">Custom game</BaseHighHeadline>
      <img
        src="@/assets/svg/puzzle.svg"
        class="h-20 md:h-32 absolute left-2 md:left-10 top-20"
        alt="Image of jigsaw puzzles"
      />
      <BaseHRDivider class="md:w-80 w-full" />
      <div
        class="w-full md:w-80 gap-8 justify-around flex flex-col md:flex-row"
      >
        <div class="flex flex-col place-items-center gap-4">
          <BaseMidHeadline class="my-2">Opening type</BaseMidHeadline>
          <div class="flex flex-row gap-6">
            <BaseToggleButton
              @toggle="opening = Opening.Standard"
              :toggled="opening === Opening.Standard"
            >
              <span class="md:text-xl">Standard</span>
            </BaseToggleButton>
            <BaseToggleButton
              @toggle="opening = Opening.Swap1"
              :toggled="opening === Opening.Swap1"
            >
              <span class="md:text-xl">SWAP1</span>
            </BaseToggleButton>
            <BaseToggleButton
              @toggle="opening = Opening.Swap2"
              :toggled="opening === Opening.Swap2"
            >
              <span class="md:text-xl">SWAP2</span>
            </BaseToggleButton>
          </div>
        </div>
        <div class="flex flex-col place-items-center gap-4">
          <BaseMidHeadline class="my-2">Time limit</BaseMidHeadline>
          <div class="flex flex-row gap-6">
            <BaseToggleButton
              @toggle="time = 3 * 60"
              :toggled="time === 3 * 60"
            >
              <span class="md:text-xl">3min</span>
            </BaseToggleButton>
            <BaseToggleButton
              @toggle="time = 5 * 60"
              :toggled="time === 5 * 60"
            >
              <span class="md:text-xl">5m</span>
            </BaseToggleButton>
            <BaseToggleButton
              @toggle="time = 10 * 60"
              :toggled="time === 10 * 60"
            >
              <span class="md:text-xl">10m</span>
            </BaseToggleButton>
            <BaseToggleButton @toggle="time = 0" :toggled="time === 0">
              <InfinityIcon class="h-6 md:h-8" />
            </BaseToggleButton>
          </div>
        </div>
      </div>
      <BaseHRDivider class="w-full" />
      <BaseButton
        @click="createGame()"
        :gomokuBlue="true"
        class="w-full md:w-60 text-xl"
        >Create game</BaseButton
      >
    </div>
  </ViewBaseResponsive>
</template>
<script setup lang="ts">
import io, { Socket } from "socket.io-client";
let socket: Socket;
import BaseHRDivider from "@/components/BaseHRDivider.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseToggleButton from "@/components/BaseToggleButton.vue";
import InfinityIcon from "@/assets/svg/InfinityIcon.vue";
import { ref, onUnmounted } from "vue";

import { Opening } from "@/shared/types";
import {
  SocketIOEvents,
  CustomCreatedDTO,
  CreateCustomDTO,
} from "@/shared/socketIO";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import router from "@/router";

const opening = ref(Opening.Standard);
const time = ref(5 * 60);
onUnmounted(() => {
  socket.close();
});
function createGame(): void {
  socket = io("/custom", { port: 3001 });
  const createCustomDTO: CreateCustomDTO = {
    gameSettings: {
      hasTimeLimit: time.value !== 0,
      timeLimitInSeconds: time.value,
      openingType: opening.value,
      // TODO implement these options
      boardSize: 15,
      doesOverlineCount: true,
      winningLineSize: 5,
    },
  };

  socket.emit(SocketIOEvents.CreateCustomWaiting, createCustomDTO);

  socket.on(
    SocketIOEvents.CustomWaitingCreated,
    (customCreatedDTO: CustomCreatedDTO) => {
      router.push(`/custom/${customCreatedDTO.roomID}`);
    }
  );
}
</script>
<style scoped></style>
