<template>
  <router-link
    :to="to"
    :class="classObject"
    class="ml-4 px-3 py-2 border-2 rounded-md text-sm font-semibold leading-5 focus:outline-none transition duration-150 ease-in-out"
    ><slot></slot
  ></router-link>
</template>

<script setup lang="ts">
import { computed } from "vue";
const props = defineProps<{
  active: boolean;
  to: string;
  type: "primary" | "secondary";
}>();
const classObject = computed(() => {
  return {
    // Primary
    "border-gomoku-blue": props.type == "primary",
    "text-gray-300": props.type == "primary",
    "hover:bg-gomoku-blue": props.type == "primary",
    "hover:text-gray-800": props.type == "primary",
    "focus:bg-gomoku-blue": props.type == "primary",
    "focus:text-gray-800": props.type == "primary",
    // Primary Active
    "bg-gomoku-blue": props.active && props.type == "primary",
    "hover:bg-gomoku-blue-dark": props.active && props.type == "primary",
    "hover:border-gomoku-blue-dark": props.active && props.type == "primary",
    "text-gray-800": props.active && props.type == "primary",
    // Secondary
    "focus:bg-gray-700": props.type == "secondary",
    "focus:text-gray-50": props.type == "secondary",
    "hover:bg-gray-700": props.type == "secondary",
    "hover:text-gray-50": props.type == "secondary",
    "text-gray-200": props.type == "secondary",
    "border-transparent": props.type == "secondary",
    // Secondary Active
    "bg-gray-900": props.active && props.type == "secondary",
  };
});
</script>
