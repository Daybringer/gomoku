<template>
  <BaseView>
    <BaseHighHeadline class="md:my-12 my-6">Leaderboard</BaseHighHeadline>
    <div class="md:w-1/3 w-full justify-center flex items-center flex-col">
      <BaseInput
        class="w-full"
        type="text"
        :model-value="searchedName"
        title="Enter searched username"
        placeholder="Search by name"
        name="leaderBoardUsernameInput"
        @update:model-value="(newValue) => (searchedName = newValue)"
        @enter="fetchUsers"
      />
      <BaseButton @click="fetchUsers" class="w-80" :gomoku-blue="true"
        >Search</BaseButton
      >
    </div>
    <div
      class="flex flex-col gap-4 md:w-80 xl:w-50 w-full md:mt-12 mt-6 bg-gray-100 dark:bg-gray-800 shadow-xl p-6 rounded-xl"
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
  </BaseView>
</template>
<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseInput from "@/components/BaseInput.vue";
import LeaderBoardProfileBlade from "@/components/LeaderBoardProfileBlade.vue";
import BaseView from "@/components/BaseView.vue";
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
