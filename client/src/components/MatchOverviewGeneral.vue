<template>
  <div class="flex flex-col gap-6 justify-center">
    <div
      class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4"
    >
      <BaseProfileLink
        :username="players[fID].username!"
        :logged="!!players[fID].userID"
        :profile-icon="players[fID].profileIcon"
        :user-id="players[fID].userID"
      />
      <p class="text-3xl">VS</p>
      <BaseProfileLink
        :username="players[sID].username!"
        :logged="!!players[sID].userID"
        :profile-icon="players[sID].profileIcon"
        :user-id="players[sID].userID"
      />
    </div>
    <div class="flex md:flex-row items-center justify-center gap-12">
      <MatchRecordResultIcon
        :win="players[fID].id === winnerID"
        :tie="endingType === EndingType.Tie"
      />
      <p class="text-3xl">Result</p>
      <MatchRecordResultIcon
        :win="players[sID].id === winnerID"
        :tie="endingType === EndingType.Tie"
      />
    </div>
    <div class="flex flex-row items-center justify-center gap-12">
      <p class="text-xl">{{ humanReadableTime(players[fID].timeLeft) }}</p>
      <p class="text-2xl md:text-3xl whitespace-nowrap">Time left</p>
      <p class="text-xl">{{ humanReadableTime(players[sID].timeLeft) }}</p>
    </div>
    <div
      class="flex flex-col md:flex-row justify-center items-center gap-2 flex-wrap"
    >
      <BaseInfoPill title="Match type">
        <MatchRecordGameTypeIcon class="p-2" :game-type="gameType" />
      </BaseInfoPill>
      <BaseInfoPill title="Time limit">{{
        humanReadableTime(timeLimit * 1000)
      }}</BaseInfoPill>
      <BaseInfoPill title="Game ending">
        <GameEndingTypeIcon :game-ending="endingType" />
      </BaseInfoPill>
      <BaseInfoPill title="Game Opening">
        {{ gameOpening }}
      </BaseInfoPill>
      <BaseInfoPill title="Date">
        {{ getDateTimeFromDate(String(date)) }}
      </BaseInfoPill>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExpandedPlayerGameProfile } from "@/shared/interfaces/playerGameProfile.interface";
import { GameType, Opening } from "@/shared/types";
import { humanReadableTime, getDateTimeFromDate } from "@/utils/general";
import { EndingType } from "@/shared/types";
import BaseInfoPill from "@/components/BaseInfoPill.vue";
import MatchRecordResultIcon from "./MatchRecordResultIcon.vue";
import MatchRecordGameTypeIcon from "./MatchRecordGameTypeIcon.vue";
import GameEndingTypeIcon from "./GameEndingTypeIcon.vue";
import BaseProfileLink from "./BaseProfileLink.vue";

const props = defineProps<{
  winnerID?: number;
  players: Record<number, ExpandedPlayerGameProfile>;
  gameType: GameType;
  gameOpening: Opening;
  endingType: EndingType;
  timeLimit: number;
  date: Date;
}>();

const [fID, sID] = Object.keys(props.players).map(Number);
</script>
