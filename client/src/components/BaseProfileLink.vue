<template>
  <div
    @click="
      () => {
        if (logged) {
          router.push(link);
        }
      }
    "
    :class="logged ? 'cursor-pointer' : 'cursor-not-allowed'"
    class="flex flex-row place-items-center justify-center overflow-auto bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 hover:bg-gray-500 gap-1 rounded-lg py-1 px-4"
  >
    <ProfileIconComponent
      :profile-icon="logged ? profileIcon! : ProfileIcon.guest"
    />
    <span>{{ logged || forceShowUsername ? username : "Guest" }}</span>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed } from "vue";
import { ProfileIcon } from "@/shared/icons";
import ProfileIconComponent from "./ProfileIcon.vue";
import router from "@/router";
const props = defineProps<{
  logged: boolean;
  forceShowUsername?: boolean;
  userId?: number;
  username?: string;
  profileIcon?: ProfileIcon;
}>();

const link = computed(() => {
  return `/profile/${props.userId || ""}`;
});
</script>
