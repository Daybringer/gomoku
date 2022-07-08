<template>
  <base-tooltip :content="tooltipText">
    <SVGLoseIcon v-show="!win && !tie" class="text-red-500" />
    <SVGVictoryIcon class="text-yellow-400" v-show="win && !tie" />
    <SVGTieIcon v-show="tie" />
    <!-- <p v-show="tie" class="text-3xl px-2 font-extrabold">-</p> -->
  </base-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SVGLoseIcon from "@/components/SVGLoseIcon.vue";
import SVGVictoryIcon from "@/components/SVGVictoryIcon.vue";
import SVGTieIcon from "@/components/SVGTieIcon.vue";
import BaseTooltip from "@/components/BaseTooltip.vue";
export default defineComponent({
  name: "ProfileMatchBladeWinLoseIcon",
  components: { SVGLoseIcon, SVGVictoryIcon, SVGTieIcon, BaseTooltip },
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
