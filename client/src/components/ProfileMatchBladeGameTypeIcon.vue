<template>
  <base-tooltip :content="tooltipContent">
    <MatchQuickIcon v-show="quick" />
    <MatchCustomIcon v-show="custom" />
    <MatchRankedIcon v-show="ranked" />
  </base-tooltip>
</template>

<script lang="ts">
import { GameType } from "@/shared/types";
import MatchQuickIcon from "@/assets/svg/MatchQuickIcon.vue";
import MatchRankedIcon from "@/assets/svg/MatchRankedIcon.vue";
import MatchCustomIcon from "@/assets/svg/MatchCustomIcon.vue";

import { defineComponent } from "vue";
import BaseTooltip from "./BaseTooltip.vue";
export default defineComponent({
  name: "GameTypeIcon",
  components: { MatchQuickIcon, MatchCustomIcon, MatchRankedIcon, BaseTooltip },
  props: { gameType: String },
  computed: {
    tooltipContent(): string {
      if (this.quick) {
        return "Quick";
      } else if (this.ranked) {
        return "Ranked";
      } else if (this.custom) {
        return "Custom";
      } else {
        return "";
      }
    },
    quick(): boolean {
      return this.gameType == GameType.Quick;
    },
    ranked(): boolean {
      return this.gameType === GameType.Ranked;
    },
    custom(): boolean {
      return this.gameType === GameType.Custom;
    },
  },
});
</script>
