<template>
  <div
    :class="backgroundTint === 'dark' ? 'bg-gray-700' : 'bg-gray-100'"
    class="h-full w-full flex flex-col text-gray-900 dark:bg-gray-700 dark:text-gray-50 py-6 px-4 sm:px-6 lg:px-8 "
  >
    <slot></slot>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
  components: {},
  props: { backgroundTint: String },
  data() {
    return {};
  },
});
</script>
