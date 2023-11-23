<template>
  <div class="relative flex justify-center items-center h-full">
    <RosetteFilled
      :class="
        position === 1
          ? 'text-amber-400'
          : position === 2
          ? 'text-neutral-400'
          : position === 3
          ? 'text-yellow-700'
          : 'text-slate-800'
      " />
    <p class="text-gray-100 font-medium dark:text-gray-600 absolute z-10">
      #{{ position }}
    </p>
  </div>
</template>
<script setup lang="ts">
import RosetteFilled from "@/assets/svg/RosetteFilled.vue";
defineProps<{ position: number }>();
</script>
