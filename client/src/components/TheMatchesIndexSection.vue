<template>
  <BaseView class="bg-gray-200">
    <IntersectionObserver @intersect="emit('intersect')" />
    <div class="w-90 md:w-50 flex items-center flex-col gap-12 mt-12 mb-32">
      <RouterLink
        class="focus:scale-105 hover:scale-105 transition-transform"
        :to="'/search?type=quick'"
      >
        <BaseContainerWithRotatedAfter>
          <BaseMidHeadline>Quick game</BaseMidHeadline>
          <BaseHRDivider />
          <p class="text-center text-lg my-2">
            Fight against the clock in this short and brisk game mode. NO NEED
            to log in, just <span class="font-semibold">PRESS</span> this button
            <span class="font-semibold">TO PLAY</span>.

            <br />
            <span class="italic text-gray-500">
              (Even if you are logged in, you won't loose ELO in this gamemode.)
            </span>
          </p>
          <div
            class="flex flex-row flex-wrap justify-center gap-4 md:gap-8 mt-8 dark:bg-gray-800 p-2 rounded-xl"
          >
            <BaseInfoPill title="Opening">STANDARD</BaseInfoPill>
            <BaseInfoPill title="Time limit">2:30</BaseInfoPill>
            <BaseInfoPill title="Game type"
              ><MatchRecordGameTypeIcon :game-type="GameType.Quick"
            /></BaseInfoPill>
          </div>
        </BaseContainerWithRotatedAfter>
      </RouterLink>
      <RouterLink
        class="focus:scale-105 hover:scale-105 transition-transform"
        :to="'/search?type=ranked'"
      >
        <BaseContainerWithRotatedAfter :rotate-left="true">
          <BaseMidHeadline>Ranked game</BaseMidHeadline>
          <BaseHRDivider />
          <p class="text-center text-lg my-2">
            Queue up against skilled foes, fight for precious ELO and conquer
            the leaderboards.
          </p>
          <div
            class="flex flex-row flex-wrap justify-center gap-4 md:gap-8 mt-8 dark:bg-gray-800 p-2 rounded-xl"
          >
            <BaseInfoPill title="Opening">SWAP 1</BaseInfoPill>
            <BaseInfoPill title="Time limit">10:00</BaseInfoPill>
            <BaseInfoPill title="Game type"
              ><MatchRecordGameTypeIcon :game-type="GameType.Ranked"
            /></BaseInfoPill>
          </div>
        </BaseContainerWithRotatedAfter>
      </RouterLink>
      <RouterLink
        class="focus:scale-105 hover:scale-105 transition-transform"
        :to="'/custom'"
      >
        <BaseContainerWithRotatedAfter>
          <BaseMidHeadline>Custom game</BaseMidHeadline>
          <BaseHRDivider />
          <p class="text-center text-lg my-2">
            Do you want to play with your friend and with your own settings. Now
            you can!
            <br />
            With Custom games you can choose your favorite time limit, opening
            and other different settings.
          </p>
          <div
            class="flex flex-row flex-wrap justify-center gap-4 md:gap-8 mt-8 dark:bg-gray-800 p-2 rounded-xl"
          >
            <BaseInfoPill title="Opening"
              >UP TO<span
                class="font-semibold italic text-lg text-gomoku-pink dark:text-gomoku-blue"
                >&nbsp;YOU</span
              ></BaseInfoPill
            >
            <BaseInfoPill title="Time limit"
              >UP TO<span
                class="font-semibold italic text-lg text-gomoku-pink dark:text-gomoku-blue"
                >&nbsp;YOU</span
              >
            </BaseInfoPill>
            <BaseInfoPill title="Game type"
              ><MatchRecordGameTypeIcon :game-type="GameType.Custom"
            /></BaseInfoPill>
          </div>
        </BaseContainerWithRotatedAfter>
      </RouterLink></div
  ></BaseView>
</template>

<script setup lang="ts">
import { GameType } from "@/shared/types";
import BaseContainerWithRotatedAfter from "./BaseContainerWithRotatedAfter.vue";
import BaseHRDivider from "./BaseHRDivider.vue";
import BaseInfoPill from "./BaseInfoPill.vue";
import BaseMidHeadline from "./BaseMidHeadline.vue";
import MatchRecordGameTypeIcon from "./MatchRecordGameTypeIcon.vue";
import BaseView from "./BaseView.vue";
import IntersectionObserver from "./IntersectionObserver.vue";
const emit = defineEmits<{
  (e: "intersect");
}>();
</script>
