<template>
  <div
    class="bg-white dark:bg-gray-600 w-full rounded-lg min-h-12 p-2 grid md:grid-cols-2 gap-1 items-stretch md:flex-row md:justify-between shadow-md">
    <!-- Names and icons -->
    <div
      class="grid grid-cols-11 items-center flex-1 gap-2 md:gap-0 mb-2 md:pr-2 md:mb-0">
      <BaseProfileLink
        class="col-span-5"
        :profile-icon="fUser ? fUser.settings.selectedIcon : ProfileIcon.guest"
        :user-id="fUser?.id"
        :username="fUser ? fUser.username : 'Guest'" />
      <p class="text-lg text-center">VS</p>
      <BaseProfileLink
        class="col-span-5"
        :profile-icon="sUser ? sUser.settings.selectedIcon : ProfileIcon.guest"
        :user-id="sUser?.id"
        :username="sUser ? sUser.username : 'Guest'" />
    </div>
    <div class="grid grid-flow-col-dense items-center justify-around gap-2">
      <ResultIcon
        class="col-span-1"
        :tie="game.typeOfWin === EndingType.Tie"
        :win="ownGameProfile.isWinner" />
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
import { EndingType } from "@/shared/types";
import { computed, ref } from "vue";
import { Game } from "@/shared/interfaces/game.interface";
import { getDateFromDate } from "@/utils/general";
import { ProfileIcon } from "@/shared/icons";

const props = defineProps<{
  game: Game;
  userId: number;
}>();
const [pGameProfile, sGameProfile] = [...props.game.playerGameProfiles];

const fUser = pGameProfile.user;
const sUser = sGameProfile.user;

const ownGameProfile = ref(
  fUser && fUser.id === props.userId ? pGameProfile : sGameProfile
);

const eloGain = computed(() => {
  const elo = ownGameProfile.value.eloDelta;
  if (!elo) return "--";

  if (elo > 0) {
    return `+${elo}`;
  }
  return `${elo}`;
});
</script>
