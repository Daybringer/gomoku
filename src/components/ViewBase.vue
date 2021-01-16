<template>
  <div
    class="min-height-screen-calc h-0 flex place-items-start md:place-items-center justify-center bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50 py-6 px-4 sm:px-6 lg:px-8 "
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
// Utils
import { defineComponent } from "vue";
export default defineComponent({
  name: "ViewBase",
  data() {
    return {};
  },
  components: {},
});
</script>

<style scoped>
.min-height-screen-calc {
  min-height: calc(100vh - 4rem);
}
</style>
