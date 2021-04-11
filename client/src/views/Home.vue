<template>
  <!-- Landing page alias Home -->
  <div
    class="w-full min-height-screen-calc flex flex-col bg-gray-200 dark:bg-gray-700 scroll-margin-navbar"
    id="home"
    ref="home"
  >
    <div class="relative h-20  md:h-24 w-full bg-gray-800 text-center">
      <intersection-observer @intersect="intersectionCrossed('home')" />
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

    <div class=" bg-gray-800 h-20 z-30 w-full m-auto"></div>
    <div
      id="mainCard"
      ref="mainCard"
      class=" w-90 h-90 flex flex-1 mb-8 bg-white dark:bg-gray-500 shadow-xl z-40 m-auto rounded-xl relative md:rounded-2xl overflow-hidden -mt-16 md:-mt-12"
    >
      <!-- Play button -->
      <div class="m-auto z-20">
        <router-link to="/search?type=quick">
          <button
            class="border-gray-800 text-white dark:text-gray-500 dark:border-gray-200 border-4 bg-gray-800 dark:bg-gray-300 text-xl font-bold py-3 px-24 rounded-lg focus:shadow-outline-gray focus:outline-none"
          >
            Play
          </button>
        </router-link>
      </div>
      <!-- Gomoku game simulation canvas -->
      <game-simulation></game-simulation>
    </div>
  </div>
  <!-- Matces -->
  <div
    ref="matches"
    id="matches"
    class="w-full min-height-screen-calc flex bg-gray-200 dark:bg-gray-700  flex-col scroll-margin-navbar"
  >
    <intersection-observer @intersect="intersectionCrossed('matches')" />
    <h2
      class="text-5xl my-6 md:mt-8 2xl:mt-12 text-gray-800 dark:text-gray-200 font-semibold w-full text-center"
    >
      Matches
    </h2>
    <div
      class=" mx-auto mb-auto md:mt-16 2xl:mt-32  w-80 md:w-60 gap-8 grid grid-cols-1 md:grid-cols-2 z-40"
    >
      <div class="flex ">
        <div
          class="m-auto transform hover:scale-105  transition-transform ease-in duration-75"
        >
          <router-link
            to="/search?type=quick"
            class="focus:outline-none focus:opacity-75"
          >
            <img class="" src="../assets/svg/boxMatchQuick.svg" />
          </router-link>
        </div>
      </div>
      <div class="flex">
        <div
          class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
        >
          <router-link
            to="/search?type=quick"
            class="focus:outline-none focus:opacity-75"
          >
            <img src="../assets/svg/boxMatchRanked.svg" />
          </router-link>
        </div>
      </div>
      <div class="flex">
        <div
          class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
        >
          <router-link to="/custom" class="focus:outline-none focus:opacity-75">
            <img src="../assets/svg/boxMatchCustom.svg" />
          </router-link>
        </div>
      </div>
      <div class="flex">
        <div
          class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
        >
          <router-link to="/ai" class="focus:outline-none focus:opacity-75">
            <img src="../assets/svg/boxMatchAI.svg" />
          </router-link>
        </div>
      </div>
    </div>
  </div>
  <!-- Rules -->
  <div
    id="rules"
    ref="rules"
    class="w-full min-height-screen-calc flex bg-gray-200 dark:bg-gray-700  flex-col scroll-margin-navbar"
  >
    <intersection-observer @intersect="intersectionCrossed('rules')" />
    <h2
      class="text-5xl my-6  md:mt-4 2xl:mt-4 text-gray-800 dark:text-gray-200 font-semibold w-full text-center"
    >
      Rules
    </h2>
    <div
      class=" w-90 xl:w-2/3 mt-4  p-4 py-8 flex flex-col mb-8 bg-gray-800 rounded-lg m-auto"
    >
      <!-- Basics -->
      <rule-section
        class=""
        :type="'section'"
        :toggleTarget="expanded.basics"
        targetHeading="Basics"
      >
        <ul class="list-disc list-inside text-gray-300 font-normal p-3">
          <li class="pb-3">Played on <b>15x15</b> gameboard</li>
          <li class="pb-3">Players take turns</li>
          <li class="pb-3">Total time measured using chess clock</li>
          <li class="pb-3">
            Player who makes an unbroken row of <b>5</b> stones in any direction
            <b>wins</b> the game
          </li>

          <li class="pb-3">
            Starting player is determined by a coin flip
          </li>
          <li class="pb-3">
            Players alternate until somebody wins or the board is filled, in
            which case the game is tied
          </li>
          <li class="pb-3">
            Game either starts with a blank board or with a more advanced
            technique called SWAP
          </li>
        </ul>
      </rule-section>
      <!-- Game Types -->
      <rule-section
        class="mt-4"
        :type="'section'"
        :toggleTarget="expanded.gameTypes.self"
        targetHeading="Game Types"
      >
        <!-- Quick -->
        <rule-section
          :type="'subsection'"
          :toggleTarget="expanded.gameTypes.quick"
          :targetHeading="'Quick'"
        >
          <ul
            class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
          >
            <li class="pb-3">
              Players don't have to be logged in
            </li>
            <li class="pb-3">
              Each player has a time limit of 5mins
            </li>
            <li class="pb-3">
              ELO doesn't matter, just have fun!
            </li>
          </ul>
        </rule-section>
        <!-- Ranked -->
        <rule-section
          :type="'subsection'"
          :toggleTarget="expanded.gameTypes.ranked"
          :targetHeading="'Ranked'"
        >
          <ul
            class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
          >
            <li class="pb-3">
              Players have to be logged in
            </li>
            <li class="pb-3">
              Each player has a time limit of 10mins
            </li>
            <li class="pb-3">
              Players of similar ELO are matched against each other
            </li>
            <li class="pb-3">
              Winner's ELO increases, loser's decreases
            </li>
            <li class="pb-3">
              The game starts with SWAP1
            </li>
          </ul>
        </rule-section>
        <!-- Custom -->
        <rule-section
          :type="'subsection'"
          :toggleTarget="expanded.gameTypes.custom"
          :targetHeading="'Custom'"
        >
          <ul
            class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
          >
            <li class="pb-3">
              One player creates a game room and shares its link with an
              opponent
            </li>
            <li class="pb-3">
              It's up to the player to prescribe a time limit and a swap
            </li>
            <li class="pb-3">
              ELO is not affected by the outcome of the game
            </li>
          </ul>
        </rule-section>
        <!-- AI -->
        <rule-section
          :type="'subsection'"
          :toggleTarget="expanded.gameTypes.ai"
          :targetHeading="'AI'"
        >
          <ul
            class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
          >
            <li class="pb-3">
              A player enters a game against a bot
            </li>
            <li class="pb-3">
              The rules of the game will vary
            </li>
            <li class="pb-3">
              ELO is not affected by the outcome of the game
            </li>
            <li class="pb-3">
              Each game presents a unique challenge
            </li>
          </ul>
        </rule-section>
      </rule-section>
      <!-- SWAP1 -->
      <rule-section
        class="mt-4"
        :type="'section'"
        :toggleTarget="expanded.swap1"
        targetHeading="SWAP1"
      >
        <ul class="list-disc list-inside text-gray-300 font-normal p-3">
          <li class="pb-3">
            Starting player is determined by a coin flip
          </li>
          <li class="pb-3">
            He then places 3 stones - 2 of one color and 1 of the other
          </li>
          <li class="pb-3">
            The opponent chooses one of the colors, starting player is assigned
            the other one
          </li>
          <li class="pb-3">
            The player with only 1 stone goes 1st
          </li>
          <li class="list-none">
            <button
              class="border-gray-400 border-4 text-gray-200 text-base font-medium py-1 px-6 rounded-md focus:shadow-outline-white focus:outline-none hover:bg-gray-400 hover:text-gray-700"
            >
              Example
            </button>
          </li>
        </ul>
      </rule-section>
      <!-- SWAP2 -->
      <rule-section
        class="mt-4"
        :type="'section'"
        :toggleTarget="expanded.swap2"
        targetHeading="SWAP2"
      >
        <ul class="list-disc list-inside text-gray-300 font-normal p-3">
          <li class="pb-3">
            The game starts like SWAP1, but the opponent has
            <b>3</b> choices
            <ul class="list-disc list-inside text-gray-300 font-normal p-3">
              <li class="pb-3">
                Play with the 2 placed stones and go 2nd
              </li>
              <li class="pb-3">
                Play with the 1 placed stone and go 1st
              </li>
              <li class="pb-3">
                Place 2 more stones and let starting player choose his color
              </li>
            </ul>
          </li>
        </ul>
      </rule-section>
    </div>
  </div>
  <!-- Origins -->
  <div
    ref="origins"
    id="origins"
    class="w-full min-height-screen-calc flex pb-8 bg-gray-200 dark:bg-gray-700  flex-col scroll-margin-navbar"
  >
    <intersection-observer @intersect="intersectionCrossed('origins')" />
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
    class="w-full bg-gomoku-black  p-4 pb-2 flex flex-col scroll-margin-navbar"
  >
    <intersection-observer @intersect="intersectionCrossed('contact')" />
    <div
      class="text-gray-200 w-full m-auto text-center flex items-center flex-row justify-items-center justify-center pb-2"
    >
      <a
        href="https://github.com/Daybringer/gomoku"
        target="_blank"
        class="focus:outline-none focus:text-gray-700 "
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          class="h-8 stroke-current mr-5  hover:text-gray-500 focus:outline-none"
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
        class="focus:outline-none focus:text-gray-700 "
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
          class="h-8 stroke-current ml-5  hover:text-gray-500 focus:outline-none"
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
      <router-link
        to="/contact"
        class="mr-5 hover:text-gray-500 focus:text-gray-600 focus:outline-none"
        >Contact</router-link
      >
      <router-link
        to="/privacy"
        class="hover:text-gray-500 focus:text-gray-600 focus:outline-none"
        >Privacy</router-link
      >
    </div>
    <div class="w-full h-6 flex-1 m-auto text-center">
      <span class="text-gray-200 text-base font-normal "
        >Copyright (c) 2020
        <a
          href="https://daybringer.github.io/"
          class="focus:text-gray-600 focus:outline-none  hover:text-gray-500"
          target="_blank"
          >Vaňata
        </a>
        <span class="text-sm italic"
          >licensed under
          <a
            href="https://github.com/Daybringer/gomoku/blob/master/LICENSE"
            class="focus:text-gray-600 focus:outline-none  not-italic hover:text-gray-500"
            target="_blank"
            >MIT</a
          ></span
        >
      </span>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent, reactive, computed, toRefs } from "vue";
