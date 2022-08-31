<script lang="ts">
import { defineComponent } from "vue";
// Types
import { exampleGame1 } from "./matches";
import {
  ProfileIcon,
  ProfileIconRecordContent,
  profileIconRecords,
} from "@/shared/icons";
import { User } from "@/shared/interfaces/user.interface";
import { Game, FilledGame } from "@/shared/interfaces/game.interface";
import { EndingType, GameBoard, GameType, LoginStrategy } from "@/shared/types";
import UsersRepository from "@/repositories/usersRepository";
import { useStore } from "@/store/store";

// Components
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import RowToMobileStackedLayout from "@/layouts/RowToMobileStackedLayout.vue";
import RowToMobileStackedColumn from "@/layouts/RowToMobileStackedColumn.vue";
import BaseBoldHeadline from "@/components/BaseBoldHeadline.vue";
import BaseButton from "@/components/BaseButton.vue";
import ProfileGeneralContainer from "@/components/ProfileGeneralContainer.vue";
import ProfileMatchesContainer from "@/components/ProfileMatchesContainer.vue";
import ProfileMatchBlade from "@/components/ProfileMatchBlade.vue";
import EloChart from "@/components/ProfileEloChart.vue";
import DarkContainer from "@/components/DarkContainer.vue";
import ProfileSection from "@/components/ProfileSection.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import BaseLowHeadline from "@/components/BaseLowHeadline.vue";
import SVGStandardBoardIcon from "@/components/SVGStandardBoardIcon.vue";
import SVGClassicBoardIcon from "@/components/SVGClassicBoardIcon.vue";
import SVGModernBoardIcon from "@/components/SVGModernBoardIcon.vue";
import ProfilePickBoardButton from "@/components/ProfilePickBoardButton.vue";
import ProfilePickColorButton from "@/components/ProfilePickColorButton.vue";
import ProfileUserIconPicker from "@/components/ProfileUserIconPicker.vue";
import BaseTooltipWithIcon from "@/components/BaseTooltipWithIcon.vue";
import RankPlaceholderSvg from "@/assets/svg/RankPlaceholderSvg.vue";
import QuestionMarkSvg from "@/assets/svg/QuestionMarkSvg.vue";
import ProfileAchievement from "@/components/ProfileAchievement.vue";
import ProfileRankRepresentation from "@/components/ProfileRankRepresentation.vue";

