<template>
  <view-base-responsive class="bg-red-100">
    <div
      class="flex-1 bg-blue-100 flex flex-row justify-center place-items-center flex-wrap gap-6"
    >
      <profile-achievement
        class="h-20 w-20 md:h-28 md:w-28"
        v-for="achievement in achievementsList"
        :key="achievement"
      />
    </div>
  </view-base-responsive>
</template>
<script lang="ts">
import { Achievement, achievementRecords } from "@/shared/achievements";
import { defineComponent } from "vue";
// Components
import ProfileAchievement from "@/components/ProfileAchievement.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
export default defineComponent({
  name: "Achievements",
  props: {},
  components: { ProfileAchievement, ViewBaseResponsive },
  data(): {} {
    return {};
  },
  computed: {
    achievementsList(): string[] {
      return Object.values(Achievement);
    },
  },
  methods: {},
  mounted() {},
});
</script>
<style scoped></style>
