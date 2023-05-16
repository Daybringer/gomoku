<template>
  <router-link :to="`/game/${gameID}`">
    <div
      class="col-span-1 w-8 h-8 rounded-full bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-50 hover:bg-gray-500 text-gray-900 cursor-pointer p-1"
    >
      <WatchIcon />
    </div>
  </router-link>
</template>
<script setup lang="ts">
import { defineProps } from "vue";
import WatchIcon from "@/assets/svg/WatchIcon.vue";
defineProps<{ gameID: number }>();
</script>
