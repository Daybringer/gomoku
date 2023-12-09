<template>
  <BaseView>
    <div class="h-full w-full flex flex-col rounded-lg text-center">
      <BaseHighHeadline>Match history</BaseHighHeadline>
      <BaseHRDivider />
      <BaseButton
        @click="hideConstraints = !hideConstraints"
        class="place-self-center px-16"
        ><ChevronsDownIcon
          :class="hideConstraints ? '' : 'rotate-180'"
          class="h-8 transition-transform" />
      </BaseButton>
      <div
        class="gap-4 my-6 flex flex-col place-items-center md:w-60 self-center justify-around md:flex-row"
        v-show="!hideConstraints">
        <div class="flex flex-col gap-4">
          <BaseLowHeadline>Match types</BaseLowHeadline>
          <div class="flex flex-row gap-6">
            <BaseTooltip content="Quick">
              <BaseToggleButton
                @toggle="toggled.type.quick = !toggled.type.quick"
                :toggled="toggled.type.quick">
                <MatchQuickIcon />
              </BaseToggleButton>
            </BaseTooltip>
            <BaseTooltip content="Ranked">
              <BaseToggleButton
                @toggle="toggled.type.ranked = !toggled.type.ranked"
                :toggled="toggled.type.ranked">
                <MatchRankedIcon />
              </BaseToggleButton>
            </BaseTooltip>
            <BaseTooltip content="Custom">
              <BaseToggleButton
                @toggle="toggled.type.custom = !toggled.type.custom"
                :toggled="toggled.type.custom">
                <MatchCustomIcon />
              </BaseToggleButton>
            </BaseTooltip>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <BaseLowHeadline>Victory/Defeat/Tie</BaseLowHeadline>
          <div class="flex flex-row gap-6">
            <BaseTooltip content="Victory">
              <BaseToggleButton
                @toggle="toggled.result.victory = !toggled.result.victory"
                :toggled="toggled.result.victory">
                <VictoryIcon class="text-yellow-400" />
              </BaseToggleButton>
            </BaseTooltip>
            <BaseTooltip content="Defeat">
              <BaseToggleButton
                @toggle="toggled.result.defeat = !toggled.result.defeat"
                :toggled="toggled.result.defeat">
                <LoseIcon class="text-red-500" />
              </BaseToggleButton>
            </BaseTooltip>
            <BaseTooltip content="Tie">
              <BaseToggleButton
                @toggle="toggled.result.tie = !toggled.result.tie"
                :toggled="toggled.result.tie">
                <TieIcon />
              </BaseToggleButton>
            </BaseTooltip>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <BaseLowHeadline>Ending type</BaseLowHeadline>
          <div class="flex flex-row gap-6">
            <BaseTooltip content="Combination">
              <BaseToggleButton
                @toggle="
                  toggled.ending.combination = !toggled.ending.combination
                "
                :toggled="toggled.ending.combination">
                <FiveCombinationIcon class="h-8" />
              </BaseToggleButton>
            </BaseTooltip>
            <BaseTooltip content="Time limit">
              <BaseToggleButton
                @toggle="toggled.ending.timeout = !toggled.ending.timeout"
                :toggled="toggled.ending.timeout">
                <HourglassIcon class="h-8" />
              </BaseToggleButton>
            </BaseTooltip>
            <BaseTooltip content="Disconnect">
              <BaseToggleButton
                @toggle="toggled.ending.disconnect = !toggled.ending.disconnect"
                :toggled="toggled.ending.disconnect">
                <NoWifiIcon class="h-8" />
              </BaseToggleButton>
            </BaseTooltip>
          </div>
        </div>
      </div>
      <BaseButton @click="search" class="my-4 w-50 self-center"
        >Search</BaseButton
      >
      <BaseHRDivider />
      <div class="pt-4 flex flex-1 md:w-80 self-center overflow-y-auto">
        <MatchRecordsContainer>
          <MatchRecord
            v-for="game in games"
            :key="game.id"
            :game="game"
            :user-id="userID" />
          <BaseLoadingSpinner v-show="loading" />
          <p
            class="italic text-2xl text-gray-600 dark:text-gray-300"
            v-show="!loading && games.length == 0">
            None found. Go and play some.
          </p>
        </MatchRecordsContainer>
      </div>
    </div>
  </BaseView>
