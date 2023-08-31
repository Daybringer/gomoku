<template>
  <div>
    <label v-if="label" :for="name" class="text-lg">{{ label }}</label>
    <input
      v-model="value"
      :type="type"
      :autocomplete="type"
      class="w-full mt-1 py-1 px-2 rounded-md block border-2 border-gray-300 dark:border-gray-600 shadow-sm text-xl text-gray-800 focus:outline-none focus:border-gomoku-blue focus:ring-gomoku-blue focus:ring-1 dark:bg-gray-200"
      :class="classList"
      :title="error ? error : title"
      :placeholder="placeholder"
      @blur="emit('blur')"
      @keyup.enter="emit('enter')"
      @keyup="emit('keyup')"
    />
    <p class="h-4 italic text-red-400">{{ error }}</p>
  </div>
</template>
<script setup lang="ts">
type InputType =
  | "text"
  | "search"
  | "tel"
  | "email"
  | "date"
  | "time"
  | "number"
  | "range"
  | "color"
  | "password";
import { computed } from "vue";
const props = defineProps<{
  modelValue: string;
  name: string;
  title: string;
  error: string;
  type: InputType;
  label?: string;
  placeholder?: string;
}>();
const emit = defineEmits(["update:modelValue", "keyup", "enter", "blur"]);
const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});

const classList = computed(() => {
  if (props.error) return "border-red-500 dark:border-red-500";
});
</script>
