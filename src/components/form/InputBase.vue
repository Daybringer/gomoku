<template>
  <input
    :value="modelValue"
    @input="$emit('update:modelValue', $event.target.value)"
    :type="type"
    :autocomplete="autocomplete"
    class="w-full mt-2 py-1 px-2 rounded-md block border-2 border-gray-300 border-opacity-50 shadow-sm text-xl text-gray-900 focus:outline-none focus:border-gomoku-blue focus:ring-gomoku-blue focus:ring-1 dark:bg-gray-50
   dark:border-gray-300"
    :class="classList"
    :title="error || (modelValue ? '✓' : title)"
    :placeholder="placeholder"
  />
</template>
// TODO better title support
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "InputBase",
  props: {
    modelValue: {},
    name: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: false,
    },
    error: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    autocomplete: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
  },
  emits: ["update:modelValue"],
  computed: {
    classList() {
      return `${this.applyValidStyles} ${this.applyErrorStyles}`;
    },
    applyValidStyles(): string {
      if (this.error) return "border-red-500 ring-2 ring-red-500";
      return "";
    },
    applyErrorStyles() {
      if (!this.error && this.modelValue)
        return "border-green-500 ring-2 ring-green-500";
      return "";
    },
  },
});
</script>

<style></style>
