<template>
  <div
    v-if="phase != 'hidden'"
    class="fancy-background px-4 py-2 rounded-lg flex justify-center place-items-center w-full h-14 md:h-16 mb-4 bg-gray-100 dark:bg-gray-700">
    <div
      class="flex justify-center place-items-center rounded-lg flex-1 h-full bg-gray-100 dark:bg-gray-800">
      <Transition name="slidetop">
        <div
          class="flex-1 flex flex-row justify-around place-items-center"
          v-show="
            phase === 'iChoose' ||
            (phase === 'opponentChooses' && isCustomLocal)
          ">
          <p class="text-lg md:text-xl">Choose a symbol:</p>
          <div class="flex self-center gap-4 md:gap-8">
            <BaseButton @click="emit('pickGameStone', Symbol.Cross)">
              <GameStoneCircle
                v-if="!hasClassicGameboard"
                class="h-7 w-7"
                :style="`color:${
                  mySymbol === Symbol.Circle ? myColor : opponentColor
                };`" />
              <ClassicStone
                class="h-7"
                v-show="hasClassicGameboard"
                :style="`color:${
                  mySymbol === Symbol.Circle ? myColor : opponentColor
                };`" />
            </BaseButton>
            <BaseButton @click="emit('pickGameStone', Symbol.Cross)">
              <GameStoneCross
                v-if="!hasClassicGameboard"
                class="h-8 w-8"
                :style="`color:${
                  mySymbol === Symbol.Cross ? myColor : opponentColor
                };`" />
              <ClassicStone
                class="h-8"
                v-show="hasClassicGameboard"
                :style="`color:${
                  mySymbol === Symbol.Cross ? myColor : opponentColor
                };`" />
            </BaseButton>
          </div>
        </div>
      </Transition>
      <Transition name="slidetop">
        <p
          class="text-lg"
          v-show="phase === 'opponentChooses' && !isCustomLocal">
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
import ClassicStone from "@/assets/svg/ClassicStone.vue";
import BaseButton from "./BaseButton.vue";
defineProps<{
  phase: "opponentChooses" | "iChoose" | "iPlace" | "opponentPlaces" | "hidden";
  mySymbol: Symbol;
  myColor: string;
  opponentColor: string;
  isCustomLocal?: boolean;
  hasClassicGameboard?: boolean;
}>();
const emit = defineEmits<{ (e: "pickGameStone", symbol: Symbol) }>();
</script>
