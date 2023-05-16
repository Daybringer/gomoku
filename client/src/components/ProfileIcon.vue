<template>
  <img class="h-8" alt="user_icon" :src="getSvgURL(profileIcon)" />
</template>
<script setup lang="ts">
import { ProfileIcon } from "@/shared/icons";
import { defineProps } from "vue";
defineProps<{ profileIcon: ProfileIcon }>();
function getSvgURL(svgName: string) {
  return require(`../assets/svg/profile_icons/${svgName}.svg`);
}
</script>
