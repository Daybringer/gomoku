<template>
  <router-link :to="link">
    <div
      class="flex flex-row place-items-center justify-start overflow-auto bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 dark:text-gray-50 hover:bg-gray-500 text-gray-900 gap-1 cursor-pointer rounded-lg py-1 px-2"
    >
      <anonym-circle-icon v-if="!logged" />
      <!-- TODO implement showing user icon -->
      <!-- <rounded-small-user-icon v-if="logged"></rounded-small-user-icon -->
      <span>{{ logged ? username : "Guest" }}</span>
    </div>
  </router-link>
</template>
<script setup lang="ts">
import { defineProps, computed } from "vue";
import AnonymCircleIcon from "@/assets/svg/AnonymCircleIcon.vue";
import { ProfileIcon } from "@/shared/icons";
const props = defineProps<{
  username: string;
  logged: boolean;
  userID: number;
  profileIcon: ProfileIcon;
}>();

const link = computed(() => {
  return `/profile/${props.userID}`;
});
</script>
