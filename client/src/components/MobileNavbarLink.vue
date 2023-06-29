<template>
  <router-link
    :to="to"
    class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
    :class="active ? 'bg-gray-900' : ''"
    ><slot></slot
  ></router-link>
</template>
<script setup lang="ts">
defineProps<{
  active: boolean;
  to: string;
}>();
</script>
