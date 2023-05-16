<template>
  <div
    class="bg-white dark:bg-gray-600 w-full rounded-lg min-h-12 p-2 grid md:grid-cols-2 gap-1 items-stretch md:flex-row md:justify-between shadow-md"
  >
    <!-- Names and icons -->
    <div class="grid grid-cols-11 items-center flex-1 gap-1 mb-2 md:mb-0">
      <icon-name-box
        :logged="true"
        :username="game.me.username"
        :userID="game.me.id"
        :profile-icon="game.me.profileIcon"
        class="col-span-5"
      />
      <p class="text-lg text-center">VS</p>
      <icon-name-box
        :userID="game.opponent.id"
        :logged="game.opponent.logged"
        :username="game.opponent.username"
        :profile-icon="game.opponent.profileIcon"
        class="col-span-5"
      />
    </div>
    <!-- Stuff -->
    <div class="grid grid-flow-col-dense items-center gap-2">
      <profile-match-blade-win-lose-icon
        class="col-span-1"
        :tie="game.typeOfWin === EndingType.Tie"
        :win="game.win"
      />
      <profile-match-blade-game-type-icon
        class="col-span-1"
        :gameType="game.type"
      />
      <div class="col-span-1">{{ eloGain }}</div>
      <div class="text-lg col-span-2">{{ humanDate }}</div>
      <profile-match-blade-game-link
        :gameID="game.id"
      ></profile-match-blade-game-link>
    </div>
  </div>
</template>
<script setup lang="ts">
import IconNameBox from "./MatchRecordIconNameBox.vue";
import ProfileMatchBladeWinLoseIcon from "./ProfileMatchBladeWinLoseIcon.vue";
import ProfileMatchBladeGameTypeIcon from "./ProfileMatchBladeGameTypeIcon.vue";
import ProfileMatchBladeGameLink from "@/components/ProfileMatchBladeGameLink.vue";
import { EndingType, GameType } from "@/shared/types";
import { computed, defineProps } from "vue";
import { ExpandedGame } from "@/shared/interfaces/game.interface";

const props = defineProps<{
  game: ExpandedGame;
}>();
const eloGain = computed(() => {
  if (props.game.type === GameType.Ranked) {
    if (props.game.me.delta > 0) {
      return `+${props.game.me.delta}`;
    } else {
      return `${props.game.me.delta}`;
    }
  }
  return "--";
});

const humanDate = computed(() => {
  const date = new Date(props.game.dateString);
  return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
});
</script>
