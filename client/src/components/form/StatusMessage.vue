<template>
  <div
    class="px-4 py-2 w-full rounded-md"
    :class="type === 'error' ? 'bg-red-500' : 'bg-green-500'"
  >
    <p class="text-white leading-6">{{ text }}</p>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "StatusMessage",
  props: {
    text: String,
    type: {
      type: String,
      validate: (val: string) => {
        ["error", "success"].indexOf(val) !== -1;
      }
    }
  }
});
</script>

<style scoped></style>
