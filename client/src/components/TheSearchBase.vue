<template>
  <view-base>
    <div class="h-full w-full text-center">
      <h1 class="text-gray-900 dark:text-gray-100 text-4xl p-4 font-bold">
        Searching
      </h1>
      <span class="text-gray-800 dark:text-gray-200 text-3xl">{{
        timeToShow
      }}</span>
      <swing-animation />
    </div>
  </view-base>
</template>

<script setup lang="ts">
// Components
import ViewBase from "@/components/ViewBaseFixedHeight.vue";
import SwingAnimation from "@/assets/svg/SwingAnimation.vue";
import { ref, computed, onMounted, onBeforeMount } from "vue";
const interval = ref(0);
const currentTime = ref();
const minutes = computed(() => {
  return Math.floor((currentTime.value % (1000 * 60 * 60)) / (1000 * 60));
});
const seconds = computed(() => {
  return Math.floor((currentTime.value % (1000 * 60)) / 1000);
});
const timeToShow = computed(() => {
  return `${minutes.value}:${seconds.value < 10 ? "0" : ""}${seconds.value}`;
});
function timeChange() {
  currentTime.value += 1000;
}
onMounted(() => {
  interval.value = window.setInterval(timeChange, 1000);
});
onBeforeMount(() => {
  clearInterval(interval.value);
});
</script>

<style scoped>
.swing-animation {
  width: 45vh;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 3rem;
}
@media only screen and (min-width: 768px) {
  .swing-animation {
    width: 50vh;
  }
}
</style>
