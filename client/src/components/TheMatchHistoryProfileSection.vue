<script setup lang="ts">
import ProfileSection from "./ProfileSection.vue";
import BaseHighHeadline from "./BaseHighHeadline.vue";
import MatchRecord from "./MatchRecord.vue";
import MatchRecordsContainer from "./MatchRecordsContainer.vue";
import BaseButton from "./BaseButton.vue";
import { exampleGame1 } from "@/dummy_data/matches";
import { ExpandedGame } from "@/shared/interfaces/game.interface";
import { onBeforeMount } from "vue";

defineProps<{ userID: number }>();

//TODO implement pulling matches from user's profile
onBeforeMount(async () => {
  fetchMatches();
});

async function fetchMatches() {
  lastMatches.push(exampleGame1);
  lastMatches.push(exampleGame1);
  lastMatches.push(exampleGame1);
  lastMatches.push(exampleGame1);
}
const lastMatches: ExpandedGame[] = [];
</script>
<template>
  <ProfileSection id="MatchHistory">
    <BaseHighHeadline>Match history</BaseHighHeadline>
    <MatchRecordsContainer>
      <!-- Displaying few loaded matches -->
      <MatchRecord v-for="match in lastMatches" :key="match.id" :game="match" />
      <!-- All matches link -->
      <RouterLink :to="'/profile/' + userID + '/match-history'">
        <BaseButton> All matches </BaseButton>
      </RouterLink>
    </MatchRecordsContainer>
  </ProfileSection>
</template>
