<script setup lang="ts">
import BaseHighHeadline from "./BaseHighHeadline.vue";
import MatchRecord from "./MatchRecord.vue";
import MatchRecordsContainer from "./MatchRecordsContainer.vue";
import BaseButton from "./BaseButton.vue";
import { reactive, onMounted, ref } from "vue";
import BaseLoadingSpinner from "@/components/BaseLoadingSpinner.vue";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { Game } from "@/shared/interfaces/game.interface";
import { EndingType, GameType } from "@/shared/types";
const gameRepository = RepositoryFactory.getGameRepository;
const props = defineProps<{ userID: number }>();
const games: Game[] = reactive([]);
const matchesAreLoaded = ref(false);

onMounted(() => {
  fetchMatches();
});
function fetchMatches() {
  gameRepository
    .getGamesByUserIDDTO({
      userID: props.userID,
      skip: 0,
      take: 5,
      orderFromNewest: true,
      constraints: {
        allowedAmIWinner: [true, false],
        allowedEndingTypes: [
          EndingType.Combination,
          EndingType.Surrender,
          EndingType.Tie,
          EndingType.Time,
        ],
        allowedGameTypes: [GameType.Custom, GameType.Ranked, GameType.Quick],
      },
    })
    .then((res) => {
      res.data.games.forEach((game) => {
        games.push(game);
      });
      matchesAreLoaded.value = true;
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>
<template>
  <BaseHighHeadline>Match history</BaseHighHeadline>
  <MatchRecordsContainer>
    <!-- Displaying few loaded matches -->
    <MatchRecord
      :user-id="userID"
      v-for="game in games"
      :key="game.id"
      :game="game" />
    <BaseLoadingSpinner v-show="!matchesAreLoaded" />
    <BaseButton :link="'/profile/' + userID + '/match-history'">
      All matches
    </BaseButton>
  </MatchRecordsContainer>
</template>
