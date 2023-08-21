<template>
  <input
    class="h-full bg-transparent placeholder-gray-400 w-full p-0 border-0 border-b-2 border-gray-500 dark:border-gray-300 text-gray-900 dark:text-gray-50 text-lg float-left focus:border-gomoku-blue dark:focus:border-gomoku-blue focus:ring-transparent"
    type="text"
    v-model="value"
    placeholder="Write a message"
    @keyup.enter="emit('enter-pressed')"
  />
</template>
<script lang="ts" setup>
import { computed } from "vue";

const props = defineProps<{ modelValue: string }>();
const emit = defineEmits(["update:modelValue", "enter-pressed"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
