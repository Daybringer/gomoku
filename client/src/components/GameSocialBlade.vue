<template>
  <div
    class="relative border-4 rounded-full min-h-12 p-1 px-8 flex flex-row items-center justify-around shadow-md"
    :class="isClassic ? 'classic-background ' : 'bg-white dark:bg-gray-500 '"
    :style="isActive ? `border-color: ${symbolColor};` : ''"
  >
    <GameStoneCross
      class="h-8 w-8"
      :style="`color:${symbolColor};`"
      v-show="symbol === Symbol.Cross && !isClassic"
    />
    <ClassicStone
      class="h-8"
      :style="`color:${symbolColor}`"
      v-show="isClassic"
    />
    <GameStoneCircle
      class="h-8 w-8"
      :style="`color:${symbolColor};`"
      v-show="symbol === Symbol.Circle && !isClassic"
    />
    <DotsIcon class="h-8 w-8" v-show="symbol === Symbol.NotTaken" />
    <div class="text-xl" :class="isClassic ? 'text-gray-900' : ''">
      {{ hasTimeLimit ? humanReadableTime(player.timeLeft) : "" }}
      <InfinityIcon class="h-8" v-show="!hasTimeLimit" />
    </div>
    <BaseProfileLink
      class="hover:dark:bg-gray-800"
      :is-logged="!!player.userID"
      :profile-icon="player.userID ? player.profileIcon : ProfileIcon.guest"
      :user-id="player.userID"
      :username="player.username"
    />
  </div>
</template>

<script setup lang="ts">
import { Player, Symbol } from "@/shared/types";
import { humanReadableTime } from "@/utils/general";
import InfinityIcon from "@/assets/svg/InfinityIcon.vue";
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";
import DotsIcon from "@/assets/svg/DotsIcon.vue";
import BaseProfileLink from "./BaseProfileLink.vue";
import { ProfileIcon } from "@/shared/icons";
import ClassicStone from "@/assets/svg/ClassicStone.vue";

defineProps<{
  player: Player;
  symbol: Symbol;
  symbolColor: string;
  hasTimeLimit: boolean;
  isActive: boolean;
  isClassic?: boolean;
}>();
</script>
<style scoped>
.classic-background {
  background-color: #dec26bff;
}
</style>
