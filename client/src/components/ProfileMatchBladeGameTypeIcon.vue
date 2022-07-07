<template>
  <base-tooltip :content="tooltipContent">
    <SVGQuickIcon v-show="quick" />
    <SVGRankedIcon v-show="ranked" />
    <SVGCustomIcon v-show="custom" />
  </base-tooltip>
</template>

<script lang="ts">
import { GameType } from "@/shared/types";
import SVGQuickIcon from "@/components/SVGQuickIcon.vue";
import SVGRankedIcon from "@/components/SVGRankedIcon.vue";
import SVGCustomIcon from "@/components/SVGCustomIcon.vue";

import { defineComponent } from "vue";
import BaseTooltip from "./BaseTooltip.vue";
export default defineComponent({
  name: "ProfileMatchBladeGameTypeIcon",
  components: { SVGQuickIcon, SVGRankedIcon, SVGCustomIcon, BaseTooltip },
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
