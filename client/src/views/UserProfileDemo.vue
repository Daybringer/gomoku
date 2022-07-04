<template>
  <div
    class="min-height-screen-calc flex lg:flex-row flex-col bg-gray-100 text-gray-900 dark:text-gray-100  dark:bg-gray-700"
  >
    <!-- Left panel -->
    <div class="flex-1 lg:py-8 py-4 lg:px-16 px-8 flex flex-col gap-2">
      <!-- Profile name -->
      <div class="flex flex-row place-content-center lg:place-content-start">
        <div class="flex flex-row items-baseline">
          <h1 class="text-4xl font-medium p-2">{{ user.username }}</h1>
          <router-link
            class=" text-gomoku-blue hover:text-gray-800 fill-current"
            to=""
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-7 stroke-current"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"
              />
              <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
              <line x1="16" y1="5" x2="19" y2="8" />
            </svg>
          </router-link>
        </div>
      </div>
      <!-- Appearance wrapper -->
      <div
        class="flex flex-col lg:flex-row items-center  place-items-center lg:gap-8 gap-4"
      >
        <!-- Profile icon -->
        <router-link to="">
          <img
            class=" border-gray-500 dark:border-gray-300 rounded-xl lg:h-32 h-24 bg-gray-300 cursor-pointer"
            src="../assets/samurai_blue.svg"
            alt=""
          />
        </router-link>
        <!-- Social blade preview -->
        <social-blade
          class="flex-1"
          :nickname="user.username"
          :symbolColor="user.settings.gameStoneColor.me"
          :symbol="'cross'"
          :time="'3:00'"
        ></social-blade>
      </div>

      <!-- Current balance -->
      <div class="flex flex-row place-items-center gap-2 py-2">
        <span class="text-3xl font-bold">
          {{ user.balance }}
        </span>
        <img class="h-12" src="../assets/svg/koin.svg" alt="" />
        <div class="place-self-end relative block">
          <div
            @mouseenter="koinHintToggled = true"
            @mouseleave="koinHintToggled = false"
            @click="koinHintToggled = !koinHintToggled"
            class="bg-gray-600 hover:bg-gray-400 cursor-pointer rounded-full text-gray-200 "
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="h-5 stroke-current"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <path
                d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"
              />
              <line x1="12" y1="19" x2="12" y2="19.01" />
            </svg>
          </div>
          <transition name="slide">
            <div
              v-if="koinHintToggled"
              class="bg-gray-200 rounded-lg absolute block mt-2 py-2 px-6 w-64 text-gray-900"
            >
              <span>
                Koin is a currency that is used for buying profile icons,
                backgrounds... <br />
                It can be obtained by sheer playing.
              </span>
            </div>
          </transition>
        </div>
      </div>
      <div>
        <h3>Stats</h3>
      </div>
      <div class="text-xl">ELO: {{ user.elo }}</div>
      <elo-chart></elo-chart>
      <div>
        <h3>Match history</h3>
      </div>
    </div>
    <!-- Right panel -->
    <div class="flex-1 p-8">prava strana</div>
  </div>
</template>

<script lang="ts">
// Axios repos
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;
// Pinia
import { useStore } from "@/store/store";

// Components
import SocialBlade from "@/components/GameSocialBlade.vue";
import EloChart from "@/components/ProfileEloChart.vue";

import { defineComponent } from "vue";

export default defineComponent({
  name: "UserProfile",
  data() {
    return {
      koinHintToggled: false,
      user: {
        username: "Daybringer",
        elo: 0,
        balance: 0,
        settings: {
          gameStoneColor: {
            me: "#00b3fe",
            enemy: "#ff2079",
          },
        },
      },
    };
  },
  components: { SocialBlade, EloChart },
  methods: {
    async fetchUserData() {
      return UsersRepository.getOwnUserProfile()
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
    },
  },
  async beforeMount() {
    const userData = await this.fetchUserData();
    if (userData) console.log(userData);
  },
});
</script>

<style scoped>
.slide-enter-active,
.slide-leave-active {
  transition: all 0.5s ease;
}

.slide-enter-from,
.slide-leave-to {
  transform: translateY(-8px);
}
</style>
