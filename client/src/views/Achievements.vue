<template>
  <BaseView class="bg-red-100">
    <div
      class="flex-1 bg-blue-100 flex flex-row justify-center place-items-center flex-wrap gap-6"
    >
      <profile-achievement
        class="h-20 w-20 md:h-28 md:w-28"
        v-for="achievement in achievementsList"
        :key="achievement"
      />
    </div>
  </BaseView>
</template>
<script setup lang="ts">
import { Achievement } from "@/shared/achievements";
import { computed } from "vue";
// Components
import ProfileAchievement from "@/components/ProfileAchievement.vue";
import BaseView from "@/components/BaseView.vue";
const achievementsList = computed(() => {
  return Object.values(Achievement);
});
</script>
<style scoped></style>
