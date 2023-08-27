<template>
  <div class="flex flex-col gap-6 justify-center">
    <!-- PLAYER LINKS -->
    <div
      class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4"
    >
      <BaseProfileLink
        :is-logged="!!fUser"
        :profile-icon="fUser ? fUser.settings.selectedIcon : ProfileIcon.guest"
        :user-id="fUser ? fUser.id : undefined"
        :username="fUser ? fUser.username : 'Guest'"
      />
      <p class="text-3xl">VS</p>
      <BaseProfileLink
        :is-logged="!!sUser"
        :profile-icon="sUser ? sUser.settings.selectedIcon : ProfileIcon.guest"
        :user-id="sUser ? sUser.id : undefined"
        :username="sUser ? sUser.username : 'Guest'"
      />
    </div>
    <!-- RESULT -->
    <div class="flex md:flex-row items-center justify-center gap-12">
      <MatchRecordResultIcon
        :win="fProfile.isWinner"
        :tie="game.typeOfWin === EndingType.Tie"
      />
      <p class="text-3xl">Result</p>
      <MatchRecordResultIcon
        :win="sProfile.isWinner"
        :tie="game.typeOfWin === EndingType.Tie"
      />
    </div>
    <!-- TIMES LEFT -->
    <div class="flex flex-row items-center justify-center gap-12">
      <p class="text-2xl">{{ humanReadableTime(fProfile.timeLeft) }}</p>
      <p class="text-2xl md:text-3xl whitespace-nowrap">Time left</p>
      <p class="text-2xl">{{ humanReadableTime(sProfile.timeLeft) }}</p>
    </div>
    <!-- ELO DIFF -->
    <div
      v-if="fProfile.eloDelta && sProfile.eloDelta"
      class="flex flex-row items-center justify-center gap-12"
    >
      <p
        class="text-2xl"
        :class="fProfile.eloDelta > 0 ? 'text-green-500' : 'text-red-500'"
      >
        {{ (fProfile.eloDelta > 0 ? "+" : "") + fProfile.eloDelta }}
      </p>
      <p class="text-2xl md:text-3xl whitespace-nowrap">ELO delta</p>
      <p
        class="text-2xl"
        :class="sProfile.eloDelta > 0 ? 'text-green-500' : 'text-red-500'"
      >
        {{ (sProfile.eloDelta > 0 ? "+" : "") + sProfile.eloDelta }}
      </p>
    </div>
    <!-- REST - INFO PILLS -->
    <div
      class="flex flex-col md:flex-row justify-center items-center gap-2 flex-wrap"
    >
      <BaseInfoPill title="Match type">
        <MatchRecordGameTypeIcon class="p-2" :game-type="game.type" />
      </BaseInfoPill>
      <BaseInfoPill title="Time limit">{{
        humanReadableTime((game.gameSettings.timeLimitInSeconds || 0) * 1000)
      }}</BaseInfoPill>
      <BaseInfoPill title="Game ending">
        <GameEndingTypeIcon :game-ending="game.typeOfWin" />
      </BaseInfoPill>
      <BaseInfoPill title="Game Opening">
        {{ game.gameSettings.openingType }}
      </BaseInfoPill>
      <BaseInfoPill title="Date">
        {{ getDateTimeFromDate(String(game.createdAt)) }}
      </BaseInfoPill>
    </div>
  </div>
</template>

<script setup lang="ts">
import { humanReadableTime, getDateTimeFromDate } from "@/utils/general";
import { EndingType, GameType } from "@/shared/types";
import BaseInfoPill from "@/components/BaseInfoPill.vue";
import MatchRecordResultIcon from "./MatchRecordResultIcon.vue";
import MatchRecordGameTypeIcon from "./MatchRecordGameTypeIcon.vue";
import GameEndingTypeIcon from "./GameEndingTypeIcon.vue";
import BaseProfileLink from "./BaseProfileLink.vue";
import { Game } from "@/shared/interfaces/game.interface";
import { ProfileIcon } from "@/shared/icons";

const props = defineProps<{
  game: Game;
}>();

const [fProfile, sProfile] = [...props.game.playerGameProfiles];
const [fUser, sUser] = [fProfile.user, sProfile.user];
</script>
