<template>
  <button
    type="button"
    @click="$emit('toggle')"
    :disabled="disabled"
    class="px-3 py-2 border-4 bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-700 dark:bg-gray-600 shadow-md rounded-lg"
    :class="
      (toggled
        ? 'border-gomoku-blue dark:border-gomoku-blue border-opacity-90'
        : ' dark:border-gray-500 border-gray-200') +
      ' ' +
      (disabled ? 'opacity-70 cursor-not-allowed' : '')
    ">
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
defineProps<{ toggled: boolean; disabled?: boolean }>();
defineEmits(["toggle"]);
</script>
