<template>
  <div>
    <div class="w-full min-height-screen-calc flex flex-col" id="home">
      <div class="relative h-20 md:h-24 w-full bg-gray-800 text-center">
        <div class="m-auto top-0">
          <span class="text-gray-300 font-semibold italic">Let's play</span>
          <span class="bold-text">Gomoku</span>
          <span class="bold-text">Five in a row</span>
          <span class="bold-text">五目並べ</span>
          <span class="bold-text">Fünf in eine Reihe</span>
        </div>
      </div>
      <div class="m-auto">
        <button
          class="bg-gomoku-blue hover:bg-gomoku-blue-dark text-white font-bold py-2 px-12 rounded focus:shadow-outline focus:outline-none"
        >
          Play
        </button>
      </div>
    </div>
    <div id="matches" class="w-full min-height-screen-calc bg-pink-400"></div>
    <div id="rules" class="w-full min-height-screen-calc bg-gomoku-grey"></div>
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
.min-height-screen-calc {
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
  top: 50%;
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
