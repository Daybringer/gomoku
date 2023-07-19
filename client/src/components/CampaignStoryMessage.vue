<template>
  <div
    class="flex flex-col bg-gray-200 dark:bg-gray-800 rounded-2xl p-2 md:flex-row w-full gap-4 md:gap-8"
  >
    <img
      class="w-32 h-32 bg-gray-300 dark:bg-gray-600 p-1 rounded-2xl"
      :src="svgURL"
    />
    <p class="text-xl md:text-2xl">
      <slot> </slot>
    </p>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  svg: string;
}>();
const svgURL = computed(() => {
  return new URL(`../assets/svg/campaign/${props.svg}.svg`, import.meta.url)
    .href;
});
</script>

<style scoped></style>
