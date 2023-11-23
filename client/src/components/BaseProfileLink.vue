<template>
  <BaseButton
    :disabled="!userId"
    :link="link"
    class="gap-1"
    style="padding-top: 4px; padding-bottom: 4px">
    <ProfileIconComponent :profile-icon="profileIcon" />
    <span>{{ username }}</span>
  </BaseButton>
</template>
<script setup lang="ts">
import { computed } from "vue";
import { ProfileIcon } from "@/shared/icons";
import ProfileIconComponent from "./ProfileIcon.vue";
import BaseButton from "./BaseButton.vue";
const props = defineProps<{
  username: string;
  profileIcon: ProfileIcon;
  userId?: number;
}>();
const link = computed(() => {
  return `/profile/${props.userId || 0}`;
});
</script>
