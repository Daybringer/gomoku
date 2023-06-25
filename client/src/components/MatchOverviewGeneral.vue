<template>
  <div class="flex flex-col gap-6 justify-center">
    <div
      class="flex flex-col md:flex-row items-center justify-center gap-1 md:gap-4"
    >
      <MatchRecordProfileLink
        :username="players[fID].username!"
        :logged="!!players[fID].userID"
        :profile-icon="players[fID].profileIcon"
        :userID="players[fID].userID"
      />
      <p class="text-3xl">VS</p>
      <MatchRecordProfileLink
        :username="players[sID].username!"
        :logged="!!players[sID].userID"
        :profile-icon="players[sID].profileIcon"
        :userID="players[sID].userID"
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
      <p class="text-2xl whitespace-nowrap">Time left</p>
      <p class="text-xl">{{ humanReadableTime(players[sID].timeLeft) }}</p>
    </div>
    <div class="flex flex-col items-center gap-4">
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
    </div>
  </div>
</template>

<script setup lang="ts">
import { ExpandedPlayerGameProfile } from "@/shared/interfaces/playerGameProfile.interface";
import { GameType, Opening } from "@/shared/types";
import { humanReadableTime } from "@/utils/general";
import { EndingType } from "@/shared/types";
import BaseInfoPill from "@/components/BaseInfoPill.vue";
import MatchRecordProfileLink from "./MatchRecordProfileLink.vue";
import MatchRecordResultIcon from "./MatchRecordResultIcon.vue";
import MatchRecordGameTypeIcon from "./MatchRecordGameTypeIcon.vue";
import GameEndingTypeIcon from "./GameEndingTypeIcon.vue";

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
