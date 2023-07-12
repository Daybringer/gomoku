<template>
  <BaseTooltip :content="tooltipText">
    <LoseIcon v-show="!win && !tie" class="text-red-500" />
    <VictoryIcon class="text-yellow-400" v-show="win && !tie" />
    <TieIcon v-show="tie" />
  </BaseTooltip>
</template>

<script setup lang="ts">
import { computed } from "vue";
import LoseIcon from "@/assets/svg/LoseIcon.vue";
import VictoryIcon from "@/assets/svg/VictoryIcon.vue";
import TieIcon from "@/assets/svg/TieIcon.vue";
import BaseTooltip from "@/components/BaseTooltip.vue";

const props = defineProps<{ win: boolean; tie: boolean }>();
const tooltipText = computed(() => {
  if (props.tie) return "Tie";
  if (props.win) return "Win";
  return "Lose";
});
</script>
