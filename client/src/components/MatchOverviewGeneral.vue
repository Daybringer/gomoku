<template>
  <div>
    <div>{{ players[fID].username }}<span>VS</span></div>
  </div>
</template>

<script setup lang="ts">
import { ExpandedPlayerGameProfile } from "@/shared/interfaces/playerGameProfile.interface";
import { GameType } from "@/shared/types";
import { EndingType } from "@/shared/types";

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
