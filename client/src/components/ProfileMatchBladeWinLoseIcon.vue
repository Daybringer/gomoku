<template>
  <base-tooltip :content="tooltipText">
    <SVGLoseIcon v-show="!win && !tie" class="text-red-500" />
    <SVGVictoryIcon class="text-yellow-400" v-show="win && !tie" />
    <span v-show="tie" class="text-2xl font-extrabold">-</span>
  </base-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SVGLoseIcon from "@/components/SVGLoseIcon.vue";
import SVGVictoryIcon from "@/components/SVGVictoryIcon.vue";
import BaseTooltip from "@/components/BaseTooltip.vue";
export default defineComponent({
  name: "ProfileMatchBladeWinLoseIcon",
  components: { SVGLoseIcon, SVGVictoryIcon, BaseTooltip },
  props: { win: Boolean, tie: Boolean },
  computed: {
    tooltipText(): string {
      if (!this.win && !this.tie) {
        return `Lose`;
      } else if (this.win && !this.tie) {
        return `Win`;
      } else {
        return `Tie`;
      }
    },
  },
});
</script>
