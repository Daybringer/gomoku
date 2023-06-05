<template>
  <div class="flex flex-1 flex-col">
    <div class="flex flex-row justify-evenly">
      <!-- <ContainerItem>
        {{ players[fID].username }}
      </ContainerItem> -->
      <MatchRecordProfileLink
        :username="players[fID].username!"
        :logged="!!players[fID].userID"
        :profile-icon="players[fID].profileIcon"
        :userID="players[fID].userID"
      >
      </MatchRecordProfileLink>
      <BaseLowHeadline>VS</BaseLowHeadline>
      {{ players[sID].username }}
    </div>
    <div>RESULT</div>
  </div>
</template>

<script setup lang="ts">
import { ExpandedPlayerGameProfile } from "@/shared/interfaces/playerGameProfile.interface";
import ContainerItem from "../components/ContainerItem.vue";
import { GameType } from "@/shared/types";
import { EndingType } from "@/shared/types";
import BaseLowHeadline from "./BaseLowHeadline.vue";
import MatchRecordProfileLink from "./MatchRecordProfileLink.vue";

const props = defineProps<{
  winnerID?: number;
  players: Record<number, ExpandedPlayerGameProfile>;
  gameType: GameType;
  endingType: EndingType;
  timeLimit: number;
  date: Date;
}>();

const [fID, sID] = Object.keys(props.players).map(Number);
console.log(props.players);
</script>
