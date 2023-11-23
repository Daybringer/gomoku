<template>
  <RouterLink
    v-if="link && !disabled"
    :to="link"
    class="py-1.5 px-3 shadow-md rounded-lg flex place-items-center justify-center"
    :class="
      gomokuBlue
        ? 'bg-gomoku-blue text-gray-100 hover:bg-gomoku-blue-dark font-medium'
        : 'bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 dark:bg-gray-600'
    ">
    <slot />
  </RouterLink>
  <button
    v-else
    type="button"
    :disabled="disabled"
    class="py-1.5 px-3 shadow-md rounded-lg flex place-items-center justify-center disabled:opacity-80 disabled:cursor-not-allowed"
    :class="
      gomokuBlue
        ? 'bg-gomoku-blue text-gray-100 hover:bg-gomoku-blue-dark font-medium'
        : 'bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 dark:bg-gray-600'
    ">
    <slot />
  </button>
</template>
<script setup lang="ts">
defineProps<{
  gomokuBlue?: boolean;
  link?: string;
  disabled?: boolean;
}>();
</script>
