<template>
  <BaseTooltip v-if="gameEnding === EndingType.Time" content="Time ran out">
    <HourglassIcon class="h-8" />
  </BaseTooltip>
  <BaseTooltip
    v-if="gameEnding === EndingType.Combination"
    content="Combination"
  >
    <FiveCombinationIcon class="h-8" />
  </BaseTooltip>
  <BaseTooltip v-if="gameEnding === EndingType.Surrender" content="Disconnect">
    <NoWifiIcon class="h-8" />
  </BaseTooltip>
  <BaseTooltip v-if="gameEnding === EndingType.Tie" content="Tie">
    ---
  </BaseTooltip>
</template>

<script setup lang="ts">
import HourglassIcon from "@/assets/svg/HourglassIcon.vue";
import { EndingType } from "@/shared/types";
import BaseTooltip from "./BaseTooltip.vue";
import FiveCombinationIcon from "@/assets/svg/FiveCombinationIcon.vue";
import NoWifiIcon from "@/assets/svg/NoWifiIcon.vue";
defineProps<{ gameEnding: EndingType }>();
</script>
