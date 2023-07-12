<template>
  <div
    @click="
      () => {
        if (isLogged) {
          router.push(link);
        }
      }
    "
    :class="isLogged ? 'cursor-pointer' : 'cursor-not-allowed'"
    class="flex flex-row place-items-center justify-center overflow-auto bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 hover:bg-gray-500 gap-1 rounded-lg py-1 px-4"
  >
    <ProfileIconComponent :profile-icon="profileIcon" />
    <span>{{ username }}</span>
  </div>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { ProfileIcon } from "@/shared/icons";
import ProfileIconComponent from "./ProfileIcon.vue";
import router from "@/router";
const props = defineProps<{
  isLogged: boolean;
  username: string;
  profileIcon: ProfileIcon;
  userId?: number;
}>();
const link = computed(() => {
  return `/profile/${props.userId || 0}`;
});
</script>
