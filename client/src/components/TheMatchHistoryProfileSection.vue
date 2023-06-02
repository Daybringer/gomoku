<script setup lang="ts">
import ProfileSection from "./ProfileSection.vue";
import BaseHighHeadline from "./BaseHighHeadline.vue";
import MatchRecord from "./MatchRecord.vue";
import MatchRecordsContainer from "./MatchRecordsContainer.vue";
import BaseButton from "./BaseButton.vue";
import { ExpandedGame } from "@/shared/interfaces/game.interface";
import { reactive, onMounted, ref } from "vue";
import BaseLoadingSpinner from "@/components/BaseLoadingSpinner.vue";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const gameRepository = RepositoryFactory.getGameRepository;
defineProps<{ userID: number }>();
const games: ExpandedGame[] = reactive([]);
const matchesAreLoaded = ref(false);

onMounted(() => {
  fetchMatches();
});
function fetchMatches() {
  gameRepository
    .getGameByID(1)
    .then((res) => {
      console.log(res.data.game);
      games.push(res.data.game);
      matchesAreLoaded.value = true;
    })
    .catch((err) => {
      console.error(err);
    });
}
</script>
<template>
  <ProfileSection id="MatchHistory">
    <BaseHighHeadline>Match history</BaseHighHeadline>
    <MatchRecordsContainer>
      <!-- Displaying few loaded matches -->
      <MatchRecord
        :userID="userID"
        v-for="game in games"
        :key="game.id"
        :game="game"
      />
      <BaseLoadingSpinner v-show="!matchesAreLoaded" />
      <!-- All matches link -->
      <RouterLink :to="'/profile/' + userID + '/match-history'">
        <BaseButton> All matches </BaseButton>
      </RouterLink>
    </MatchRecordsContainer>
  </ProfileSection>
</template>
