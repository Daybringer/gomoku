<template>
  <div
    class="relative bg-white border-4 dark:bg-gray-500 rounded-full min-h-12 p-1 px-8 flex flex-row items-center justify-around shadow-md"
    :style="isActive ? `border-color: ${symbolColor};` : ''"
  >
    <GameStoneCross
      class="h-8 w-8"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'cross'"
    />
    <GameStoneCircle
      class="h-8 w-8"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'circle'"
    />
    <DotsIcon class="h-8 w-8" v-show="symbol === ''" />
    <div class="text-xl">
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
import { Player } from "@/shared/types";
import { humanReadableTime } from "@/utils/general";
import InfinityIcon from "@/assets/svg/InfinityIcon.vue";
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";
import DotsIcon from "@/assets/svg/DotsIcon.vue";
import BaseProfileLink from "./BaseProfileLink.vue";
import { ProfileIcon } from "@/shared/icons";

defineProps<{
  player: Player;
  symbol: string;
  symbolColor: string;
  hasTimeLimit: boolean;
  isActive: boolean;
}>();
</script>
