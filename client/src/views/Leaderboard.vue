<template>
  <ViewBaseResponsive>
    <BaseHighHeadline class="my-12">Leaderboard</BaseHighHeadline>
    <div class="w-full gap-4 justify-center flex flex-row">
      <div
        class="w-1/3 p-2 border-4 border-gray-300 dark:border-gray-800 rounded-lg shadow-xl"
      >
        <BaseInput
          :model-value="searchedName"
          @update:model-value="(newValue) => (searchedName = newValue)"
          @enter-pressed="fetchUsers"
        />
      </div>
      <BaseButton @click="fetchUsers" class="px-6" :gomoku-blue="true"
        >Search</BaseButton
      >
    </div>
    <div
      class="flex flex-col gap-4 w-50 mt-12 bg-gray-100 dark:bg-gray-800 shadow-xl p-6 rounded-xl"
    >
      <p v-show="users.length === 0" class="text-center text-2xl italic">
        There's nothing here.
      </p>
      <LeaderBoardProfileBlade
        v-for="user in users"
        :key="user.id"
        :user="user"
      />
    </div>
  </ViewBaseResponsive>
</template>
<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseInput from "@/components/BaseInput.vue";
import LeaderBoardProfileBlade from "@/components/LeaderBoardProfileBlade.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import usersRepository from "@/repositories/usersRepository";
import { User } from "@/shared/interfaces/user.interface";
import { Ref, onMounted, ref } from "vue";

const searchedName = ref("");
const users: Ref<User[]> = ref([]);

async function fetchUsers() {
  users.value = (
    await usersRepository.getUsers({
      skip: 0,
      take: 10,
      username: searchedName.value ? searchedName.value : undefined,
    })
  ).data.users;
}

async function takeMore() {
  (
    await usersRepository.getUsers({
      skip: 0,
      take: 10,
      username: searchedName.value ? searchedName.value : undefined,
    })
  ).data.users.forEach((user) => users.value.push(user));
}

onMounted(() => {
  fetchUsers();
});
</script>
