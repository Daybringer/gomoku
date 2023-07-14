<template>
  <ViewBaseResponsive class="bg-gray-200">
    <div class="w-90 md:w-50 flex flex-col gap-12">
      <RouterLink
        class="focus:scale-105 hover:scale-105 transition-transform"
        :to="'/search?type=quick'"
      >
        <BaseContainerWithRotatedAfter>
          <BaseMidHeadline>Quick game</BaseMidHeadline>
          <BaseHRDivider />
          <p class="text-center text-lg my-2">
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
            laudantium repudiandae quia reprehenderit nesciunt tempora atque
            maxime repellendus ex.
          </p>
          <div
            class="flex flex-row flex-wrap justify-center gap-8 mt-8 dark:bg-gray-800 p-2 rounded-xl"
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
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
            laudantium repudiandae quia reprehenderit nesciunt tempora atque
            maxime repellendus ex.
          </p>
          <div
            class="flex flex-row flex-wrap justify-center gap-8 mt-8 dark:bg-gray-800 p-2 rounded-xl"
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
            Lorem ipsum dolor, sit amet consectetur adipisicing elit. Soluta
            laudantium repudiandae quia reprehenderit nesciunt tempora atque
            maxime repellendus ex.
          </p>
          <div
            class="flex flex-row flex-wrap justify-center gap-8 mt-8 dark:bg-gray-800 p-2 rounded-xl"
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
  ></ViewBaseResponsive>
</template>

<script setup lang="ts">
import { GameType } from "@/shared/types";
import BaseContainerWithRotatedAfter from "./BaseContainerWithRotatedAfter.vue";
import BaseHRDivider from "./BaseHRDivider.vue";
import BaseInfoPill from "./BaseInfoPill.vue";
import BaseMidHeadline from "./BaseMidHeadline.vue";
import MatchRecordGameTypeIcon from "./MatchRecordGameTypeIcon.vue";
import ViewBaseResponsive from "./ViewBaseResponsive.vue";
</script>
