<template>
  <!-- Landing page alias Home -->
  <div
    class="w-full min-height-screen-calc flex flex-col bg-gray-200 dark:bg-gray-700 scroll-margin-navbar"
    id="home"
    ref="home"
  >
    <div class="relative h-20 md:h-24 w-full bg-gray-800 text-center">
      <IntersectionObserver @intersect="intersectionCrossed('home')" />
      <div class="m-auto top-0">
        <span class="text-gray-300 font-semibold md:text-xl italic"
          >Let's play</span
        >
        <h2 class="bold-text">Piškvorky</h2>
        <h2 class="bold-text">Five in a row</h2>
        <h2 class="bold-text">五目並べ</h2>
        <h2 class="bold-text">Fünf in eine Reihe</h2>
        <h1 class="bold-text">Gomoku</h1>
      </div>
    </div>

    <!-- Current online users -->
    <div class="text-center bg-gray-800 text-gray-400 font-medium text-lg">
      <p>{{ Number(activeUsers) + 1 }} people playing</p>
    </div>
    <div class="bg-gray-800 h-20 z-30 w-full m-auto"></div>
    <div
      id="mainCard"
      ref="mainCard"
      class="w-90 h-90 flex flex-1 mb-8 bg-gray-50 dark:bg-gray-700 shadow-xl z-40 m-auto rounded-xl relative md:rounded-2xl overflow-hidden -mt-16 md:-mt-12"
    >
      <!-- Play button -->
      <div class="m-auto z-20">
        <RouterLink to="/search?type=quick">
          <button
            class="border-gray-800 bg-white dark:bg-gray-800 dark:border-transparent border-4 text-gray-800 dark:text-gray-200 text-3xl font-bold py-4 px-28 rounded-lg hover:shadow-outline-gray focus:shadow-outline-gray focus:outline-none"
          >
            Play
          </button>
        </RouterLink>
      </div>
      <!-- Gomoku game simulation canvas -->
      <GameSimulation></GameSimulation>
    </div>
  </div>
  <TheMatchesIndexSection id="matches" ref="matches" />
  <!-- Campaign -->
  <div
    id="campaign"
    class="flex justify-center items-center gap-12 pb-24 flex-col dark:text-gray-400 dark:fill-gray-300 text-gray-700 bg-gray-200 dark:bg-gray-700"
  >
    <IntersectionObserver @intersect="intersectionCrossed('campaign')" />
    <SadManIntroDialog
      class="w-2/3 xl:w-1/4"
      alt="Old man asking for help (Start of campaign)"
    />
    <RouterLink class="w-1/2" to="/campaign">
      <BaseButton class="w-full text-2xl py-4" :gomoku-blue="true"
        >Start Campaign</BaseButton
      >
    </RouterLink>
  </div>
  <!-- Rules -->

  <TheRulesIndexSection @intersection-crossed="intersectionCrossed('rules')" />
  <!-- Origins -->
  <div
    ref="origins"
    id="origins"
    class="w-full min-height-screen-calc flex pb-8 bg-gray-200 dark:bg-gray-700 flex-col scroll-margin-navbar"
  >
    <IntersectionObserver @intersect="intersectionCrossed('origins')" />
    <h2
      class="text-5xl mt-4 md:mt-4 2xl:mt-4 text-gray-800 dark:text-gray-200 font-semibold w-full text-center"
    >
      Origins
    </h2>
    <div
      class="w-90 xl:w-8/12 xl:text-base ml-auto mr-auto mt-5 font-normal dark:text-gray-300 leading-8 xl:leading-10"
    >
      <p>
        Gomoku is said to have originated in China with the name Wu Zi Qi
        (五子棋). The name "Gomoku" is from the Japanese language, in which it
        is referred to as gomokunarabe (五目並べ). Go means five, moku is a
        counter word for pieces and narabe means line-up. The game is also
        popular in Korea, where it is called omok (五目) which has the same
        structure and origin as the Japanese name. In the nineteenth century,
        the game was introduced to Britain where it was known as Go Bang, said
        to be a corruption of the Japanese word goban, said to be adopted from
        Chinese k'i pan (qí pán) "chess-board."
      </p>
    </div>
  </div>
  <!-- Footer -->
  <div
    ref="contact"
    id="contact"
    class="w-full bg-gomoku-black p-4 pb-2 flex flex-col scroll-margin-navbar"
  >
    <IntersectionObserver @intersect="intersectionCrossed('contact')" />
    <div
      class="text-gray-200 w-full m-auto text-center flex items-center flex-row justify-items-center justify-center pb-2"
    >
      <a
        href="https://github.com/Daybringer/gomoku"
        target="_blank"
        class="focus:outline-none focus:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 stroke-current mr-5 hover:text-gray-500 focus:outline-none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M9 19c-4.3 1.4 -4.3 -2.5 -6 -3m12 5v-3.5c0 -1 .1 -1.4 -.5 -2c2.8 -.3 5.5 -1.4 5.5 -6a4.6 4.6 0 0 0 -1.3 -3.2a4.2 4.2 0 0 0 -.1 -3.2s-1.1 -.3 -3.5 1.3a12.3 12.3 0 0 0 -6.2 0c-2.4 -1.6 -3.5 -1.3 -3.5 -1.3a4.2 4.2 0 0 0 -.1 3.2a4.6 4.6 0 0 0 -1.3 3.2c0 4.6 2.7 5.7 5.5 6c-.6 .6 -.6 1.2 -.5 2v3.5"
          />
        </svg>
      </a>
      <a
        href="https://discord.gg/ASYgt6j"
        target="_blank"
        class="focus:outline-none focus:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 stroke-current hover:text-gray-500 focus:outline-none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <circle cx="9" cy="12" r="1" />
          <circle cx="15" cy="12" r="1" />
          <path d="M7.5 7.5c3.5-1 5.5-1 9 0" />
          <path d="M7 16.5c3.5 1 6.5 1 10 0" />
          <path
            d="M15.5 17c0 1 1.5 3 2 3c1.5 0 2.833 -1.667 3.5 -3c.667 -1.667 .5 -5.833 -1.5 -11.5c-1.457 -1.015 -3 -1.34 -4.5 -1.5l-1 2.5"
          />
          <path
            d="M8.5 17c0 1 -1.356 3 -1.832 3c-1.429 0 -2.698 -1.667 -3.333 -3c-.635 -1.667 -.476 -5.833 1.428 -11.5c1.388 -1.015 2.782 -1.34 4.237 -1.5l1 2.5"
          />
        </svg>
      </a>
      <a
        href="https://play.google.com/store/apps"
        target="_blank"
        class="focus:outline-none focus:text-gray-700"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 stroke-current ml-5 hover:text-gray-500 focus:outline-none"
          viewBox="0 0 24 24"
          stroke-width="1.8"
          stroke="#2c3e50"
          fill="none"
          stroke-linecap="round"
          stroke-linejoin="round"
        >
          <path stroke="none" d="M0 0h24v24H0z" fill="none" />
          <path
            d="M4 3.71v16.58a0.7 .7 0 0 0 1.05 .606l14.622 -8.42a0.55 .55 0 0 0 0 -.953l-14.622 -8.419a0.7 .7 0 0 0 -1.05 .607z"
          />
          <line x1="15" y1="9" x2="4.5" y2="20.5" />
          <line x1="4.5" y1="3.5" x2="15" y2="15" />
        </svg>
      </a>
    </div>
    <div
      class="text-gray-200 h-6 w-full m-auto text-center flex items-center flex-row justify-items-center justify-center pb-2 my-2"
    >
      <RouterLink
        to="/contact"
        class="mr-5 hover:text-gray-500 focus:text-gray-600 focus:outline-none"
        >Contact</RouterLink
      >
      <RouterLink
        to="/privacy"
        class="hover:text-gray-500 focus:text-gray-600 focus:outline-none"
        >Privacy</RouterLink
      >
    </div>
    <div class="w-full h-6 flex-1 m-auto text-center">
      <span class="text-gray-200 text-base font-normal"
        >Copyright (c) 2020
        <a
          href="https://daybringer.github.io/"
          class="focus:text-gray-600 focus:outline-none hover:text-gray-500"
          target="_blank"
          >Vaňata
        </a>
        <span class="text-sm italic"
          >licensed under
          <a
            href="https://github.com/Daybringer/gomoku/blob/master/LICENSE"
            class="focus:text-gray-600 focus:outline-none not-italic hover:text-gray-500"
            target="_blank"
            >MIT</a
          ></span
        >
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref } from "vue";
import IntersectionObserver from "@/components/IntersectionObserver.vue";
import SadManIntroDialog from "@/assets/svg/SadManIntroDialog.vue";
import TheMatchesIndexSection from "@/components/TheMatchesIndexSection.vue";
import GameSimulation from "@/components/GameSimulation.vue";
import BaseButton from "@/components/BaseButton.vue";
import TheRulesIndexSection from "@/components/TheRulesIndexSection.vue";
defineProps<{ logged: boolean; activeUsers: number }>();
const emit = defineEmits<{
  (e: "intersectionCrossed", intersactionName: string);
}>();

// Methods
const intersectionCrossed = (intersectionName: string) => {
  emit("intersectionCrossed", intersectionName);
};
</script>
<style>
.bold-text {
  font-style: normal;
  font-weight: 700;
  font-size: 1.75rem;
  @apply text-gray-300;
  animation: fadeIn ease 15s infinite;
  -webkit-animation: fadeIn ease 15s infinite;
  -moz-animation: fadeIn ease 15s infinite;
  -o-animation: fadeIn ease 15s infinite;
  -ms-animation: fadeIn ease 15s infinite;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  position: absolute;
  left: 50%;
  top: 60%;
  transform: translate(-50%, -50%);
}

.bold-text:nth-child(2) {
  animation-delay: 3s;
}
.bold-text:nth-child(3) {
  animation-delay: 6s;
}
.bold-text:nth-child(4) {
  animation-delay: 9s;
}
.bold-text:nth-child(5) {
  animation-delay: 12s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    display: inline;
  }
  6.5% {
    opacity: 1;
    display: inline;
  }
  13% {
    opacity: 1;
    display: inline;
  }
  20% {
    opacity: 0;
    display: none;
  }
}
</style>
