<template>
  <div
    class="m-4 md:m-8 before:block before:absolute before:-inset-6 md:before:-inset-8 before:rounded-3xl relative inline-block before:opacity-75"
    :class="
      rotateLeft
        ? 'before:-skew-x-3 before:-rotate-1 before:bg-gomoku-pink'
        : 'before:skew-x-3 before:rotate-1 before:bg-gomoku-blue'
    "
  >
    <div
      class="relative p-8 flex flex-col justify-center shadow-lg bg-gray-50 dark:bg-gray-900 shadow-lg rounded-xl"
    >
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
withDefaults(defineProps<{ rotateLeft?: boolean }>(), { rotateLeft: false });
</script>
