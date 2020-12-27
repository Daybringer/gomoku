<template>
  <router-link
    :to="to"
    class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
    :class="{ 'bg-gray-900': active }"
    ><slot></slot></router-link
></template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "MobileNavbarLink",
  props: {
    active: Boolean,
    to: String,
  },
});
</script>
