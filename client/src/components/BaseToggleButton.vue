<template>
  <button
    type="button"
    @click="$emit('toggle')"
    class=" px-3 py-2 border-2 border-transparent bg-gray-300 hover:bg-gray-400
    dark:hover:bg-gray-500 dark:bg-gray-600 shadow-md  rounded-lg
    flex
    place-items-center justify-center
     "
    :class="toggled ? 'border-gomoku-blue' : ''"
  >
    <slot></slot>
  </button>
</template>
<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  props: { toggled: Boolean },
  emits: ["toggle"],
});
</script>
