<template>
  <img class="h-8" alt="user_icon" :src="svgURL" />
</template>
<script setup lang="ts">
import { ProfileIcon } from "@/shared/icons";
import { defineProps, computed } from "vue";
const props = defineProps<{ profileIcon: ProfileIcon }>();
const svgURL = computed(() => {
  return new URL(
    `../assets/svg/profile_icons/${props.profileIcon}.svg`,
    import.meta.url
  ).href;
});
</script>
