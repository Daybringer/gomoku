<template>
  <div class="w-full h-full">
    <div
      class="w-full min-height-screen-calc flex flex-col bg-gray-300 "
      id="home"
    >
      <div class="relative h-20  md:h-24 w-full bg-gray-800 text-center">
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
        class=" w-90 h-90 flex flex-1 mb-8 bg-white z-40 m-auto rounded-xl md:rounded-2xl -mt-16 md:-mt-12"
      >
        <div class="m-auto">
          <button
            class="border-gray-800 border-4 text-gray-800 text-xl font-bold py-3 px-24 rounded-lg focus:shadow-outline-gray focus:outline-none"
          >
            Play
          </button>
        </div>
      </div>
    </div>
    <div
      id="matches"
      class="w-full min-height-screen-calc flex bg-gray-300 flex-col"
    >
      <h2
        class="text-5xl my-6 md:mt-8 2xl:mt-12 text-gray-800 font-semibold w-full text-center"
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
              to="/q/search"
              class="focus:outline-none focus:opacity-75"
            >
              <img class="" src="../assets/boxMatchQuick.svg" />
            </router-link>
          </div>
        </div>
        <div class="flex">
          <div
            class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
          >
            <router-link
              to="/q/search"
              class="focus:outline-none focus:opacity-75"
            >
              <img src="../assets/boxMatchRanked.svg" />
            </router-link>
          </div>
        </div>
        <div class="flex">
          <div
            class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
          >
            <router-link
              to="/q/search"
              class="focus:outline-none focus:opacity-75"
            >
              <img src="../assets/boxMatchCustom.svg" />
            </router-link>
          </div>
        </div>
        <div class="flex">
          <div
            class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
          >
            <router-link
              to="/q/search"
              class="focus:outline-none focus:opacity-75"
            >
              <img src="../assets/boxMatchAI.svg" />
            </router-link>
          </div>
        </div>
      </div>
    </div>
    <div
      id="rules"
      class="w-full min-height-screen-calc flex bg-gray-300 flex-col"
    >
      <h2
        class="text-5xl my-6  md:mt-4 2xl:mt-4 text-gray-800 font-semibold w-full text-center"
      >
        Rules
      </h2>
      <div
        class=" w-90 mt-4  p-4 py-8 xl:py-4 grid grid-flow-row xl:grid-flow-col xl:grid-cols-7 xl:grid-rows-4 gap-4 mb-8 bg-gray-800 rounded-lg m-auto"
      >
        <div
          class="xl:row-span-2 xl:col-span-4 p-2 pl-3 rounded-md bg-gray-700 row-start-1"
        >
          <div
            class="relative flex-row flex  items-center justify-between h-10"
          >
            <h3 class="font-semibold text-lg  md:text-2xl text-gray-200">
              Basics
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
              :class="expanded.basics ? '-rotate-90 ' : 'rotate-0'"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#cbd5e0"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              @click="toggleExpand('basics')"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="7 7 12 12 17 7" />
              <polyline points="7 13 12 18 17 13" />
            </svg>
          </div>
          <transition name="slide">
            <div v-show="expanded.basics" class="xl:block">
              <ul class="list-disc list-inside text-gray-300 font-normal p-3">
                <li class="pb-3">Played on <b>15x15</b> gameboard</li>
                <li class="pb-3">Players take turns</li>
                <li class="pb-3">Total time measured using chess clock</li>
                <li class="pb-3">
                  Player who makes an unbroken row of <b>5</b> stones in
                  any direction <b>wins</b> the game
                </li>

                <li class="pb-3">
                  Starting player is determined by a coin flip
                </li>
                <li class="pb-3">
                  Players alternate until somebody wins or the
                  board is filled, in which case the game is tied
                </li>
                <li class="pb-3">
                  Game either starts with a blank board or with a more advanced
                  technique called SWAP
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div
          class="row-span-1 xl:col-span-4 p-2 pl-3 rounded-md bg-gray-700 row-start-3"
        >
          <div
            class="relative flex-row flex  items-center justify-between h-10"
          >
            <h3 class="font-semibold text-lg md:text-2xl text-gray-200">
              SWAP1
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
              :class="expanded.swap1 ? '-rotate-90 ' : 'rotate-0'"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#cbd5e0"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              @click="toggleExpand('swap1')"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="7 7 12 12 17 7" />
              <polyline points="7 13 12 18 17 13" />
            </svg>
          </div>
          <transition name="slide">
            <div v-show="expanded.swap1" class="xl:block">
              <ul class="list-disc list-inside text-gray-300 font-normal p-3">
                <li class="pb-3">
                  Starting player is randomly decided by coin flip
                </li>
                <li class="pb-3">
                  Players alternate their turns until somebody wins or whole
                  board is filled, when the game ends as a tie
                </li>
                <li class="pb-3">
                  Game either starts with simple start or with more advanced
                  starting technique called SWAP
                </li>
                <li class="list-none">
                  <button
                    class="border-gray-400 border-4 text-gray-200 text-base font-medium py-1 px-6 rounded-md focus:shadow-outline-white focus:outline-none hover:bg-gray-400 hover:text-gray-700"
                  >
                    Example
                  </button>
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div
          class="row-span-1 xl:col-span-4 p-2 pl-3 rounded-md bg-gray-700 row-start-4"
        >
          <div
            class="relative flex-row flex  items-center justify-between h-10"
          >
            <h3 class="font-semibold text-lg md:text-2xl text-gray-200">
              SWAP2
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
              :class="expanded.swap2 ? '-rotate-90 ' : 'rotate-0'"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#cbd5e0"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              @click="toggleExpand('swap2')"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="7 7 12 12 17 7" />
              <polyline points="7 13 12 18 17 13" />
            </svg>
          </div>
          <transition name="slide">
            <div v-show="expanded.swap2" class="xl:block">
              <ul class="list-disc list-inside text-gray-300 font-normal p-3">
                <li class="pb-3">
                  Starting player is randomly decided by coin flip
                </li>
                <li class="pb-3">
                  Players alternate their turns until somebody wins or whole
                  board is filled, when the game ends as a tie
                </li>
                <li class="pb-3">
                  Game either starts with simple start or with more advanced
                  starting technique called SWAP
                </li>
              </ul>
            </div>
          </transition>
        </div>
        <div
          class="xl:row-span-4 xl:col-span-3 rounded-md bg-gray-700 flex flex-col p-2 text-center row-start-2"
        >
          <div
            class="relative flex-row flex  items-center justify-between h-10"
          >
            <h3 class="font-semibold text-lg md:text-2xl text-gray-200 pl-1">
              Game Types
            </h3>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
              :class="expanded.matchTypes.self ? '-rotate-90 ' : 'rotate-0'"
              viewBox="0 0 24 24"
              stroke-width="1.5"
              stroke="#cbd5e0"
              fill="none"
              stroke-linecap="round"
              stroke-linejoin="round"
              @click="toggleExpand('matchTypes.self')"
            >
              <path stroke="none" d="M0 0h24v24H0z" fill="none" />
              <polyline points="7 7 12 12 17 7" />
              <polyline points="7 13 12 18 17 13" />
            </svg>
          </div>
          <transition name="slide">
            <div v-show="expanded.matchTypes.self" class="xl:block">
              <div class="flex-1 bg-gray-800 my-4 rounded-md p-3 py-2">
                <div
                  class="relative flex-row flex  items-center justify-between h-10"
                >
                  <h3 class="text-gray-200 text-left font-medium text-lg">
                    Quick
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
                    :class="
                      expanded.matchTypes.quick ? '-rotate-90 ' : 'rotate-0'
                    "
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#cbd5e0"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    @click="toggleExpand('matchTypes.quick')"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="7 7 12 12 17 7" />
                    <polyline points="7 13 12 18 17 13" />
                  </svg>
                </div>
                <transition name="slide">
                  <div v-show="expanded.matchTypes.quick" class="xl:block">
                    <ul
                      class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
                    >
                      <li class="pb-3">
                        Starting player is randomly decided by coin flip
                      </li>
                      <li class="pb-3">
                        Players alternate their turns until somebody wins or
                        whole board is filled, when the game ends as a tie
                      </li>
                      <li class="pb-3">
                        Game either starts with simple start or with more
                        advanced starting technique called SWAP
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
              <div class="flex-1 bg-gray-800 my-4 rounded-md p-3 py-2">
                <div
                  class="relative flex-row flex  items-center justify-between h-10"
                >
                  <h3 class="text-gray-200 text-left font-medium text-lg">
                    Ranked
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
                    :class="
                      expanded.matchTypes.ranked ? '-rotate-90 ' : 'rotate-0'
                    "
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#cbd5e0"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    @click="toggleExpand('matchTypes.ranked')"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="7 7 12 12 17 7" />
                    <polyline points="7 13 12 18 17 13" />
                  </svg>
                </div>
                <transition name="slide">
                  <div v-show="expanded.matchTypes.ranked" class="xl:block">
                    <ul
                      class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
                    >
                      <li class="pb-3">
                        Starting player is randomly decided by coin flip
                      </li>
                      <li class="pb-3">
                        Players alternate their turns until somebody wins or
                        whole board is filled, when the game ends as a tie
                      </li>
                      <li class="pb-3">
                        Game either starts with simple start or with more
                        advanced starting technique called SWAP
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
              <div class="flex-1 bg-gray-800 my-4 rounded-md p-3 py-2">
                <div
                  class="relative flex-row flex items-center justify-between h-10"
                >
                  <h3 class="text-gray-200 text-left font-medium text-lg">
                    Custom
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
                    :class="
                      expanded.matchTypes.custom ? '-rotate-90 ' : 'rotate-0'
                    "
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#cbd5e0"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    @click="toggleExpand('matchTypes.custom')"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="7 7 12 12 17 7" />
                    <polyline points="7 13 12 18 17 13" />
                  </svg>
                </div>
                <transition name="slide">
                  <div v-show="expanded.matchTypes.custom" class="xl:block">
                    <ul
                      class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
                    >
                      <li class="pb-3">
                        Starting player is randomly decided by coin flip
                      </li>
                      <li class="pb-3">
                        Players alternate their turns until somebody wins or
                        whole board is filled, when the game ends as a tie
                      </li>
                      <li class="pb-3">
                        Game either starts with simple start or with more
                        advanced starting technique called SWAP
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
              <div class="flex-1 bg-gray-800 my-4 rounded-md p-3 py-2">
                <div
                  class="relative flex-row flex  items-center justify-between h-10"
                >
                  <h3 class="text-gray-200 text-left font-medium text-lg">
                    AI
                  </h3>
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="icon icon-tabler icon-tabler-chevrons-down h-full xl:hidden transform transition-transform ease-in duration-100"
                    :class="expanded.matchTypes.ai ? '-rotate-90 ' : 'rotate-0'"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    stroke="#cbd5e0"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    @click="toggleExpand('matchTypes.ai')"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <polyline points="7 7 12 12 17 7" />
                    <polyline points="7 13 12 18 17 13" />
                  </svg>
                </div>
                <transition name="slide">
                  <div v-show="expanded.matchTypes.ai" class="xl:block">
                    <ul
                      class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
                    >
                      <li class="pb-3">
                        Starting player is randomly decided by coin flip
                      </li>
                      <li class="pb-3">
                        Players alternate their turns until somebody wins or
                        whole board is filled, when the game ends as a tie
                      </li>
                      <li class="pb-3">
                        Game either starts with simple start or with more
                        advanced starting technique called SWAP
                      </li>
                    </ul>
                  </div>
                </transition>
              </div>
            </div>
          </transition>
        </div>
      </div>
    </div>
    <div
      id="origins"
      class="w-full min-height-screen-calc flex pb-8 bg-gray-300 flex-col"
    >
      <h2
        class="text-5xl mt-4 md:mt-4 2xl:mt-4 text-gray-800 font-semibold w-full text-center"
      >
        Origins
      </h2>
      <div
        class="ml-auto flex-1 mr-auto  flex flex-col mt-4   xl:text-base font-normal leading-8 xl:leading-10"
      >
        <div class="w-90 xl:w-8/12 m-auto">
          <p>
            Gomoku is said to have originated in China with the name Wu Zi Qi
            (五子棋). The name "Gomoku" is from the Japanese language, in which
            it is referred to as gomokunarabe (五目並べ). Go means five, moku is
            a counter word for pieces and narabe means line-up. The game is also
            popular in Korea, where it is called omok (五目) which has the same
            structure and origin as the Japanese name. In the nineteenth
            century, the game was introduced to Britain where it was known as Go
            Bang, said to be a corruption of the Japanese word goban, said to be
            adopted from Chinese k'i pan (qí pán) "chess-board."
          </p>
        </div>
        <div class="flex-1 w-full m-auto flex flex-row relative">
          <div class="mt-16 xl:mt-0">
            <img
              src="../assets/gomoku_japanese.svg"
              alt="gomoku in japanese"
              class="h-20 rotated-japanese"
            />
          </div>
        </div>
      </div>
    </div>
    <div id="contact" class="w-full bg-gomoku-black p-4 pb-2 flex flex-col">
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
  </div>
