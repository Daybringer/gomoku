<template>
  <base-tooltip :content="tooltipText">
    <lose-icon v-show="!win && !tie" class="text-red-500" />
    <victory-icon class="text-yellow-400" v-show="win && !tie" />
    <tie-icon v-show="tie" />
  </base-tooltip>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import LoseIcon from "@/assets/svg/LoseIcon.vue";
import VictoryIcon from "@/assets/svg/VictoryIcon.vue";
import TieIcon from "@/assets/svg/TieIcon.vue";
import BaseTooltip from "@/components/BaseTooltip.vue";
export default defineComponent({
  name: "ProfileMatchBladeWinLoseIcon",
  components: { LoseIcon, VictoryIcon, TieIcon, BaseTooltip },
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
