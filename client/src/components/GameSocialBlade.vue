<template>
  <div
    class="bg-white  border-4 dark:bg-gray-500 w-full rounded-full min-h-12 flex flex-row items-center justify-between overflow-hidden shadow-md"
    :style="isActive ? `border-color: ${symbolColor};` : ''"
  >
    <game-stone-cross-svg
      class="h-8 w-8 mx-3"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'cross'"
    />
    <game-stone-circle-svg
      class="h-8 w-8 mx-3"
      :style="`color:${symbolColor};`"
      v-show="symbol === 'circle'"
    />
    <dots-icon-svg class="h-8 w-8 mx-3" v-show="symbol === ''" />

    <div
      class="flex-1 flex justify-center text-center text-xl text-gray-900 dark:text-gray-100"
    >
      {{ hasTimeLimit ? humanReadableTime : "" }}
      <infinity-icon-svg class="h-8 self-center" v-show="!hasTimeLimit" />
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
        <anonym-icon-svg
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
import InfinityIconSvg from "@/assets/svg/InfinityIconSvg.vue";
import AnonymIconSvg from "@/assets/svg/AnonymIconSvg.vue";
import GameStoneCircleSvg from "@/assets/svg/GameStoneCircleSvg.vue";
import GameStoneCrossSvg from "@/assets/svg/GameStoneCross.svg.vue";
import DotsIconSvg from "@/assets/svg/DotsIconSvg.vue";

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
    AnonymIconSvg,
    InfinityIconSvg,
    GameStoneCircleSvg,
    GameStoneCrossSvg,
    DotsIconSvg,
  },
  methods: {
    getSvgURL(svgName: string) {
      return require(`../assets/svg/profile_icons/${svgName}.svg`);
    },
  },
});
</script>
<style scoped></style>
