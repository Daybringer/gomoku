<template>
  <div
    class="relative bg-white border-4 dark:bg-gray-500 rounded-full min-h-12 p-1 px-8 flex flex-row items-center justify-around shadow-md"
    :style="isActive ? `border-color: ${symbolColor};` : ''"
  >
    <game-stone-cross
      class="h-8 w-8"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'cross'"
    />
    <game-stone-circle
      class="h-8 w-8"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'circle'"
    />
    <dots-icon class="h-8 w-8" v-show="symbol === ''" />
    <div class="text-xl">
      {{ hasTimeLimit ? humanReadableTime(player.timeLeft) : "" }}
      <infinity-icon class="h-8" v-show="!hasTimeLimit" />
    </div>
    <match-record-profile-link
      class="hover:dark:bg-gray-800"
      :player="player"
    />
  </div>
</template>

<script setup lang="ts">
import { Player } from "@/shared/types";
import { humanReadableTime } from "@/utils/general";
// SVGs
import InfinityIcon from "@/assets/svg/InfinityIcon.vue";
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";
import DotsIcon from "@/assets/svg/DotsIcon.vue";
import MatchRecordProfileLink from "./MatchRecordProfileLink.vue";

defineProps<{
  player: Player;
  symbol: string;
  symbolColor: string;
  hasTimeLimit: boolean;
  isActive: boolean;
}>();
</script>
