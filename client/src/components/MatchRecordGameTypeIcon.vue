<template>
  <base-tooltip :content="tooltipContent">
    <MatchQuickIcon v-show="gameType === GameType.Quick" />
    <MatchCustomIcon v-show="gameType === GameType.Custom" />
    <MatchRankedIcon v-show="gameType === GameType.Ranked" />
  </base-tooltip>
</template>

<script setup lang="ts">
import { GameType } from "@/shared/types";
import MatchQuickIcon from "@/assets/svg/MatchQuickIcon.vue";
import MatchRankedIcon from "@/assets/svg/MatchRankedIcon.vue";
import MatchCustomIcon from "@/assets/svg/MatchCustomIcon.vue";
import BaseTooltip from "./BaseTooltip.vue";
import { computed, defineProps } from "vue";

const props = defineProps<{ gameType: GameType }>();
const tooltipContent = computed(() => props.gameType);
</script>
