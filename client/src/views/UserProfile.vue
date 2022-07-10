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
    currPage: number;
  } {
    return {
      koinHintToggled: false,
      user: {
        username: "Daybringer",
        userID: 0,
        elo: 0,
        balance: 0,
        settings: {
          gameStoneColor: {
            me: "#00b3fe",
            enemy: "#ff2079",
          },
          boardType: GameBoard.Standard,
        },
      },
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
      const exampleGame1: FilledGame = {
        id: 0,
        turnHistory: [],
        typeOfWin: EndingType.Surrender,
        type: GameType.Quick,
        winnerGameProfileID: 0,
        finalState: [[]],
        playerProfilesIDs: [0, 1],
        startingPlayerGameProfileID: 0,
        // extra
        myDelta: 0,
        myUsername: "Daybringer",
        myID: 1,
        myRemainingTime: 119,
        enemyID: 2,
        enemyRemainingTime: 112,
        enemyUsername: "",
        enemyLogged: false,
        win: true,
        dateString: "2022-07-04 21:09:38.452",
      };
      const exampleGame2: FilledGame = {
        id: 1,
        turnHistory: [],
        typeOfWin: EndingType.Combination,
        type: GameType.Ranked,
        winnerGameProfileID: 0,
        finalState: [[]],
        playerProfilesIDs: [0, 1],
        startingPlayerGameProfileID: 0,
        // extra
        myDelta: -12,
        myUsername: "Daybringer",
        myID: 1,
        myRemainingTime: 119,
        enemyID: 2,
        enemyRemainingTime: 112,
        enemyUsername: "Vojtesla",
        enemyLogged: true,
        win: false,
        dateString: "2022-07-04 21:09:38.452",
      };
      const exampleGame4: FilledGame = {
        id: 4,
        turnHistory: [],
        typeOfWin: EndingType.Tie,
        type: GameType.Ranked,
        winnerGameProfileID: 0,
        finalState: [[]],
        playerProfilesIDs: [0, 1],
        startingPlayerGameProfileID: 0,
        // extra
        myDelta: 8,
        myUsername: "Daybringer",
        myID: 1,
        myRemainingTime: 119,
        enemyID: 2,
        enemyRemainingTime: 112,
        enemyUsername: "Vojtesla",
        enemyLogged: true,
        win: false,
        dateString: "2022-07-05 21:09:38.452",
      };
      const exampleGame3: FilledGame = {
        id: 3,
        turnHistory: [],
        typeOfWin: EndingType.Surrender,
        type: GameType.Custom,
        winnerGameProfileID: 0,
        finalState: [[]],
        playerProfilesIDs: [0, 1],
        startingPlayerGameProfileID: 0,
        // extra
        myDelta: 0,
        myID: 1,
        myUsername: "Daybringer",
        myRemainingTime: 119,
        enemyID: 0,
        enemyRemainingTime: 112,
        enemyUsername: "Hecubah",
        enemyLogged: true,
        win: true,
        dateString: "2022-07-04 21:09:38.452",
      };

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
          <div class="self-start px-2 flex flex-col  ">
            <!-- Profile name -->
            <div
              class="flex flex-row place-content-center lg:place-content-start"
            >
              <div class="flex flex-row items-baseline">
                <h1 class="text-4xl font-medium p-2">{{ user.username }}</h1>
                <router-link
                  class=" text-gomoku-blue hover:text-gray-800 fill-current"
                  to=""
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-7 stroke-current"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M9 7h-3a2 2 0 0 0 -2 2v9a2 2 0 0 0 2 2h9a2 2 0 0 0 2 -2v-3"
                    />
                    <path d="M9 15h3l8.5 -8.5a1.5 1.5 0 0 0 -3 -3l-8.5 8.5v3" />
                    <line x1="16" y1="5" x2="19" y2="8" />
                  </svg>
                </router-link>
              </div>
            </div>
            <!-- Appearance wrapper -->
            <div
              class="flex flex-col lg:flex-row items-center  place-items-center lg:gap-8 gap-4"
            >
              <!-- Profile icon -->
              <router-link to="">
                <img
                  class=" border-gray-500 dark:border-gray-300 rounded-xl lg:h-24 h-24 bg-gray-300 cursor-pointer"
                  src="../assets/samurai_blue.svg"
                  alt=""
                />
              </router-link>
              <div class="flex-1 flex flex-col ">
                <div class="flex flex-col text-center md:flex-row md:gap-4">
                  <p>
                    <span class="text-xl font-medium">ELO: </span
                    ><span class="text-lg">{{ user.elo }}</span>
                  </p>
                  <p>
                    <span class="text-xl font-medium">Rank: </span
                    ><span class="text-lg">1</span>
                  </p>
                </div>
                <div class="flex flex-col text-center md:flex-row gap-4">
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
              </div>
            </div>

            <!-- Current balance -->
            <div class="flex flex-row place-items-center gap-2 py-2">
              <span class="text-3xl font-bold">
                {{ user.balance }}
              </span>
              <img class="h-10" src="../assets/svg/koin.svg" alt="" />
              <div class="place-self-end relative block">
                <div
                  @mouseenter="koinHintToggled = true"
                  @mouseleave="koinHintToggled = false"
                  @click="koinHintToggled = !koinHintToggled"
                  class="bg-gray-600 hover:bg-gray-400 cursor-pointer rounded-full text-gray-200 "
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    class="h-5 stroke-current"
                    viewBox="0 0 24 24"
                    stroke-width="1.5"
                    fill="none"
                    stroke-linecap="round"
                    stroke-linejoin="round"
                  >
                    <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                    <path
                      d="M8 8a3.5 3 0 0 1 3.5 -3h1a3.5 3 0 0 1 3.5 3a3 3 0 0 1 -2 3a3 4 0 0 0 -2 4"
                    />
                    <line x1="12" y1="19" x2="12" y2="19.01" />
                  </svg>
                </div>
                <transition name="slide">
                  <div
                    v-show="koinHintToggled"
                    class="bg-gray-200 rounded-lg absolute block mt-2 py-2 px-6 w-64  text-gray-900"
                  >
                    <span>
                      Koin is a currency that is used for buying profile icons,
                      backgrounds... <br />
                      It can be obtained by sheer playing.
                    </span>
                  </div>
                </transition>
              </div>
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
            <div class="flex-1 flex flex-col ">
              <base-mid-headline>Gameboard</base-mid-headline>
              <div class="flex flex-row justify-around pt-3 px-3 gap-2  flex-1">
                <div class="flex flex-col  ">
                  <profile-pick-board-button
                    @setBoard="setBoard"
                    :currentBoard="this.user.settings.boardType"
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
            <base-button>Change Username</base-button>
            <base-button>Change Email</base-button>
            <base-button>Change Password</base-button>
          </div>
        </profile-section>

        <!-- Elo chart -->
        <profile-section>
          <base-bold-headline class="pt-2">Elo history</base-bold-headline>
          <elo-chart></elo-chart>
        </profile-section>
      </div>
    </dark-container>
  </view-base-responsive>
</template>
<style scoped></style>