</template>
<script>
export default {
  name: "Home",
  props: ["logged"],
  components: {},
  beforeMount() {
    if (window.innerWidth >= 1280) {
      this.expanded = {
        swap1: true,
        swap2: true,
        basics: true,
        matchTypes: {
          self: true,
          quick: true,
          ranked: true,
          custom: true,
          ai: true,
        },
      };
    }
  },
  data() {
    return {
      activeRule: "basics",
      expanded: {
        swap1: false,
        swap2: false,
        basics: false,
        matchTypes: {
          self: false,
          quick: false,
          ranked: false,
          custom: false,
          ai: false,
        },
      },
    };
  },
  methods: {
    toggleExpand(toExpand) {
      // FIXME quick solution, but unusable in production, make it more general and make it global
      if (toExpand.includes(".")) {
        // naive solution for only 1 level
        let parsedToExpand = toExpand.split(".");
        this.expanded[parsedToExpand[0]][parsedToExpand[1]] = !this.expanded[
          parsedToExpand[0]
        ][parsedToExpand[1]];
      } else {
        this.expanded[toExpand] = !this.expanded[toExpand];
      }
    },
  },
};
</script>
<style>
.rotated-japanese {
  transform: rotate(12.5deg);
}

.slide-enter-active {
  animation: slide-animation 0.3s ease-in forwards;
}
.slide-leave-active {
  animation: slide-animation 0.3s ease-in forwards reverse;
}

@keyframes slide-animation {
  0% {
    max-height: 0;
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    max-height: 1000px;
    opacity: 1;
  }
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

.min-height-screen-calc {
  min-height: calc(100vh - 4rem);
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
