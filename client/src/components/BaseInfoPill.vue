<template>
  <div>
    <div class="flex flex-row bg-gray-300 dark:bg-gray-600 rounded-md border-0">
      <div
        class="flex items-center rounded-l-md bg-gray-800 dark:bg-gray-900 text-lg text-white p-3"
      >
        <span>
          {{ title }}
        </span>
      </div>
      <div class="flex items-center px-2">
        <slot></slot>
      </div>
    </div>
  </div>
</template>
<script setup lang="ts">
defineProps<{ title: string }>();
</script>