import IntersectionObserver from "@/components/mini/IntersectionObserver.vue";
import RuleSection from "../components/RuleSection.vue";
import GameSimulation from "@/components/GameSimulation.vue";
export default defineComponent({
  name: "Home",
  components: { RuleSection, IntersectionObserver, GameSimulation },
  props: {
    logged: Boolean,
  },
  setup(props, context) {
    const state = reactive({
      activeRule: "basics",
      expanded: {
        swap1: { toggled: false },
        swap2: { toggled: false },
        basics: { toggled: false },
        gameTypes: {
          self: { toggled: false },
          quick: { toggled: false },
          ranked: { toggled: false },
          custom: { toggled: false },
          ai: { toggled: false },
        },
      },
    });

    // Methods
    const intersectionCrossed = (intersectionName: string) => {
      context.emit("intersectionCrossed", intersectionName);
    };
    return {
      ...toRefs(state),
      intersectionCrossed,
    };
  },
});
</script>
<style>
.shadow-box {
  box-shadow: 0px 0px 15px 30px rgba(255, 255, 255, 1);
  -webkit-box-shadow: 0px 0px 15px 30px rgba(255, 255, 255, 1);
  -moz-box-shadow: 0px 0px 15px 30px rgba(255, 255, 255, 1);
}
.scroll-margin-navbar {
  scroll-margin-top: 4em;
}

.rounded-inner-div {
  height: 90%;
  width: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.65rem;
}

.rounded-inner-div-matches {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@media (min-width: 640px) {
  .rounded-inner-div-matches {
    height: 85%;
    width: 100%;
    top: 30%;
    border-radius: 2rem;
  }
  .rounded-inner-div {
    border-radius: 2rem;
  }
}

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
