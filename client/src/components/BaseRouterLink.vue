<template>
  <router-link
    class="text-lg text-gomoku-blue hover:text-gomoku-blue-dark focus:text-gomoku-blue-dark focus:outline-none"
    :to="to"
    ><slot></slot
  ></router-link>
</template>
<script setup lang="ts">
defineProps<{ to: string }>();
</script>
