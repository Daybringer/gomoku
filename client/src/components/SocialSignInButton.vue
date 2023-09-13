<template>
  <button
    type="button"
    :disabled="isDisabled"
    class="border-2 border-gray-200 shadow-md text-gray-500 dark:text-gray-300 rounded-lg px-10 py-2"
    :class="
      isDisabled
        ? 'cursor-not-allowed'
        : 'dark:hover:text-gomoku-blue hover:text-gomoku-blue hover:border-gomoku-blue focus:text-gomoku-blue dark:focus:text-gomoku-blue focus:border-gomoku-blue focus:outline-none'
    "
  >
    <slot></slot>
  </button>
</template>
<script setup lang="ts">
defineProps<{ isDisabled?: boolean }>();
</script>
