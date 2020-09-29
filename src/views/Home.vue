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
        class="text-5xl mt-8 md:mt-8 2xl:mt-16 text-gray-800 font-semibold w-full text-center"
      >
        Rules
      </h2>
      <div
        class=" w-90 mt-5 flex-1 p-4 flex flex-row mb-8 bg-gray-800 rounded-2xl md:rounded-2xl m-auto"
      >
        <div class="mr-4 w-10 bg-gray-300 flex flex-col">
          <div
            class="flex-1 flex m-auto w-full bg-gray-500"
            @click="activeRule = 'basics'"
          >
            <div class="m-auto">Basics</div>
          </div>
          <div
            class="flex-1 flex m-auto w-full bg-gray-600"
            @click="activeRule = 'matches'"
          >
            <div class="m-auto">Game Types</div>
          </div>
          <div
            class="flex-1 flex m-auto w-full bg-gray-700"
            @click="activeRule = 'swap'"
          >
            <div class="m-auto">SWAP</div>
          </div>
        </div>
        <div class="flex-1 flex flex-col bg-gray-300">
          <div class="w-full text-center bg-gray-600">
            <h3 v-show="activeRule === 'basics'" class="text-gray-900 text-4xl">
              Basics
            </h3>
            <h3
              v-show="activeRule === 'matches'"
              class="text-gray-900 text-4xl"
            >
              Game Types
            </h3>
            <h3 v-show="activeRule === 'swap'" class="text-gray-900 text-4xl">
              SWAP
            </h3>
          </div>
          <div v-show="activeRule === 'basics'" class="flex-1 bg-gray-500">
            basicbasicbasic
          </div>
          <div v-show="activeRule === 'matches'" class="flex-1 bg-gray-500">
            gametypegametypegametype
          </div>
          <div v-show="activeRule === 'swap'" class="flex-1 bg-gray-500">
            swapswapswapswap
          </div>
        </div>
      </div>
    </div>
    <div id="origins" class="w-full min-height-screen-calc bg-gray-200"></div>
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
