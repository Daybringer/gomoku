<template>
  <div
    class="bg-white dark:bg-gray-600 text-lg w-full rounded-lg h-16 p-2 flex gap-1 items-center md:flex-row justify-around shadow-md">
    <LeaderboardPositionBadge :position="user.statistics.leaderboardPosition" />
    <p>{{ user.elo }} ELO</p>
    <BaseProfileLink
      :profile-icon="user.settings.selectedIcon"
      :user-id="user.id"
      :username="user.username" />
  </div>
</template>
<script setup lang="ts">
import { User } from "@/shared/interfaces/user.interface";
import BaseProfileLink from "./BaseProfileLink.vue";
import LeaderboardPositionBadge from "./LeaderboardPositionBadge.vue";

defineProps<{
  user: User;
}>();
</script>
