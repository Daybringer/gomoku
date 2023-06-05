<template>
  <div
    class="px-6 py-2 rounded-lg text-lg"
    :class="isDark ? 'bg-gray-700' : 'bg-gray-50 dark:bg-gray-600'"
  >
    <slot></slot>
  </div>
</template>
<script setup lang="ts">
defineProps<{
  isDark?: boolean;
}>();
</script>