</template>
<script setup lang="ts">
import { Ref, ref, reactive } from "vue";
// Components
import BaseLowHeadline from "@/components/BaseLowHeadline.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseHRDivider from "@/components/BaseHRDivider.vue";
import BaseToggleButton from "@/components/BaseToggleButton.vue";
import MatchRecordsContainer from "@/components/MatchRecordsContainer.vue";
import MatchRecord from "@/components/MatchRecord.vue";
import BaseLoadingSpinner from "@/components/BaseLoadingSpinner.vue";
import BaseTooltip from "@/components/BaseTooltip.vue";
// Icons
import MatchQuickIcon from "@/assets/svg/MatchQuickIcon.vue";
import MatchRankedIcon from "@/assets/svg/MatchRankedIcon.vue";
import MatchCustomIcon from "@/assets/svg/MatchCustomIcon.vue";
import VictoryIcon from "@/assets/svg/VictoryIcon.vue";
import LoseIcon from "@/assets/svg/LoseIcon.vue";
import TieIcon from "@/assets/svg/TieIcon.vue";
import FiveCombinationIcon from "@/assets/svg/FiveCombinationIcon.vue";
import NoWifiIcon from "@/assets/svg/NoWifiIcon.vue";
import HourglassIcon from "@/assets/svg/HourglassIcon.vue";
import BaseView from "@/components/BaseView.vue";
import ChevronsDownIcon from "@/assets/svg/ChevronsDownIcon.vue";
import { GetGamesByUserIDDTO } from "@/shared/DTO/get-game-by-user-id.dto";
import gameRepository from "@/repositories/gameRepository";
import { useRoute } from "vue-router";
import { EndingType, GameConstraints, GameType } from "@/shared/types";
import { Game } from "@/shared/interfaces/game.interface";

const loading = ref(false);
const games: Ref<Game[]> = ref([]);
const hideConstraints = ref(false);
const toggled = reactive({
  type: {
    quick: true,
    ranked: true,
    custom: true,
  },
  result: {
    victory: true,
    defeat: true,
    tie: true,
  },
  ending: {
    timeout: true,
    disconnect: true,
    combination: true,
  },
});

const userID = Number(useRoute().params.id);

function search(removeOld: boolean) {
  if (removeOld) {
    games.value = [];
  }
  loading.value = true;

  const constraints: GameConstraints = {
    allowedAmIWinner: [],
    allowedEndingTypes: [],
    allowedGameTypes: [],
  };

  if (toggled.type.quick) constraints.allowedGameTypes.push(GameType.Quick);
  if (toggled.type.ranked) constraints.allowedGameTypes.push(GameType.Ranked);
  if (toggled.type.custom) constraints.allowedGameTypes.push(GameType.Custom);

  if (toggled.result.victory) constraints.allowedAmIWinner.push(true);
  if (toggled.result.defeat) constraints.allowedAmIWinner.push(false);

  if (toggled.ending.combination)
    constraints.allowedEndingTypes.push(EndingType.Combination);
  if (toggled.ending.disconnect)
    constraints.allowedEndingTypes.push(EndingType.Surrender);
  if (toggled.ending.timeout)
    constraints.allowedEndingTypes.push(EndingType.Time);
  if (toggled.result.tie) constraints.allowedEndingTypes.push(EndingType.Tie);

  const dto: GetGamesByUserIDDTO = {
    userID,
    take: 15,
    skip: games.value.length,
    orderFromNewest: true,
    constraints,
  };
  gameRepository
    .getGamesByUserIDDTO(dto)
    .then((res) => {
      res.data.games.forEach((game) => {
        games.value.push(game);
      });
      loading.value = false;
    })
    .catch(() => {});
}
</script>
