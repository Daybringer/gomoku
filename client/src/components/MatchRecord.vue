<template>
  <div
    class="bg-white dark:bg-gray-600 w-full rounded-lg min-h-12 p-2 grid md:grid-cols-2 gap-1 items-stretch md:flex-row md:justify-between shadow-md"
  >
    <!-- Names and icons -->
    <div
      class="grid grid-cols-11 items-center flex-1 gap-2 md:gap-0 mb-2 md:pr-2 md:mb-0"
    >
      <BaseProfileLink
        :logged="!!pOneGameProfile.userID"
        :userID="pOneGameProfile.userID"
        :username="pOneGameProfile.username"
        :profile-icon="pOneGameProfile.profileIcon"
        class="col-span-5"
      />
      <p class="text-lg text-center">VS</p>
      <BaseProfileLink
        :userID="pTwoGameProfile.userID"
        :logged="!!pTwoGameProfile.userID"
        :username="pTwoGameProfile.username"
        :profile-icon="pTwoGameProfile.profileIcon"
        class="col-span-5"
      />
    </div>
    <div class="grid grid-flow-col-dense items-center justify-around gap-2">
      <ResultIcon
        class="col-span-1"
        :tie="game.typeOfWin === EndingType.Tie"
        :win="game.winnerGameProfileID == ownGameProfileID"
      />
      <GameTypeIcon class="col-span-1" :gameType="game.type" />
      <div>{{ eloGain }}</div>
      <div class="text-lg col-span-2">
        {{ getDateFromDate(String(game.createdAt)) }}
      </div>
      <GameLink :gameID="game.id" />
    </div>
  </div>
</template>
<script setup lang="ts">
//Components
import BaseProfileLink from "./BaseProfileLink.vue";
import GameLink from "@/components/MatchRecordGameLink.vue";
import ResultIcon from "./MatchRecordResultIcon.vue";
import GameTypeIcon from "./MatchRecordGameTypeIcon.vue";
// TS
import { EndingType, GameType } from "@/shared/types";
import { computed, defineProps, ref } from "vue";
import { ExpandedGame } from "@/shared/interfaces/game.interface";
import { getDateFromDate } from "@/utils/general";

const props = defineProps<{
  game: ExpandedGame;
  userID: number;
}>();
const [pOneID, pTwoID] = [
  ...Object.keys(props.game.expandedPlayerGameProfiles).map((val) => {
    return Number(val);
  }),
];
const [pOneGameProfile, pTwoGameProfile] = [
  props.game.expandedPlayerGameProfiles[pOneID],
  props.game.expandedPlayerGameProfiles[pTwoID],
];

const ownGameProfileID = ref(
  props.game.expandedPlayerGameProfiles[pOneID].userID === props.userID
    ? props.game.expandedPlayerGameProfiles[pOneID].id
    : props.game.expandedPlayerGameProfiles[pTwoID].id
);

const eloGain = computed(() => {
  const elo =
    props.game.expandedPlayerGameProfiles[ownGameProfileID.value].eloDelta;
  if (props.game.type === GameType.Ranked && elo) {
    if (elo > 0) {
      return `+${elo}`;
    }
    return `${elo}`;
  }
  return "--";
});
</script>
