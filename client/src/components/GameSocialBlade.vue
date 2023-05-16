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
    <game-stone-circle
      class="h-8 w-8 mx-3"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'circle'"
    />
    <dots-icon class="h-8 w-8 mx-3" v-show="symbol === ''" />

    <div
      class="flex-1 flex justify-center text-center text-xl text-gray-900 dark:text-gray-100"
    >
      {{ hasTimeLimit ? humanReadableTime : "" }}
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
        <img
          class="m-auto h-12 p-1 w-auto align-middle"
          alt="logged_user_icon"
          v-show="player.logged"
          :src="getSvgURL(player.profileIcon || 'defaultBoy')"
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

<script lang="ts">
import { defineComponent, PropType } from "vue";
import { Player } from "@/shared/types";
// SVGs
import InfinityIcon from "@/assets/svg/InfinityIcon.vue";
import AnonymIcon from "@/assets/svg/AnonymIcon.vue";
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";
import DotsIcon from "@/assets/svg/DotsIcon.vue";

export default defineComponent({
  name: "SocialBlade",
  props: {
    player: { type: Object as PropType<Player>, required: true },
    symbol: String,
    symbolColor: String,
    hasTimeLimit: Boolean,
    isActive: Boolean,
  },
  computed: {
    humanReadableTime() {
      const time = Math.floor(this.player.timeLeft / 1000);
      const minutes = Math.floor(time / 60);
      const seconds = time % 60;
      return `${minutes}:${
        seconds == 0 ? "00" : seconds < 10 ? "0" + seconds : seconds
      }`;
    },
  },
  components: {
    AnonymIcon,
    InfinityIcon,
    GameStoneCircle,
    GameStoneCross,
    DotsIcon,
  },
  methods: {
    getSvgURL(svgName: string) {
      return require(`../assets/svg/profile_icons/${svgName}.svg`);
    },
  },
});
</script>
<style scoped></style>
