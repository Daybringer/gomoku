<template>
  <view-base-fixed-height>
    <div class="h-full w-full flex flex-col rounded-lg text-center">
      <base-bold-headline class="mb-4">Match history</base-bold-headline>
      <hr class="m-3 border-2 rounded border-gray-500" />
      <div
        class="gap-4 my-6 flex flex-col place-items-center md:w-60 self-center justify-around md:flex-row rounded-lg"
      >
        <div class="flex flex-col gap-4">
          <base-low-headline class="text-xl">Match types</base-low-headline>
          <div class="flex flex-row gap-6">
            <base-tooltip :content="'Quick'">
              <base-toggle-button
                @toggle="
                  () => {
                    quickToggled = !quickToggled;
                  }
                "
                :toggled="quickToggled"
              >
                <MatchQuickIcon />
              </base-toggle-button>
            </base-tooltip>
            <base-tooltip :content="'Ranked'">
              <base-toggle-button
                @toggle="
                  () => {
                    rankedToggled = !rankedToggled;
                  }
                "
                :toggled="rankedToggled"
              >
                <MatchRankedIcon />
              </base-toggle-button>
            </base-tooltip>
            <base-tooltip :content="'Custom'">
              <base-toggle-button
                @toggle="
                  () => {
                    customToggled = !customToggled;
                  }
                "
                :toggled="customToggled"
              >
                <MatchCustomIcon />
              </base-toggle-button>
            </base-tooltip>
          </div>
        </div>

        <div class="flex flex-col gap-4">
          <base-low-headline class="text-xl"
            >Victory/Defeat/Tie</base-low-headline
          >
          <div class="flex flex-row gap-6">
            <base-tooltip :content="'Victory'">
              <base-toggle-button
                @toggle="
                  () => {
                    victoryToggled = !victoryToggled;
                  }
                "
                :toggled="victoryToggled"
              >
                <VictoryIcon class="text-yellow-400" />
              </base-toggle-button>
            </base-tooltip>
            <base-tooltip :content="'Defeat'">
              <base-toggle-button
                @toggle="
                  () => {
                    defeatToggled = !defeatToggled;
                  }
                "
                :toggled="defeatToggled"
              >
                <LoseIcon class="text-red-500" />
              </base-toggle-button>
            </base-tooltip>
            <base-tooltip :content="'Tie'">
              <base-toggle-button
                @toggle="
                  () => {
                    tieToggled = !tieToggled;
                  }
                "
                :toggled="tieToggled"
              >
                <TieIcon />
              </base-toggle-button>
            </base-tooltip>
          </div>
        </div>
        <div class="flex flex-col gap-4">
          <base-low-headline class="text-xl">Ending type</base-low-headline>
          <div class="flex flex-row gap-6">
            <base-tooltip :content="'Combination'">
              <base-toggle-button
                @toggle="
                  () => {
                    combinationToggled = !combinationToggled;
                  }
                "
                :toggled="combinationToggled"
              >
                <five-combination-icon class="h-8" />
              </base-toggle-button>
            </base-tooltip>
            <base-tooltip class="whitespace-nowrap" :content="'Time limit'">
              <base-toggle-button
                @toggle="
                  () => {
                    timeToggled = !timeToggled;
                  }
                "
                :toggled="timeToggled"
              >
                <hourglass-icon class="h-8" />
              </base-toggle-button>
            </base-tooltip>
            <base-tooltip :content="'Disconnect'">
              <base-toggle-button
                @toggle="
                  () => {
                    disconnectToggled = !disconnectToggled;
                  }
                "
                :toggled="disconnectToggled"
              >
                <no-wifi-icon class="h-8" />
              </base-toggle-button>
            </base-tooltip>
          </div>
        </div>
      </div>
      <base-button @click="search" class="my-4 w-50 self-center"
        >Search</base-button
      >
      <hr class="mx-3 mt-1 border-2 rounded border-gray-500" />
      <div class="pt-4 flex flex-1 md:w-80 self-center overflow-y-auto">
        <MatchRecordsContainer>
          <profile-match-blade
            v-for="match in matches"
            :key="match.id"
            :game="match"
          ></profile-match-blade>
          <base-loading-spinner v-show="loading" />
          <p
            class="italic text-2xl text-gray-600 dark:text-gray-300"
            v-show="!loading && matches.length == 0"
          >
            None found. Go and find some
          </p>
        </MatchRecordsContainer>
      </div>
    </div>
  </view-base-fixed-height>
</template>
<script lang="ts">
// import { exampleGame1 } from "@/dummy_data/matches";
import { defineComponent } from "vue";
// Components
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import BaseLowHeadline from "@/components/BaseLowHeadline.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseToggleButton from "@/components/BaseToggleButton.vue";
import ProfileMatchBlade from "@/components/MatchRecord.vue";
import MatchRecordsContainer from "@/components/MatchRecordsContainer.vue";
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
//types
import { ExpandedGame } from "@/shared/interfaces/game.interface";
import { EndingType } from "@/shared/types";
export default defineComponent({
  name: "MatchHistoryOverview",
  props: {},
  components: {
    ViewBaseFixedHeight,
    BaseLowHeadline,
    BaseHighHeadline,
    BaseButton,
    BaseToggleButton,
    MatchQuickIcon,
    MatchRankedIcon,
    MatchCustomIcon,
    VictoryIcon,
    LoseIcon,
    TieIcon,
    BaseTooltip,
    ProfileMatchBlade,
    MatchRecordsContainer,
    BaseLoadingSpinner,
    FiveCombinationIcon,
    NoWifiIcon,
    HourglassIcon,
  },
  data(): {
    loading: boolean;
    quickToggled: boolean;
    rankedToggled: boolean;
    customToggled: boolean;
    victoryToggled: boolean;
    defeatToggled: boolean;
    tieToggled: boolean;
    combinationToggled: boolean;
    timeToggled: boolean;
    disconnectToggled: boolean;
    matches: ExpandedGame[];
  } {
    return {
      loading: false,
      matches: [],
      quickToggled: true,
      rankedToggled: true,
      customToggled: true,
      victoryToggled: true,
      defeatToggled: true,
      tieToggled: true,
      combinationToggled: true,
      timeToggled: true,
      disconnectToggled: true,
    };
  },
  computed: {},
  methods: {
    search() {
      this.matches = [];
      this.loading = true;
      setTimeout(() => {
        this.loading = false;
        for (let x = 0; x < 5; x++) {
          // this.matches.push(exampleGame1);
        }
      }, 3000);
    },
    isTie(typeOfWin: any): boolean {
      return typeOfWin === EndingType.Tie;
    },
  },
});
</script>
<style scoped></style>
