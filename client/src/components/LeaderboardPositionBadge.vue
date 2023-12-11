<template>
  <div class="relative flex justify-center items-center">
    <RosetteFilled
      :class="
        position === 1
          ? 'text-amber-400'
          : position === 2
          ? 'text-neutral-200'
          : position === 3
          ? 'text-yellow-700'
          : 'text-slate-800 dark:text-slate-900'
      " />
    <p
      class="font-medium dark:text-gray-800 absolute z-10"
      :class="
        position === 2
          ? 'text-gray-500'
          : position === 4
          ? 'dark:text-slate-400 text-gray-200'
          : 'text-gray-100'
      ">
      #{{ position }}
    </p>
  </div>
</template>
<script setup lang="ts">
import RosetteFilled from "@/assets/svg/RosetteFilled.vue";
defineProps<{ position: number }>();
</script>
