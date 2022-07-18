<script lang="ts">
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

import { defineComponent } from "vue";
import UsersRepository from "@/repositories/usersRepository";
import DarkContainer from "@/components/DarkContainer.vue";
import ProfileSection from "@/components/ProfileSection.vue";
import { Game, FilledGame } from "@/shared/interfaces/game.interface";
import { EndingType, GameBoard, GameType } from "@/shared/types";
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
import {
  exampleGame1,
  exampleGame2,
  exampleGame3,
  exampleGame4,
} from "./matches";

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
  },
  data(): {
    koinHintToggled: boolean;
    user: {
      username: string;
      userID: number;
      elo: number;
      balance: number;
      settings: {
        gameStoneColor: { me: string; enemy: string };
        boardType: GameBoard;
      };
    };
    matches: FilledGame[];
    // TODO implement achievement object
    achievements: any[];
    currPage: number;
  } {
    return {
      koinHintToggled: false,
      user: {
        username: "Daybringer",
        userID: 0,
        elo: 1000,
        balance: 0,
        settings: {
          gameStoneColor: {
            me: "#00b3fe",
            enemy: "#ff2079",
          },
          boardType: GameBoard.Standard,
        },
      },
      achievements: [],
      matches: [],
      currPage: 0,
    };
  },
  methods: {
    setColor(isMyColor: boolean, color: string) {
      if (isMyColor) {
        this.user.settings.gameStoneColor.me = color;
      } else {
        this.user.settings.gameStoneColor.enemy = color;
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
      this.user.settings.boardType = gameBoard;
    },
    async fetchUserData() {
      return UsersRepository.getOwnUserProfile()
        .then((res) => {
          return res.data;
        })
        .catch((err) => console.log(err));
    },
    async fetchMatches() {
      this.matches.push(exampleGame1);
      this.matches.push(exampleGame2);
      this.matches.push(exampleGame4);
      this.matches.push(exampleGame3);
    },
    isTie(typeOfWin: any): boolean {
      return typeOfWin === EndingType.Tie;
    },
  },
  computed: {},

  mounted() {
    this.fetchMatches();
  },
});
</script>
<template>
  <view-base-responsive :backgroundTint="'light'">
    <dark-container>
      <!-- First row -->
      <div class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <!-- General info -->
        <profile-section>
          <div
            class="flex-1 flex flex-col xl:grid gap-5 xl:gap-0 grid-cols-7 grid-rows-3"
          >
            <!-- Name, icon, koins -->
            <div
              class="col-span-3 row-span-2 flex items-center flex-col gap-2  "
            >
              <!-- name -->
              <h1
                class="text-4xl text-center font-medium py-2 underline text-gray-900 dark:text-gray-200"
              >
                {{ user.username }}
              </h1>
              <!-- user profile icon -->
              <profile-user-icon-picker></profile-user-icon-picker>
              <!-- koins -->
              <div class="flex flex-row place-items-center gap-2 py-2">
                <span class="text-3xl font-bold">
                  {{ user.balance }}
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
            <!-- User match statistics -->
            <div
              class="col-span-2 row-span-2 flex flex-col justify-center items-center gap-2"
            >
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Total matches: </span>
                <span>1000</span>
              </p>
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Won: </span>
                <span>669</span>
              </p>
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Lost: </span>
                <span>321</span>
              </p>
              <p class="whitespace-nowrap">
                <span class="text-lg font-medium">Tied: </span>
                <span>10</span>
              </p>
            </div>
            <!-- Trophy -->
            <!-- TODO implement multiple icons for rank representation -> to separate component -->
            <div
              class="col-span-2 row-span-2 flex flex-col  justify-start items-center  "
            >
              <rank-placeholder-svg
                class="w-1/3 xl:w-80 text-gray-800"
                style="fill:#FACC15;"
              />

              <p>
                <span class="text-xl font-medium">ELO: </span
                ><span class="text-lg">{{ user.elo }}</span>
              </p>
              <p>
                <span class="text-xl font-medium">Rank: </span
                ><span class="text-lg">12</span>
              </p>
            </div>
            <!-- Achievements -->
            <div
              class="col-span-full row-span-1 flex flex-col gap-3 items-center "
            >
              <div
                class="flex flex-row justify-around items-center flex-wrap gap-2"
              >
                <profile-achievement />
                <profile-achievement />
                <profile-achievement />
                <profile-achievement />
                <profile-achievement />
                <profile-achievement />
              </div>
              <base-button
                class="mb-2"
                @click="
                  () => {
                    this.$router.push(`/profile/${user.userID}/achievements`);
                  }
                "
                >See all achievements</base-button
              >
            </div>
          </div>
        </profile-section>

        <!-- Match history -->
        <profile-section>
          <base-bold-headline class="pt-2">Match history</base-bold-headline>
          <profile-matches-container>
            <!-- Displaying few loaded matches -->
            <!-- FIXME pass whole match instead of single props -->
            <profile-match-blade
              v-for="match in matches"
              :key="match.id"
              :gameID="match.id"
              :myID="match.myID"
              :elo="match.myDelta"
              :dateString="match.dateString"
              :enemyID="match.enemyID"
              :enemyLogged="match.enemyLogged"
              :enemyUsername="match.enemyUsername"
              :gameType="match.type"
              :logged="true"
              :username="match.myUsername"
              :tie="isTie(match.typeOfWin)"
              :win="match.win"
            ></profile-match-blade>
            <!-- All matches link -->
            <router-link
              :to="'/profile/' + this.user.userID + '/match-history'"
            >
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
        <profile-section>
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
                    :currentBoard="this.user.settings.boardType"
                    :myColor="user.settings.gameStoneColor.me"
                    :enemyColor="user.settings.gameStoneColor.enemy"
                    :type="'standard'"
                  />
                </div>
                <div class=" flex flex-col">
                  <profile-pick-board-button
                    @setBoard="setBoard"
                    :currentBoard="this.user.settings.boardType"
                    :type="'classic'"
                  />
                </div>
                <div class="flex flex-col">
                  <profile-pick-board-button
                    @setBoard="setBoard"
                    :currentBoard="this.user.settings.boardType"
                    :myColor="user.settings.gameStoneColor.me"
                    :enemyColor="user.settings.gameStoneColor.enemy"
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
                    :currentColor="user.settings.gameStoneColor.me"
                    :isMyColor="true"
                    @setColor="setColor"
                  />
                </div>
                <div class="flex flex-col items-center">
                  <base-low-headline>Enemy's color</base-low-headline>
                  <profile-pick-color-button
                    :currentColor="user.settings.gameStoneColor.enemy"
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
        <profile-section>
          <base-bold-headline class="pt-2">Elo history</base-bold-headline>
          <elo-chart></elo-chart>
        </profile-section>
      </div>
    </dark-container>
  </view-base-responsive>
</template>
<style scoped></style>
