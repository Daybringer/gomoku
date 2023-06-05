<template>
  <div>
    <RouterLink v-if="logged" :to="link">
      <div
        class="flex flex-row place-items-center justify-center overflow-auto bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 dark:text-gray-50 hover:bg-gray-500 text-gray-900 gap-1 cursor-pointer rounded-lg py-1 px-2"
      >
        <ProfileIconComponent :profile-icon="profileIcon!" />
        <span>{{ username }}</span>
      </div>
    </RouterLink>

    <div
      v-if="!logged"
      class="flex flex-row place-items-center justify-center overflow-auto bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 dark:text-gray-50 hover:bg-gray-500 text-gray-900 gap-1 cursor-pointer rounded-lg py-1 px-2"
    >
      <ProfileIconComponent :profile-icon="ProfileIcon.guest" />
      <span>Guest</span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed } from "vue";
import { ProfileIcon } from "@/shared/icons";
import ProfileIconComponent from "./ProfileIcon.vue";
const props = defineProps<{
  username: string;
  logged: boolean;
  userID?: number;
  profileIcon?: ProfileIcon;
}>();

const link = computed(() => {
  return `/profile/${props.userID}`;
});
</script>
