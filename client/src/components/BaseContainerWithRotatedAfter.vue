<template>
  <div
    v-if="size === 'lg'"
    class="m-4 md:m-8 before:block before:absolute before:-inset-6 md:before:-inset-8 before:rounded-3xl relative inline-block before:opacity-75"
    :class="skew + ' ' + rotate + ' ' + colors">
    <div
      class="relative p-4 flex-1 flex flex-col justify-center shadow-lg bg-gray-50 dark:bg-gray-900 rounded-lg">
      <slot></slot>
    </div>
  </div>
  <div
    v-if="size === 'sm'"
    :class="skew + ' ' + rotate + ' ' + colors"
    class="m-5 before:block before:absolute before:-inset-3 before:rounded-3xl relative inline-block before:opacity-80">
    <div
      class="relative p-4 flex-1 flex flex-col justify-center shadow-lg bg-gray-50 dark:bg-gray-900 rounded-lg">
      <slot></slot>
    </div>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
const props = withDefaults(
  defineProps<{
    rotateLeft?: boolean;
    size?: "sm" | "lg";
    color?: "gomoku-blue" | "gomoku-pink" | "gray";
    darkColor?: string;
  }>(),
  {
    rotateLeft: false,
    size: "sm",
    color: "gomoku-blue",
    darkColor: "gomoku-blue",
  }
);

const skew = computed(() => {
  if (props.rotateLeft) {
    return "before:-skew-x-3";
  } else {
    return "before:skew-x-3";
  }
});
const rotate = computed(() => {
  if (props.size === "sm") {
    if (props.rotateLeft) {
      return "before:-rotate-3";
    } else {
      return "before:rotate-3";
    }
  } else {
    if (props.rotateLeft) {
      return "before:-rotate-1";
    } else {
      return "before:rotate-1";
    }
  }
});
const colors = computed(() => {
  if (props.color === "gomoku-pink") {
    return "before:bg-gomoku-pink dark:before:bg-gomoku-pink";
  } else if (props.color === "gomoku-blue") {
    return "before:bg-gomoku-blue dark:before:bg-gomoku-blue";
  } else {
    return "before:bg-gray-300 dark:before:bg-gray-500";
  }
});
</script>
