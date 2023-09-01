<template>
  <div
    v-show="phase != 'hidden'"
    class="fancy-background px-4 py-2 rounded-lg flex justify-center place-items-center w-full h-14 md:h-16 mb-4 bg-gray-100 dark:bg-gray-700"
  >
    <div
      class="flex justify-center place-items-center rounded-lg flex-1 h-full bg-gray-100 dark:bg-gray-800"
    >
      <Transition name="slidetop">
        <div
          class="flex-1 flex flex-row justify-around place-items-center"
          v-show="phase === 'iChoose'"
        >
          <p class="text-lg md:text-xl">Choose a symbol:</p>
          <div class="flex self-center gap-4 md:gap-8">
            <button
              @click="emit('pickGameStone', Symbol.Circle)"
              class="border-2 p-1 border-gray-700 dark:border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl"
            >
              <GameStoneCircle
                class="h-8 w-8"
                :style="`color:${
                  mySymbol === Symbol.Circle ? myColor : opponentColor
                };`"
              />
            </button>
            <button
              @click="emit('pickGameStone', Symbol.Cross)"
              class="border-2 p-1 border-gray-700 dark:border-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600 rounded-xl"
            >
              <GameStoneCross
                class="h-8 w-8"
                :style="`color:${
                  mySymbol === Symbol.Cross ? myColor : opponentColor
                };`"
              />
            </button>
          </div>
        </div>
      </Transition>
      <Transition name="slidetop">
        <p class="text-lg" v-show="phase === 'opponentChooses'">
          Opponent is choosing their symbol
        </p>
      </Transition>
      <Transition name="slidetop">
        <p class="text-lg" v-show="phase === 'opponentPlaces'">
          Enemy is placing first 3 stones
        </p>
      </Transition>
      <Transition name="slidetop">
        <p class="text-lg" v-show="phase === 'iPlace'">Place first 3 stones</p>
      </Transition>
    </div>
  </div>
</template>
<script setup lang="ts">
import { Symbol } from "@/shared/types";
import GameStoneCircle from "@/assets/svg/GameStoneCircle.vue";
import GameStoneCross from "@/assets/svg/GameStoneCross.vue";
defineProps<{
  phase: "opponentChooses" | "iChoose" | "iPlace" | "opponentPlaces" | "hidden";
  mySymbol: Symbol;
  myColor: string;
  opponentColor: string;
}>();
const emit = defineEmits<{ (e: "pickGameStone", symbol: Symbol) }>();
</script>
