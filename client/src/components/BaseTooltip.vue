<template>
  <div class="relative">
    <div
      @mouseenter="this.setTooltipActive(true)"
      @mouseleave="this.setTooltipActive(false)"
      @click="this.toggleTooltipActive"
    >
      <slot></slot>
    </div>
    <transition name="slide">
      <div
        v-show="tooltipActive"
        class="bg-gray-200 rounded-lg absolute z-10  mt-2 py-2 px-6   text-gray-900"
      >
        <span v-html="content"> </span>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "BaseTooltip",
  props: {
    content: String,
  },
  data() {
    return {
      tooltipActive: false,
    };
  },
  methods: {
    setTooltipActive(active: boolean) {
      this.tooltipActive = active;
    },
    toggleTooltipActive() {
      this.tooltipActive = !this.tooltipActive;
    },
  },
});
</script>
<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-8px);
}
</style>
