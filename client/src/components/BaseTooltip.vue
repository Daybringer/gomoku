<template>
  <div class="relative">
    <div
      @mouseenter="setTooltipActive(true)"
      @mouseleave="setTooltipActive(false)"
      @touchstart="setTooltipActive(!tooltipActive)"
      ref="some"
    >
      <slot></slot>
    </div>
    <transition name="slide">
      <div
        v-show="tooltipActive"
        class="bg-gray-200 rounded-lg absolute z-10 mt-2 py-2 px-6 text-gray-900"
      >
        <span v-html="content"> </span>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
defineProps<{ content: string }>();
const tooltipActive = ref(false);
function setTooltipActive(active: boolean) {
  tooltipActive.value = active;
}
const some = ref();
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
