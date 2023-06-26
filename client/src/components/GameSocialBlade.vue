<template>
  <div
    class="bg-white border-4 dark:bg-gray-500 w-full rounded-full min-h-12 flex flex-row items-center justify-between overflow-hidden shadow-md"
    :style="isActive ? `border-color: ${symbolColor};` : ''"
  >
    <game-stone-cross
      class="h-8 w-8 mx-3"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'cross'"
    />
    import ProfileIcon from "./ProfileIcon.vue";
    <game-stone-circle
      class="h-8 w-8 mx-3"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'circle'"
    />
    <dots-icon class="h-8 w-8 mx-3" v-show="symbol === ''" />

    <div
      class="flex-1 flex justify-center text-center text-xl text-gray-900 dark:text-gray-100"
    >
      {{ hasTimeLimit ? humanReadableTime(player.timeLeft) : "" }}
      <infinity-icon class="h-8 self-center" v-show="!hasTimeLimit" />
    </div>
    <div class="flex-1 text-center text-xl text-gray-900 dark:text-gray-100">
      <p>{{ player.username }}</p>
    </div>
    <router-link
      target="_blank"
      :to="player.logged ? '/profile/' + player.userID : '/'"
    >
      <div
        class="w-16 rounded-full h-full flex justify-between"
        :class="
          player.logged
            ? 'hover:bg-gray-300 cursor-pointer dark:hover:bg-gray-400'
            : 'cursor-default'
        "
      >
        <profile-icon
          v-show="player.logged"
          class="m-auto h-12 p-1 w-auto align-middle"
          :profile-icon="player.profileIcon"
        />
        <anonym-icon
          v-show="!player.logged"
          alt="unlogged_user_icon"
          class="m-auto h-12 w-auto align-middle"
        />
      </div>
    </router-link>
  </div>
</template>

<script setup lang="ts">
import { Player } from "@/shared/types";
import { humanReadableTime } from "@/utils/general";
// SVGs
import ProfileIcon from "./ProfileIcon.vue";
import InfinityIcon from "@/assets/svg/InfinityIcon.vue";
import AnonymIcon from "@/assets/svg/AnonymIcon.vue";
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";
import DotsIcon from "@/assets/svg/DotsIcon.vue";

defineProps<{
  player: Player;
  symbol: string;
  symbolColor: string;
  hasTimeLimit: boolean;
  isActive: boolean;
}>();
</script>
