<template>
  <BaseHighHeadline>Statistics</BaseHighHeadline>
  <div class="flex flew-row justify-center place-items-center gap-4">
    <BaseToggleButton
      @toggle="whichStats = 'quick'"
      :toggled="whichStats === 'quick'"
      >Quick</BaseToggleButton
    >
    <BaseToggleButton
      :disabled="false"
      @toggle="whichStats = 'ranked'"
      :toggled="whichStats === 'ranked'"
      >Ranked</BaseToggleButton
    >
    <BaseToggleButton
      @toggle="whichStats = 'all'"
      :toggled="whichStats === 'all'"
      >All</BaseToggleButton
    >
  </div>
  <div class="mt-3 mb-2 flex flew-row justify-center place-items-center gap-5">
    <BaseContainerWithRotatedAfter size="sm" color="gomoku-pink" rotate-left>
      <span class="text-xl font-medium">51% WR</span>
    </BaseContainerWithRotatedAfter>
    <BaseContainerWithRotatedAfter color="gray"
      ><span class="text-xl"><b>51</b> WON</span></BaseContainerWithRotatedAfter
    >
    <BaseContainerWithRotatedAfter color="gray"
      ><span class="text-xl"
        ><b>12</b> LOST</span
      ></BaseContainerWithRotatedAfter
    >
    <BaseContainerWithRotatedAfter color="gray"
      ><span class="text-xl"><b>0</b> TIED</span></BaseContainerWithRotatedAfter
    >
  </div>

  <BaseMidHeadline>Elo graph</BaseMidHeadline>
  <Line :data="data" :options="options" />
</template>
<script setup lang="ts">
import { onMounted, computed, reactive, ref, Ref } from "vue";
import { Game } from "@/shared/interfaces/game.interface";
import { EndingType, GameType } from "@/shared/types";
import BaseHighHeadline from "./BaseHighHeadline.vue";
import BaseMidHeadline from "./BaseMidHeadline.vue";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { Line } from "vue-chartjs";
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  BarElement,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
} from "chart.js";
import { getDateFromDate } from "@/utils/general";
import { useProfileStore } from "@/store/profile";
import BaseContainerWithRotatedAfter from "./BaseContainerWithRotatedAfter.vue";
import BaseToggleButton from "./BaseToggleButton.vue";

ChartJS.register(
  Title,
  Tooltip,
  Legend,
  PointElement,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale
);

const profileStore = useProfileStore();
const gameRepository = RepositoryFactory.getGameRepository;
const props = defineProps<{ userId: number }>();
const games: Game[] = reactive([]);
const matchesAreLoaded = ref(false);
const whichStats: Ref<"all" | "ranked" | "quick"> = ref("all");
const quickGames = computed(() =>
  games.map(
    (game) =>
      game.playerGameProfiles.filter(
        (profile) => profile.user?.id === props.userId
      )[0]
  )
);
const rankedProfiles = computed(() =>
  games.map(
    (game) =>
      game.playerGameProfiles.filter(
        (profile) => profile.user?.id === props.userId
      )[0]
  )
);

onMounted(() => {
  fetchMatches();
});
// ------- METHODS ------- \\
function fetchMatches() {
  gameRepository
    .getGamesByUserIDDTO({
      userID: props.userId,
      skip: 0,
      take: 1000,
      orderFromNewest: true,
      constraints: {
        allowedAmIWinner: [true, false],
        allowedEndingTypes: [
          EndingType.Combination,
          EndingType.Surrender,
          EndingType.Tie,
          EndingType.Time,
        ],
        allowedGameTypes: [GameType.Ranked, GameType.Quick],
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

const options = reactive({});
const data = computed(() => {
  return {
    labels: rankedProfiles.value
      .reverse()
      .map((profile) => getDateFromDate(profile.createdAt + "")),
    datasets: [
      {
        label: "ELO",
        borderWidth: 2,
        tension: 0.3,
        borderColor: profileStore.user.settings.playerColor,
        data: rankedProfiles.value.map((profile) => profile.postGameElo!),
      },
    ],
  };
});
</script>
