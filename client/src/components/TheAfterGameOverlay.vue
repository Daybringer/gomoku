<template>
  <div class="absolute z-20 h-full w-full">
    <button
      v-show="!isShown"
      @click="isShown = true"
      class="absolute top-2 left-2 p-1 rounded-full bg-gray-200 text-gray-900 focus:outline-none">
      <ChevronsDownIcon class="h-8 w-8 -rotate-45 transform" />
    </button>

    <Transition name="bounce" :css="true" type="animation" v-show="isShown">
      <div
        class="absolute z-20 flex p-6 xl:p-12 h-full w-full bg-gray-800"
        :class="
          isShown
            ? amIWinner
              ? 'victory-background'
              : 'defeat-background'
            : 'minimizeAfterGameModal'
        ">
        <div
          class="w-full h-full rounded-lg p-4 bg-white dark:bg-gray-700 shadow-2xl flex relative justify-between place-items-center flex-col">
          <button
            class="absolute top-3 left-3 p-1 rounded-full bg-gray-200 text-gray-800"
            @click="isShown = false">
            <CrossIcon class="h-6 sm:h-8" />
          </button>
          <div>
            <BaseHighHeadline
              v-if="gameType !== GameType.CustomLocal"
              class="text-gomoku-blue">
              {{ amIWinner ? "Victory!" : "Defeat!" }}
            </BaseHighHeadline>
            <BaseHighHeadline v-else>
              {{ amIWinner ? "PlayerOne has won" : "PlayerTwo has won" }}
            </BaseHighHeadline>
            <BaseLowHeadline v-show="endingType === EndingType.Surrender">
              Opponent has disconnected
            </BaseLowHeadline>
          </div>
          <div
            v-show="elo"
            class="text-center border-4 border-opacity-80 px-6 xl:px-12 py-2 xl:text-2xl text-xl font-medium rounded-xl bg-gray-100 dark:bg-gray-600"
            :class="amIWinner ? 'border-green-500' : 'border-red-500'">
            {{ eloGain }}
          </div>
          <img
            v-show="!amIWinner && gameType !== GameType.CustomLocal"
            src="../assets/svg/lose.svg"
            class="sad-animation md:w-50 w-1/3 md:p-8"
            alt="" />
          <img
            v-show="amIWinner || gameType === GameType.CustomLocal"
            src="../assets/svg/win.svg"
            class="animation-bounce md:w-50 w-1/3 md:p-8 mt-4"
            alt="" />
          <BaseButton
            v-if="gameType === GameType.Quick || gameType === GameType.Ranked"
            :gomoku-blue="true"
            class="w-full"
            :link="`/search?type=${
              gameType === GameType.Quick ? 'quick' : 'ranked'
            }`"
            >Play again
          </BaseButton>
          <BaseButton
            v-if="gameType === GameType.AI"
            :gomoku-blue="true"
            class="w-full"
            link="/campaign"
            >To Campaign
          </BaseButton>
          <BaseButton
            v-if="gameType === GameType.CustomLocal"
            class="w-full"
            :gomoku-blue="true"
            @click="router.go(0)">
            Rematch
          </BaseButton>
          <BaseButton
            v-if="gameType === GameType.Custom && rematchWaitingRoomID"
            class="w-full"
            :gomoku-blue="true"
            :link="`/custom/${rematchWaitingRoomID}`">
            Opponent asked for rematch. Join ->
          </BaseButton>
          <BaseButton
            v-if="gameType === GameType.Custom && !rematchWaitingRoomID"
            class="w-full"
            :gomoku-blue="true"
            @click="$emit('askForCustomRematch')"
            >Remake game
          </BaseButton>
        </div>
      </div>
    </Transition>
  </div>
</template>
<script setup lang="ts">
import { EndingType, GameType } from "@/shared/types";
import { ref, computed } from "vue";
import BaseButton from "@/components/BaseButton.vue";
// SVGs
import CrossIcon from "@/assets/svg/CrossIcon.vue";
import ChevronsDownIcon from "@/assets/svg/ChevronsDownIcon.vue";
import BaseHighHeadline from "./BaseHighHeadline.vue";
import BaseLowHeadline from "./BaseLowHeadline.vue";
import router from "@/router";
const props = defineProps<{
  amIWinner: boolean;
  endingType: EndingType;
  gameType: GameType;
  elo?: number;
  rematchWaitingRoomID?: string;
}>();
defineEmits(["askForCustomRematch"]);
const isShown = ref(true);
const eloGain = computed(() => {
  if (!props.elo) return "";
  if (props.amIWinner) {
    return `Gained ${Math.abs(props.elo)} ELO`;
  } else {
    return `Lost -${Math.abs(props.elo)} ELO`;
  }
});
</script>
<style scoped>
.victory-background {
  background-image: url("../assets/svg/confettiPattern.svg");
  background-repeat: repeat;
}
.defeat-background {
  background-image: url("../assets/svg/leavesPattern.svg");
  background-repeat: repeat;
}
</style>
