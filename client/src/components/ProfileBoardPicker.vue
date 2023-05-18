<template>
  <button
    @click="$emit('setBoard', type)"
    :class="
      isActive ? 'border-gray-800 dark:border-gray-300 ' : 'border-transparent'
    "
    class="border-4 p-1 rounded-md hover:opacity-80"
  >
    <base-low-headline>{{ type }}</base-low-headline>
    <div class="p-1">
      <classic-board-icon
        class="h-16 md:h-20"
        v-if="type === GameBoard.Classic"
      />
      <modern-board-icon
        :player-color="playerColor"
        :opponent-color="opponentColor"
        class="h-16 md:h-20"
        v-if="type === GameBoard.Modern"
      />
      <standard-board-icon
        :player-color="playerColor"
        :opponent-color="opponentColor"
        class="h-16 md:h-20"
        v-if="type === GameBoard.Standard"
      />
    </div>
  </button>
</template>
<script setup lang="ts">
import ClassicBoardIcon from "@/assets/svg/ClassicBoardIcon.vue";
import ModernBoardIcon from "@/assets/svg/ModernBoardIcon.vue";
import StandardBoardIcon from "@/assets/svg/StandardBoardIcon.vue";
import BaseLowHeadline from "@/components/BaseLowHeadline.vue";
import { GameBoard } from "@/shared/types";
import { computed } from "@vue/reactivity";
const props = defineProps<{
  type: GameBoard;
  current: GameBoard;
  playerColor: string;
  opponentColor: string;
}>();
const isActive = computed(() => props.current === props.type);

defineEmits<{ (e: "setBoard", gameBoard: GameBoard) }>();
</script>
