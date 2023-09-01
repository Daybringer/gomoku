<template>
  <div class="flex flex-row items-center gap-1 flex-wrap">
    <input
      type="checkbox"
      v-model="value"
      :name="name"
      class="h-4 w-4 text-gomoku-blue bg-gray-50 rounded cursor-pointer"
    />
    <label :for="name">{{ label }}</label>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";

const props = defineProps<{
  name: string;
  label: string;
  modelValue: boolean;
}>();

const emit = defineEmits(["update:modelValue"]);

const value = computed({
  get() {
    return props.modelValue;
  },
  set(value) {
    emit("update:modelValue", value);
  },
});
</script>
