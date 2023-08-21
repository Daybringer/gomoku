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
  <TheMatchesIndexSection
    id="matches"
    ref="matches"
    @intersect="intersectionCrossed('matches')"
  />
  <TheLeaderboardIndexSection
    id="leaderboard"
    ref="leaderboard"
    @intersect="intersectionCrossed('leaderboard')"
  />
  <!-- Campaign -->
  <TheCampaignIndexSection
    id="campaign"
    ref="campaign"
    @intersect="intersectionCrossed('campaign')"
  />
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
  <TheFooter @intersection-crossed="intersectionCrossed('contact')" />
</template>
<script setup lang="ts">
import IntersectionObserver from "@/components/IntersectionObserver.vue";
import TheMatchesIndexSection from "@/components/TheMatchesIndexSection.vue";
import GameSimulation from "@/components/GameSimulation.vue";
import TheRulesIndexSection from "@/components/TheRulesIndexSection.vue";
import TheCampaignIndexSection from "@/components/TheCampaignIndexSection.vue";
import TheFooter from "@/components/TheFooter.vue";
import TheLeaderboardIndexSection from "@/components/TheLeaderboardIndexSection.vue";
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
