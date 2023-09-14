<template>
  <ViewBaseResponsive class="pb-32 bg-gray-200">
    <IntersectionObserver @intersect="emit('intersect')" />
    <BaseHighHeadline>Leaderboard</BaseHighHeadline>

    <div class="md:w-60 w-full flex flex-col gap-6 py-12">
      <LeaderBoardProfileBlade
        v-for="topUser in topThreeUsers"
        :key="topUser.username"
        :user="topUser"
      />
      <DotsIcon
        v-show="!amIInTopThree && isAuthenticated"
        class="h-8 rotate-90"
      />
      <LeaderBoardProfileBlade
        v-show="!amIInTopThree && isAuthenticated"
        :user="user"
      />
      <p
        v-show="!isAuthenticated"
        class="text-center italic text-gray-400 text-xl"
      >
        Want to be shown here?
        <br />
        Log in, play ranked games and fight your way to the top.
      </p>
    </div>
    <RouterLink to="/leaderboard">
      <BaseButton :gomoku-blue="true" class="px-12 py-4"
        >Go to Leaderboard</BaseButton
      >
    </RouterLink>
  </ViewBaseResponsive>
</template>
<script setup lang="ts">
import { useProfileStore } from "@/store/profile";
import BaseHighHeadline from "./BaseHighHeadline.vue";
import ViewBaseResponsive from "./ViewBaseResponsive.vue";
import { storeToRefs } from "pinia";
import LeaderBoardProfileBlade from "./LeaderBoardProfileBlade.vue";
import IntersectionObserver from "./IntersectionObserver.vue";
import BaseButton from "./BaseButton.vue";
import DotsIcon from "@/assets/svg/DotsIcon.vue";
import { Ref, computed, onMounted, ref } from "vue";
import usersRepository from "@/repositories/usersRepository";
import { User } from "@/shared/interfaces/user.interface";

const { user, isAuthenticated } = storeToRefs(useProfileStore());
const amIInTopThree = computed(
  () =>
    isAuthenticated &&
    user.value.statistics.leaderboardPosition <= 3 &&
    user.value.statistics.leaderboardPosition > 0
);
const emit = defineEmits<{
  (e: "intersect");
}>();
const topThreeUsers: Ref<User[]> = ref([]);

onMounted(() => {
  usersRepository.getUsers({ skip: 0, take: 3 }).then((res) => {
    res.data.users.forEach((fetchedUser) =>
      topThreeUsers.value.push(fetchedUser)
    );
  });
});
</script>
