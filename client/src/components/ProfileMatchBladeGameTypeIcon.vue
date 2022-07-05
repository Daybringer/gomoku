<template>
  <div class="flex">
    <SVGQuickIcon v-show="quick" />
    <SVGRankedIcon v-show="ranked" />
    <SVGCustomIcon v-show="custom" />
  </div>
</template>

<script lang="ts">
import { GameType } from "@/shared/types";
import SVGQuickIcon from "@/components/SVGQuickIcon.vue";
import SVGRankedIcon from "@/components/SVGRankedIcon.vue";
import SVGCustomIcon from "@/components/SVGCustomIcon.vue";

import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfileMatchBladeGameTypeIcon",
  components: { SVGQuickIcon, SVGRankedIcon, SVGCustomIcon },
  props: { gameType: String },
  computed: {
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
