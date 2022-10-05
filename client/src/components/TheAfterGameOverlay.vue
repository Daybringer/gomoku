<template>
  <div class="absolute z-20 h-full w-full ">
    <button
      v-show="!isShown"
      @click="isShown = true"
      class="absolute top-2 left-2 p-1 rounded-full bg-gray-200  text-gray-900 focus:outline-none"
    >
      <chevrons-down-icon-svg class="h-8 w-8 -rotate-45 transform" />
    </button>

    <transition name="bounce">
      <div
        class="absolute z-20 flex p-6 xl:p-12 flex-col h-full w-full bg-gray-100 dark:bg-gray-800"
        :class="
          isShown
            ? !isTie
              ? amIWinner
                ? 'victory-background'
                : 'defeat-background'
              : 'tie-background'
            : 'minimizeAfterGameModal'
        "
        v-show="isShown"
      >
        <div
          class="w-full h-full rounded-lg p-4 bg-white dark:bg-gray-700 shadow-2xl flex relative justify-start place-items-center flex-col gap-6"
        >
          <button
            class="absolute top-3 left-3 p-1 rounded-full bg-gray-200 dark:bg-gray-300 text-gray-900 focus:outline-none"
            @click="isShown = false"
          >
            <cross-icon-svg class="h-8" />
          </button>
          <h1
            class="w-full text-center text-5xl p-4 xl:text-7xl font-medium text-gomoku-blue"
          >
            {{ amIWinner ? "Victory!" : "Defeat!" }}
          </h1>
          <h3
            v-show="hasEndedByDisconnect"
            class="w-full text-center text-gray-800 text-2xl"
          >
            Opponent has disconnected
          </h3>
          <!-- Elo gains  -->
          <div
            class="text-center border-4 border-opacity-80 px-6 xl:px-12 py-2 xl:text-2xl text-xl font-medium rounded-xl bg-gray-100 dark:bg-gray-600"
            :class="myElo > 0 ? 'border-green-500' : 'border-red-500'"
            v-if="myElo !== 0"
          >
            {{ eloGain }}
          </div>
          <router-link
            :to="newGameURL"
            class="justify-self-end my-auto w-full py-2 xl:py-4 text-center rounded-lg font-medium text-lg text-white bg-gomoku-blue hover:bg-gomoku-blue-dark focus:bg-gomoku-blue-dark"
          >
            New Game
          </router-link>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { EndingType } from "@/shared/types";
import { defineComponent, PropType } from "vue";
// SVGs
import CrossIconSvg from "@/assets/svg/CrossIconSvg.vue";
import ChevronsDownIconSvg from "@/assets/svg/ChevronsDownIconSvg.vue";
export default defineComponent({
  name: "",
  props: {
    myElo: { type: Number, required: true },
    amIWinner: { type: Boolean, required: true },
    endingType: { type: Object as PropType<EndingType>, required: true },
    newGameURL: { type: String, required: true },
  },
  components: {
    CrossIconSvg,
    ChevronsDownIconSvg,
  },
  data(): { isShown: boolean } {
    return { isShown: false };
  },
  computed: {
    isTie(): boolean {
      return this.endingType === EndingType.Tie;
    },
    hasEndedByDisconnect(): boolean {
      return this.endingType === EndingType.Surrender;
    },
    hasEndedByTimeLimit(): boolean {
      return this.endingType === EndingType.Time;
    },
    hasEndedByCombination(): boolean {
      return this.endingType === EndingType.Combination;
    },
    eloGain(): string {
      if (this.myElo > 0) {
        return `+${this.myElo} ELO`;
      } else {
        return `${this.myElo} ELO`;
      }
    },
  },
  methods: {},
  watch: {
    endingType: {
      handler() {
        this.isShown = true;
      },
      deep: true,
    },
  },
  mounted() {},
});
</script>
<style scoped>
.victory-background {
  background-image: url("../assets/svg/confettiPattern.svg");
  background-repeat: repeat;
}
.defeat-background {
  background-image: url("../assets/svg/leavesPattern.svg");
  background-repeat: repeat;
}
.tie-background {
}

.bounce-enter-active {
  animation: bounce-in 0.4s ease-out;
}
.bounce-leave-active {
  animation: bounce-in 0.4s reverse ease-out;
}
@keyframes bounce-in {
  0% {
    transform: scale(0);
    opacity: 0%;
  }
  100% {
    transform: scale(1);
    opacity: 100%;
  }
}
</style>
