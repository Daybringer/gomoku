<template>
  <div
    :class="
      placeItems === 'start' ? 'md:place-items-start' : 'md:place-items-center'
    "
    class="min-height-screen-calc h-0 flex-1 flex place-items-start justify-center bg-gray-100 text-gray-900 dark:bg-gray-700 dark:text-gray-50 py-6 px-4 sm:px-6 lg:px-8 "
  >
    <slot></slot>
  </div>
</template>

<script lang="ts">
// Utils
import { defineComponent } from "vue";
export default defineComponent({
  name: "ViewBase",
  props: {
    placeItems: {
      type: String,
      validate: (val: string) => {
        ["start", "center"].indexOf(val) !== -1;
      },
    },
  },
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
