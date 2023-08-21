<template>
  <div
    class="bg-white dark:bg-gray-600 text-lg w-full rounded-lg h-16 p-2 flex gap-1 items-center md:flex-row justify-around shadow-md"
  >
    <div class="relative flex justify-center items-center h-full">
      <RosetteFilled
        :class="
          user.statistics.leaderboardPosition === 1
            ? 'text-amber-400'
            : user.statistics.leaderboardPosition === 2
            ? 'text-neutral-400'
            : user.statistics.leaderboardPosition === 3
            ? 'text-yellow-700'
            : 'text-slate-800'
        "
      />
      <p class="text-gray-100 font-medium absolute z-10">
        #{{ user.statistics.leaderboardPosition }}
      </p>
    </div>
    <p>{{ user.elo }} ELO</p>
    <BaseProfileLink
      :is-logged="true"
      :profile-icon="user.settings.selectedIcon"
      :user-id="user.id"
      :username="user.username"
    ></BaseProfileLink>
  </div>
</template>
<script setup lang="ts">
import { User } from "@/shared/interfaces/user.interface";
import BaseProfileLink from "./BaseProfileLink.vue";
import RosetteFilled from "@/assets/svg/RosetteFilled.vue";

defineProps<{
  user: User;
}>();
</script>
