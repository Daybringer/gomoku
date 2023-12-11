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
  <div
    class="mt-3 mb-2 flex flew-row flex-wrap justify-center place-items-center gap-5">
    <BaseContainerWithRotatedAfter size="sm" color="gomoku-pink" rotate-left>
      <span class="text-xl"
        ><b>{{
          wonStats + lostStats + tiedStats === 0
            ? 0
            : Math.round(
                (wonStats / (wonStats + lostStats + tiedStats)) * 1000
              ) / 10
        }}</b
        >% WR</span
      >
    </BaseContainerWithRotatedAfter>
    <BaseContainerWithRotatedAfter color="gomoku-blue"
      ><span class="text-xl"
        ><b>{{ wonStats }}</b> WON</span
      ></BaseContainerWithRotatedAfter
    >
    <BaseContainerWithRotatedAfter rotate-left color="gomoku-blue"
      ><span class="text-xl"
        ><b>{{ lostStats }}</b> LOST</span
      ></BaseContainerWithRotatedAfter
    >
    <BaseContainerWithRotatedAfter color="gomoku-blue"
      ><span class="text-xl"
        ><b>{{ tiedStats }}</b> TIED</span
      ></BaseContainerWithRotatedAfter
    >
  </div>

  <BaseMidHeadline class="">Elo graph</BaseMidHeadline>
  <Line
    v-if="data.datasets[0].data.length !== 0"
    :data="data"
    :options="options" />
  <p v-else class="w-full text-center mt-4 italic text-2xl text-gray-500">
    No data
  </p>
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
import { storeToRefs } from "pinia";

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

const { user } = storeToRefs(useProfileStore());
const gameRepository = RepositoryFactory.getGameRepository;
const props = defineProps<{ userId: number }>();
const matchesAreLoaded = ref(false);
const whichStats: Ref<"all" | "ranked" | "quick"> = ref("all");
const wonStats = computed(() =>
  whichStats.value === "quick"
    ? user.value.statistics.quickWon
    : whichStats.value === "ranked"
    ? user.value.statistics.rankedWon
    : user.value.statistics.quickWon + user.value.statistics.rankedWon
);
const lostStats = computed(() =>
  whichStats.value === "quick"
    ? user.value.statistics.quickLost
    : whichStats.value === "ranked"
    ? user.value.statistics.rankedLost
    : user.value.statistics.quickLost + user.value.statistics.rankedLost
);
const tiedStats = computed(() =>
  whichStats.value === "quick"
    ? user.value.statistics.quickTied
    : whichStats.value === "ranked"
    ? user.value.statistics.rankedTied
    : user.value.statistics.quickTied + user.value.statistics.rankedTied
);
const games: Game[] = reactive([]);
const rankedGames = computed(() =>
  games.filter((game) => game.type === GameType.Ranked)
);
const quickGames = computed(() =>
  games.filter((game) => game.type === GameType.Quick)
);

const rankedProfiles = computed(() =>
  rankedGames.value.map(
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
        borderColor: user.value.settings.playerColor,
        data: rankedProfiles.value.map((profile) => profile.postGameElo!),
      },
    ],
  };
});
</script>