export default defineComponent({
  name: "UserProfileDemo",
  components: {
    ViewBaseResponsive,
    RowToMobileStackedLayout,
    RowToMobileStackedColumn,
    BaseBoldHeadline,
    BaseButton,
    ProfileGeneralContainer,
    ProfileMatchBlade,
    ProfileMatchesContainer,
    EloChart,
    DarkContainer,
    ProfileSection,
    BaseMidHeadline,
    BaseLowHeadline,
    SVGStandardBoardIcon,
    SVGClassicBoardIcon,
    SVGModernBoardIcon,
    ProfilePickBoardButton,
    ProfilePickColorButton,
    ProfileUserIconPicker,
    BaseTooltipWithIcon,
    RankPlaceholderSvg,
    QuestionMarkSvg,
    ProfileAchievement,
    ProfileRankRepresentation,
  },
  data(): {
    koinHintToggled: boolean;
    lastMatches: FilledGame[];
  } {
    return {
      koinHintToggled: false,
      lastMatches: [],
    };
  },
  setup() {
    const store = useStore();
    return { store };
  },
  methods: {
    async setIcon(iconName: string) {
      UsersRepository.selectIcon(iconName).then(() => {
        this.store.user.selectedIcon = ProfileIcon[iconName];
        this.store.user.selectedIcon = ProfileIcon[iconName];
      });
    },
    buyIcon(iconName: string) {
      const iconRecord: ProfileIconRecordContent =
        profileIconRecords[ProfileIcon[iconName]];
      const iconPrice = iconRecord.price;
      if (this.store.user.credit! >= iconRecord.price) {
        UsersRepository.buyIcon(iconName).then(() => {
          this.store.user.credit! -= iconRecord.price;
          this.store.user.availableIcons!.push(ProfileIcon[iconName]);
        });
      } else {
        // TODO show error
        console.log("You can't afford this icon");
      }
    },
    setBoard(variant: number) {
      if (variant == 0) {
        this.setGameBoard(GameBoard.Standard);
      } else if (variant == 1) {
        this.setGameBoard(GameBoard.Classic);
      } else {
        this.setGameBoard(GameBoard.Modern);
      }
    },
    async setGameBoard(gameBoard: GameBoard) {
      UsersRepository.setGameboard(gameBoard).then(() => {
        this.store.user.gameBoard = gameBoard;
      });
    },
    setColor(isMyColor: boolean, color: string) {
      if (isMyColor) {
        this.store.user.playerColor = color;
      } else {
        this.store.user.enemyColor = color;
      }
      UsersRepository.setColors(
        this.store.user.playerColor!,
        this.store.user.enemyColor!
      );
    },
    async fetchMatches() {
      this.lastMatches.push(exampleGame1);
      this.lastMatches.push(exampleGame1);
      this.lastMatches.push(exampleGame1);
      this.lastMatches.push(exampleGame1);
    },
    isTie(typeOfWin: any): boolean {
      return typeOfWin === EndingType.Tie;
    },
  },
  computed: {},
  async beforeMount() {
    this.fetchMatches();
  },
});
</script>
<template>
  <view-base-responsive id="Start" :backgroundTint="'light'">
    <dark-container>
      <!-- First row -->
      <div class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <!-- General info -->
        <profile-section id="General">
          <div
            class="flex-1 flex flex-col xl:grid gap-5 xl:gap-0 grid-cols-7 grid-rows-3"
          >
            <!-- Name, icon, koins -->
            <div
              class="col-span-3 row-span-2 flex items-center flex-col gap-2 p-1 "
            >
              <!-- name -->
              <h1
                class="text-4xl text-center font-medium py-2 underline text-gray-900 dark:text-gray-200"
              >
                {{ store.user.username }}
              </h1>
              <!-- user profile icon -->
              <profile-user-icon-picker
                :currentIcon="store.user.selectedIcon"
                :availableIcons="store.user.availableIcons"
                @setIcon="setIcon"
                @buyIcon="buyIcon"
              ></profile-user-icon-picker>
              <!-- koins -->
              <div class="flex flex-row place-items-center gap-2 py-4">
                <span class="text-3xl font-bold">
                  {{ store.user.credit }}
                </span>
                <img
                  class="h-10"
                  src="@/assets/svg/koin.svg"
                  alt="Koin (Gomoku coin)"
                />
                <base-tooltip-with-icon
                  class="place-self-end"
                  :content="
                    ` Koin is a currency that is used for buying profile icons, backgrounds...
                     <br> It can be obtained by sheer playing. `
                  "
                />
              </div>
            </div>
            <!-- Trophy -->
            <div
              class="col-span-2 row-span-2 flex flex-col  justify-start  items-center gap-2 p-2 "
            >
              <h2
                class="text-4xl text-center font-medium py-2 text-gray-900 dark:text-gray-200"
              >
                Rank
              </h2>
              <profile-rank-representation :currElo="store.user.elo" />
              <p>
                <span class="text-xl font-medium">ELO: </span
                ><span class="text-lg">{{ store.user.elo }}</span>
              </p>
              <p>
                <!-- TODO implement ranks -->
                <span class="text-xl font-medium">Leaderboard: </span
                ><span class="text-lg">FIXME</span>
              </p>
            </div>
            <!-- User match statistics -->
            <div
              class="col-span-2 row-span-2 flex flex-col justify-start items-center gap-2 p-2"
            >
              <h2
                class="text-4xl text-center font-medium py-2 text-gray-900 dark:text-gray-200"
              >
                Statistics
              </h2>
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Total matches: </span>
                <span>{{ store.getTotalMatches }}</span>
              </p>
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Won: </span>
                <span>{{ store.getTotalWon }}</span>
              </p>
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Lost: </span>
                <span>{{ store.getTotalLost }}</span>
              </p>
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Tied: </span>
                <span>{{ store.getTotalTie }}</span>
              </p>
            </div>
            <!-- Achievements -->
            <div
              class="2xl:mt-4 mt- col-span-full row-span-1 flex flex-col gap-3 items-center "
            >
              <div
                class="flex flex-row justify-around items-center flex-wrap gap-2"
              >
                <profile-achievement class="h-20 w-20" />
                <profile-achievement class="h-20 w-20" />
                <profile-achievement class="h-20 w-20" />
                <profile-achievement class="h-20 w-20" />
                <profile-achievement class="h-20 w-20" />
              </div>
              <base-button
                class="mb-2"
                @click="
                  () => {
                    this.$router.push(`/profile/${store.user.id}/achievements`);
                  }
                "
                >See all achievements</base-button
              >
            </div>
          </div>
        </profile-section>

        <!-- Match history -->
        <profile-section id="MatchHistory">
          <base-bold-headline class="pt-2">Match history</base-bold-headline>
          <profile-matches-container>
            <!-- Displaying few loaded matches -->
            <!-- FIXME pass whole match instead of single props -->
            <profile-match-blade
              v-for="match in lastMatches"
              :key="match.id"
              :gameID="match.id"
              :myID="store.user.id"
              :elo="match.me.delta"
              :dateString="match.dateString"
              :enemyID="match.opponent.id"
              :enemyLogged="match.opponent.logged"
              :enemyUsername="match.opponent.username"
              :gameType="match.type"
              :logged="true"
              :username="match.me.username"
              :tie="isTie(match.typeOfWin)"
              :win="match.win"
            ></profile-match-blade>
            <!-- All matches link -->
            <router-link :to="'/profile/' + store.user.id + '/match-history'">
              <base-button>
                All matches
              </base-button>
            </router-link>
          </profile-matches-container>
        </profile-section>
      </div>
      <!-- Second row -->
      <div class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <!-- Customizations -->
        <profile-section id="Customizations">
          <base-bold-headline class="pt-2 pb-4"
            >Customizations</base-bold-headline
          >
          <div
            class="flex-1  grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-0 justify-around "
          >
            <!-- Gameboard pickers -->
            <div class="flex-1 flex flex-col ">
              <base-mid-headline>Gameboard</base-mid-headline>
              <div class="flex flex-row justify-around pt-3 px-3 gap-2  flex-1">
                <div class="flex flex-col  ">
                  <profile-pick-board-button
                    @setBoard="setBoard"
                    :currentBoard="store.user.gameBoard"
                    :myColor="store.user.playerColor"
                    :enemyColor="store.user.enemyColor"
                    :type="'standard'"
                  />
                </div>
                <div class=" flex flex-col">
                  <profile-pick-board-button
                    @setBoard="setBoard"
                    :currentBoard="store.user.gameBoard"
                    :type="'classic'"
                  />
                </div>
                <div class="flex flex-col">
                  <profile-pick-board-button
                    @setBoard="setBoard"
                    :currentBoard="store.user.gameBoard"
                    :myColor="store.user.playerColor"
                    :enemyColor="store.user.enemyColor"
                    :type="'modern'"
                  />
                </div>
              </div>
            </div>
            <!-- Game color pickers-->
            <div class="flex-1 flex flex-col ">
              <base-mid-headline>Game colors</base-mid-headline>
              <div
                class="flex flex-row justify-around md:mt-2 p-3 gap-2 flex-1"
              >
                <div class="flex flex-col items-center">
                  <base-low-headline>Your color</base-low-headline>
                  <profile-pick-color-button
                    :currentColor="store.user.playerColor"
                    :isMyColor="true"
                    @setColor="setColor"
                  />
                </div>
                <div class="flex flex-col items-center">
                  <base-low-headline>Enemy's color</base-low-headline>
                  <profile-pick-color-button
                    :currentColor="store.user.enemyColor"
                    :isMyColor="false"
                    @setColor="setColor"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex flex-1 flex-col md:flex-row justify-around  md:items-center mt-4 lg:mt-0 gap-5 p-5"
          >
            <base-button
              @click="
                () => {
                  this.$router.push('/set-username');
                }
              "
              >Change Username</base-button
            >

            <base-button
              @click="
                () => {
                  this.$router.push('/set-email');
                }
              "
              >Change Email</base-button
            >

            <base-button
              @click="
                () => {
                  this.$router.push('/set-password');
                }
              "
              >Change Password</base-button
            >
          </div>
        </profile-section>

        <!-- Elo chart -->
        <!-- TODO replace the dummy graph with one with real data; add switches and so on -->
        <profile-section id="Graphs">
          <base-bold-headline class="pt-2">Elo history</base-bold-headline>
          <elo-chart></elo-chart>
        </profile-section>
      </div>
    </dark-container>
  </view-base-responsive>
</template>
<style scoped></style>
