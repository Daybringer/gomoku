<template>
  <div class="flex">
    <SVGLoseIcon v-show="!win && !tie" class="text-red-500" />
    <SVGVictoryIcon class="text-yellow-400" v-show="win && !tie" />
    <span v-show="tie" class="text-2xl font-extrabold">-</span>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import SVGLoseIcon from "@/components/SVGLoseIcon.vue";
import SVGVictoryIcon from "@/components/SVGVictoryIcon.vue";
export default defineComponent({
  name: "ProfileMatchBladeWinLoseIcon",
  components: { SVGLoseIcon, SVGVictoryIcon },
  props: { win: Boolean, tie: Boolean },
});
</script>
