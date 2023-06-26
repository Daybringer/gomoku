<template>
  <div
    @click="
      () => {
        if (player && player.logged) {
          router.push(link);
        }
      }
    "
    :class="player && player.logged ? 'cursor-pointer' : 'cursor-not-allowed'"
    class="flex flex-row place-items-center justify-center overflow-auto bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 hover:bg-gray-500 gap-1 rounded-lg py-1 px-4"
  >
    <ProfileIconComponent
      :profile-icon="player ? player.profileIcon : ProfileIcon.guest"
    />
    <span>{{ player ? player.username : "Guest" }}</span>
  </div>
</template>
<script setup lang="ts">
import { defineProps, computed } from "vue";
import { ProfileIcon } from "@/shared/icons";
import ProfileIconComponent from "./ProfileIcon.vue";
import { Player } from "@/shared/types";
import router from "@/router";
const props = defineProps<{
  player?: Player;
}>();

const link = computed(() => {
  return `/profile/${props.player?.userID}`;
});
</script>
