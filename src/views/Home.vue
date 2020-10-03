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
          <span class="bold-text">Gomoku</span>
          <span class="bold-text">Five in a row</span>
          <span class="bold-text">五目並べ</span>
          <span class="bold-text">Fünf in eine Reihe</span>
        </div>
      </div>

      <div class=" bg-gray-800 h-20 z-30 w-full m-auto"></div>
      <div
        class=" w-90 h-90 flex flex-1 mb-8 bg-white z-40 m-auto rounded-xl md:rounded-2xl -mt-16 md:-mt-12"
      >
        <div class="m-auto">
          <button
            class="border-gray-800 border-4 text-gray-800 text-xl font-bold py-3 px-24 rounded-lg focus:shadow-outline focus:outline-none"
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
        class="text-5xl mt-8 md:mt-8 2xl:mt-12 text-gray-800 font-semibold w-full text-center"
      >
        Matches
      </h2>
      <div
        class=" mx-auto mb-auto md:mt-16 2xl:mt-32  w-90 md:w-60 gap-8 grid grid-cols-1 md:grid-cols-2 z-40"
      >
        <div class="flex ">
          <div
            class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
          >
            <router-link to="/q/search" class="">
              <img class="" src="../assets/boxMatchQuick.svg" />
            </router-link>
          </div>
        </div>
        <div class="flex">
          <div
            class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
          >
            <router-link to="/q/search">
              <img src="../assets/boxMatchRanked.svg" />
            </router-link>
          </div>
        </div>
        <div class="flex">
          <div
            class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
          >
            <router-link to="/q/search">
              <img src="../assets/boxMatchCustom.svg" />
            </router-link>
          </div>
        </div>
        <div class="flex">
          <div
            class="m-auto transform hover:scale-105 transition-transform ease-in duration-75"
          >
            <router-link to="/q/search">
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
        class="text-5xl mt-4 md:mt-4 2xl:mt-4 text-gray-800 font-semibold w-full text-center"
      >
        Rules
      </h2>
      <div
        class=" w-90 mt-4 flex-1 p-4 grid grid-flow-row xl:grid-flow-col xl:grid-cols-7 xl:grid-rows-4 gap-4 mb-8 bg-gray-800 rounded-xl m-auto"
      >
        <div
          class="xl:row-span-2 xl:col-span-4 p-2 pl-3 rounded-md bg-gray-700 row-start-1"
        >
          <h3 class="font-semibold text-lg md:text-2xl text-gray-200">
            Basics
          </h3>
          <ul class="list-disc list-inside text-gray-300 font-normal p-3">
            <li class="pb-3">Played on <b>15x15</b> gameboard</li>
            <li class="pb-3">time is measured with chess clocks</li>
            <li class="pb-3">
              player who makes an unbroken row of exactly <b>5</b> stones in any
              direction <b>wins</b> the game
            </li>

            <li class="pb-3">
              Starting player is randomly decided by coin flip
            </li>
            <li class="pb-3">
              Players alternate their turns until somebody wins or whole board
              is filled, when the game ends as a tie
            </li>
            <li class="pb-3">
              Game either starts with simple start or with more advanced
              starting technique called SWAP
            </li>
          </ul>
        </div>
        <div
          class="row-span-1 xl:col-span-4 p-2 pl-3 rounded-md bg-gray-700 row-start-3"
        >
          <h3 class="font-semibold text-lg md:text-2xl text-gray-200">SWAP1</h3>
          <ul class="list-disc list-inside text-gray-300 font-normal p-3">
            <li class="pb-3">
              Starting player is randomly decided by coin flip
            </li>
            <li class="pb-3">
              Players alternate their turns until somebody wins or whole board
              is filled, when the game ends as a tie
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
        <div
          class="row-span-1 xl:col-span-4 p-2 pl-3 rounded-md bg-gray-700 row-start-4"
        >
          <h3 class="font-semibold text-lg md:text-2xl text-gray-200">SWAP2</h3>
          <ul class="list-disc list-inside text-gray-300 font-normal p-3">
            <li class="pb-3">
              Starting player is randomly decided by coin flip
            </li>
            <li class="pb-3">
              Players alternate their turns until somebody wins or whole board
              is filled, when the game ends as a tie
            </li>
            <li class="pb-3">
              Game either starts with simple start or with more advanced
              starting technique called SWAP
            </li>
          </ul>
        </div>
        <div
          class="xl:row-span-4 xl:col-span-3 rounded-md bg-gray-700 flex flex-col  text-center row-start-2"
        >
          <h3 class="mt-2 text-lg md:text-2xl text-gray-200  font-semibold">
            Game types
          </h3>
          <div class="flex-1 bg-gray-800 m-4 rounded-md p-2 pl-3">
            <h3 class="text-gray-200 text-left font-medium text-lg underline">
              Quick
            </h3>
            <ul
              class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
            >
              <li class="pb-3">
                Starting player is randomly decided by coin flip
              </li>
              <li class="pb-3">
                Players alternate their turns until somebody wins or whole board
                is filled, when the game ends as a tie
              </li>
              <li class="pb-3">
                Game either starts with simple start or with more advanced
                starting technique called SWAP
              </li>
            </ul>
          </div>
          <div class="flex-1 bg-gray-800 m-4 rounded-md p-2 pl-3">
            <h3 class="text-gray-200 text-left font-medium text-lg underline">
              Ranked
            </h3>
            <ul
              class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
            >
              <li class="pb-3">
                Starting player is randomly decided by coin flip
              </li>
              <li class="pb-3">
                Players alternate their turns until somebody wins or whole board
                is filled, when the game ends as a tie
              </li>
              <li class="pb-3">
                Game either starts with simple start or with more advanced
                starting technique called SWAP
              </li>
            </ul>
          </div>
          <div class="flex-1 bg-gray-800 m-4 rounded-md p-2 pl-3">
            <h3 class="text-gray-200 text-left font-medium underline text-lg">
              Custom
            </h3>
            <ul
              class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
            >
              <li class="pb-3">
                Starting player is randomly decided by coin flip
              </li>
              <li class="pb-3">
                Players alternate their turns until somebody wins or whole board
                is filled, when the game ends as a tie
              </li>
              <li class="pb-3">
                Game either starts with simple start or with more advanced
                starting technique called SWAP
              </li>
            </ul>
          </div>
          <div class="flex-1 bg-gray-800 m-4 rounded-md p-2 pl-3">
            <h3 class="text-white text-left font-medium underline text-lg">
              AI
            </h3>
            <ul
              class="list-disc list-inside text-gray-300 font-normal p-3 text-left"
            >
              <li class="pb-3">
                Starting player is randomly decided by coin flip
              </li>
              <li class="pb-3">
                Players alternate their turns until somebody wins or whole board
                is filled, when the game ends as a tie
              </li>
              <li class="pb-3">
                Game either starts with simple start or with more advanced
                starting technique called SWAP
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
    <div
      id="origins"
      class="w-full min-height-screen-calc flex bg-gray-300 flex-col"
    >
      <h2
        class="text-5xl mt-4 md:mt-4 2xl:mt-4 text-gray-800 font-semibold w-full text-center"
      >
        Origins
      </h2>
      <div class="ml-auto mr-auto mt-4 w-90 leading-8">
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
    <div id="contact" class="w-full h-56 bg-gomoku-black"></div>
  </div>
</template>
<script>
export default {
  name: "Home",
  props: { logged: Boolean },
  components: {},
  mounted() {},
  data() {
    return {
      activeRule: "basics",
    };
  },
};
</script>
<style>
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
  animation: fadeIn ease 12s infinite;
  -webkit-animation: fadeIn ease 12s infinite;
  -moz-animation: fadeIn ease 12s infinite;
  -o-animation: fadeIn ease 12s infinite;
  -ms-animation: fadeIn ease 12s infinite;
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

@keyframes fadeIn {
  0% {
    opacity: 0;
    display: inline;
  }
  5% {
    opacity: 1;
    display: inline;
  }
  20% {
    opacity: 1;
    display: inline;
  }
  25% {
    opacity: 0;
    display: none;
  }
}
</style>
