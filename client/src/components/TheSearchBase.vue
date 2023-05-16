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

<script lang="ts">
// Components
import ViewBase from "@/components/ViewBaseFixedHeight.vue";
import SwingAnimation from "@/assets/svg/SwingAnimation.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "SearchBase",
  components: { ViewBase, SwingAnimation },
  data() {
    return {
      interval: 0,
      currentTime: 0,
    };
  },
  computed: {
    minutes(): number {
      return Math.floor((this.currentTime % (1000 * 60 * 60)) / (1000 * 60));
    },
    seconds(): number {
      return Math.floor((this.currentTime % (1000 * 60)) / 1000);
    },
    timeToShow(): string {
      return `${this.minutes}:${this.seconds < 10 ? "0" : ""}${this.seconds}`;
    },
  },
  methods: {
    timeChange() {
      this.currentTime += 1000;
    },
  },
  mounted(): void {
    this.interval = window.setInterval(this.timeChange, 1000);
  },
  beforeUnmount() {
    clearInterval(this.interval);
  },
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
