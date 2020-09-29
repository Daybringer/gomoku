<template>
  <div>
    <div class="w-full min-height-screen-calc flex flex-col" id="home">
      <div class="relative h-20 md:h-24 w-full bg-gray-800 text-center">
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
      <div class="w-full h-full bg-gray-300 flex rounded relative">
        <div class="absolute bg-gray-800 top-0 h-20 z-30 w-full"></div>
        <div class="absolute flex rounder-inner-div bg-white z-40">
          <div class="m-auto">
            <button
              class="border-gray-800 border-4 text-gray-800 text-xl font-bold py-3 px-24 rounded-lg focus:shadow-outline focus:outline-none"
            >
              Play
            </button>
          </div>
        </div>
      </div>
    </div>
    <div
      id="matches"
      class="w-full min-height-screen-calc pt-5 md:pt-10 flex bg-gray-300 flex-col"
    >
      <div class="relative h-24 md:h-40 w-full text-center flex ">
        <div class="m-auto">
          <h1 class="text-5xl text-gray-800 font-semibold">Matches</h1>
        </div>
      </div>
      <div class="w-full h-full bg-gray-300 flex rounded relative">
        <div
          class="m-auto gap-y-6 grid grid-cols-1 md:grid-cols-2 md:mt-3 z-40"
        >
          <div class="flex ">
            <div class="m-auto transform hover:scale-105">
              <router-link to="/q/search">
                <img
                  class="w-90 sm:w-80 m-auto"
                  src="../assets/boxMatchQuick.svg"
                />
              </router-link>
            </div>
          </div>
          <div class="flex">
            <div class="m-auto transform hover:scale-105">
              <router-link to="/q/search">
                <img
                  class="w-90 sm:w-80 m-auto"
                  src="../assets/boxMatchRanked.svg"
                />
              </router-link>
            </div>
          </div>
          <div class="flex">
            <div class="m-auto transform hover:scale-105">
              <router-link to="/q/search">
                <img
                  class="w-90 sm:w-80 m-auto"
                  src="../assets/boxMatchCustom.svg"
                />
              </router-link>
            </div>
          </div>
          <div class="flex">
            <div class="m-auto transform hover:scale-105">
              <router-link to="/q/search">
                <img
                  class="w-90 sm:w-80 m-auto"
                  src="../assets/boxMatchAI.svg"
                />
              </router-link>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div
      id="rules"
      class=" relative w-full min-height-screen-calc pb-5 bg-gray-300"
    >
      <div class="flex">
        <div class="m-auto">
          <h1 class="text-5xl text-gray-800 font-semibold">Rules</h1>
        </div>
      </div>
      <div
        class="h-80 w-90 mt-5 bg-gray-800 rounded-2xl md:rounded-4xl m-auto"
      ></div>
    </div>
    <div
      id="origins"
      class="w-full min-height-screen-calc bg-gomoku-yellow"
    ></div>
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
    return {};
  },
};
</script>
<style>
.rounder-inner-div {
  height: 90%;
  width: 90%;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border-radius: 0.65rem;
}

.rounder-inner-div-matches {
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

@media (min-width: 640px) {
  .rounder-inner-div-matches {
    height: 85%;
    width: 100%;
    top: 30%;
    border-radius: 2rem;
  }
  .rounder-inner-div {
    border-radius: 2rem;
  }
}

.min-height-screen-calc {
  min-height: calc(100vh - 4rem);
  height: calc(100vh - 4rem);
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
