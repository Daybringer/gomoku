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
          class="w-full h-full rounded-lg p-4 bg-white dark:bg-gray-700 shadow-2xl flex relative justify-start place-items-center flex-col md:gap-6 gap-2"
        >
          <button
            class="absolute top-3 left-3 p-1 rounded-full bg-gray-200 dark:bg-gray-300 text-gray-900 focus:outline-none"
            @click="isShown = false"
          >
            <cross-icon-svg class="h-8" />
          </button>
          <h1
            class="w-full text-center text-5xl px-4 md:py-4 xl:text-7xl font-medium text-gomoku-blue"
          >
            {{ amIWinner ? "Victory!" : "Defeat!" }}
          </h1>
          <h3
            v-show="hasEndedByDisconnect"
            class="w-full text-center text-gray-800 md:text-2xl text-lg"
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
          <img
            v-show="!amIWinner"
            src="../assets/svg/lose.svg"
            class="sad-animation md:w-50 w-1/3  md:p-8 "
            alt=""
          />
          <img
            v-show="amIWinner"
            src="../assets/svg/win.svg"
            class="animation-bounce md:w-50 w-1/3 md:p-8 mt-4"
            alt=""
          />
          <base-button
            class="text-xl w-full  text-gray-50 font-medium mt-5"
            :class="
              askedForRematch
                ? 'bg-gray-400 dark:bg-gray-500'
                : 'bg-gomoku-blue dark:bg-gomoku-blue'
            "
            @click="playAgain"
            >{{ askedForRematch ? "Waiting for opponent" : newGameButtonText }}
          </base-button>
        </div>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { EndingType, GameType } from "@/shared/types";
import { defineComponent, PropType } from "vue";
import BaseButton from "@/components/BaseButton.vue";
// SVGs
import CrossIconSvg from "@/assets/svg/CrossIconSvg.vue";
import ChevronsDownIconSvg from "@/assets/svg/ChevronsDownIconSvg.vue";
export default defineComponent({
  name: "",
  props: {
    myElo: { type: Number, required: true },
    amIWinner: { type: Boolean, required: true },
    endingType: { type: Object as PropType<EndingType>, required: true },
    gameType: { type: Object as PropType<GameType>, required: true },
    askingForRematch: { type: Number, required: true },
  },
  emits: ["rematchCustom"],
  components: {
    CrossIconSvg,
    ChevronsDownIconSvg,
    BaseButton,
  },
  data(): { isShown: boolean; askedForRematch: boolean } {
    return { isShown: false, askedForRematch: false };
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
    newGameURL(): string {
      return `search?type=${this.gameType || ""}`;
    },
    newGameButtonText(): string {
      if (this.gameType === GameType.Custom) {
        return "Rematch game";
      } else {
        return "Search new game";
      }
    },
  },
  methods: {
    playAgain() {
      if (this.gameType === GameType.Custom) {
        if (!this.askedForRematch) {
          this.$emit("rematchCustom");
          this.askedForRematch = true;
        }
      } else {
        this.$router.push(this.newGameURL);
      }
    },
  },
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
</style>
