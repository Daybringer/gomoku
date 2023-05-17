<script lang="ts">
import { defineComponent } from "vue";
// Types
import { exampleGame1 } from "@/dummy_data/matches";
import {
  ProfileIcon,
  ProfileIconRecordContent,
  profileIconRecords,
} from "@/shared/icons";
import { ExpandedGame } from "@/shared/interfaces/game.interface";
import { EndingType, GameBoard } from "@/shared/types";
import UsersRepository from "@/repositories/usersRepository";
import { useStore } from "@/store/store";

// Components
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import BaseBoldHeadline from "@/components/BaseBoldHeadline.vue";
import BaseButton from "@/components/BaseButton.vue";
import ProfileMatchesContainer from "@/components/ProfileMatchesContainer.vue";
import ProfileMatchBlade from "@/components/MatchRecord.vue";
import EloChart from "@/components/ProfileEloChart.vue";
import DarkContainer from "@/components/DarkContainer.vue";
import ProfileSection from "@/components/ProfileSection.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import BaseLowHeadline from "@/components/BaseLowHeadline.vue";
import ProfilePickBoardButton from "@/components/ProfilePickBoardButton.vue";
import ProfilePickColorButton from "@/components/ProfilePickColorButton.vue";
import ProfileUserIconPicker from "@/components/ProfileUserIconPicker.vue";
import BaseTooltipWithIcon from "@/components/BaseTooltipWithIcon.vue";
import ProfileAchievement from "@/components/ProfileAchievement.vue";
import ProfileRankRepresentation from "@/components/ProfileRankRepresentation.vue";

export default defineComponent({
  name: "UserProfileDemo",
  components: {
    ViewBaseResponsive,
    BaseBoldHeadline,
    BaseButton,
    ProfileMatchBlade,
    ProfileMatchesContainer,
    EloChart,
    DarkContainer,
    ProfileSection,
    BaseMidHeadline,
    BaseLowHeadline,
    ProfilePickBoardButton,
    ProfilePickColorButton,
    ProfileUserIconPicker,
    BaseTooltipWithIcon,
    ProfileAchievement,
    ProfileRankRepresentation,
  },
  data(): {
    koinHintToggled: boolean;
    lastMatches: ExpandedGame[];
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
        this.store.saveLocalUser();
      });
    },
    buyIcon(iconName: string) {
      const iconRecord: ProfileIconRecordContent =
        profileIconRecords[ProfileIcon[iconName]];
      //const iconPrice = iconRecord.price;
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
        this.store.saveLocalUser();
      });
    },
    setColor(isMyColor: boolean, color: string) {
      if (isMyColor) {
        this.store.user.playerColor = color;
      } else {
        this.store.user.enemyColor = color;
      }
      this.store.saveLocalUser();
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
  <ViewBaseResponsive id="Start" :backgroundTint="'light'">
    <DarkContainer>
      <!-- First row -->
      <div class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4 mb-4">
        <!-- General info -->
        <ProfileSection id="General">
          <div
            class="flex-1 flex flex-col xl:grid gap-5 xl:gap-0 grid-cols-7 grid-rows-3"
          >
            <!-- Name, icon, koins -->
            <div
              class="col-span-3 row-span-2 flex items-center flex-col gap-2 p-1"
            >
              <!-- name -->
              <h1
                class="text-4xl text-center font-medium py-2 underline text-gray-900 dark:text-gray-200"
              >
                {{ store.user.username }}
              </h1>
              <!-- user profile icon -->
              <ProfileUserIconPicker
                :currentIcon="store.user.selectedIcon"
                :availableIcons="store.user.availableIcons"
                @setIcon="setIcon"
                @buyIcon="buyIcon"
              ></ProfileUserIconPicker>
              <!-- koins -->
              <div class="flex flex-row place-items-center gap-2 py-4">
                <span class="text-3xl font-bold">
                  {{ store.user.credit }}
                </span>
                <img
                  class="h-10"
                  src="../assets/svg/koin.svg"
                  alt="Koin (Gomoku coin)"
                />
                <BaseTooltipWithIcon
                  class="place-self-end"
                  :content="` Koin is a currency that is used for buying profile icons, backgrounds...
                     <br> It can be obtained by sheer playing. `"
                />
              </div>
            </div>
            <!-- Trophy -->
            <div
              class="col-span-2 row-span-2 flex flex-col justify-start items-center gap-2 p-2"
            >
              <h2
                class="text-4xl text-center font-medium py-2 text-gray-900 dark:text-gray-200"
              >
                Rank
              </h2>
              <ProfileRankRepresentation :currElo="store.user.elo" />
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
              class="2xl:mt-4 mt- col-span-full row-span-1 flex flex-col gap-3 items-center"
            >
              <div
                class="flex flex-row justify-around items-center flex-wrap gap-2"
              >
                <ProfileAchievement class="h-20 w-20" />
                <ProfileAchievement class="h-20 w-20" />
                <ProfileAchievement class="h-20 w-20" />
                <ProfileAchievement class="h-20 w-20" />
                <ProfileAchievement class="h-20 w-20" />
              </div>
              <BaseButton
                class="mb-2"
                @click="
                  () => {
                    $router.push(`/profile/${store.user.id}/achievements`);
                  }
                "
                >See all achievements</BaseButton
              >
            </div>
          </div>
        </ProfileSection>

        <!-- Match history -->
        <ProfileSection id="MatchHistory">
          <BaseBoldHeadline class="pt-2">Match history</BaseBoldHeadline>
          <ProfileMatchesContainer>
            <!-- Displaying few loaded matches -->
            <ProfileMatchBlade
              v-for="match in lastMatches"
              :key="match.id"
              :game="match"
            />
            <!-- All matches link -->
            <RouterLink :to="'/profile/' + store.user.id + '/match-history'">
              <BaseButton> All matches </BaseButton>
            </RouterLink>
          </ProfileMatchesContainer>
        </ProfileSection>
      </div>
      <!-- Second row -->
      <div class="flex-1 grid grid-cols-1 xl:grid-cols-2 gap-4">
        <!-- Customizations -->
        <ProfileSection id="Customizations">
          <BaseBoldHeadline class="pt-2 pb-4">Customizations</BaseBoldHeadline>
          <div
            class="flex-1 grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-0 justify-around"
          >
            <!-- Gameboard pickers -->
            <div class="flex-1 flex flex-col">
              <BaseMidHeadline>Gameboard</BaseMidHeadline>
              <div class="flex flex-row justify-around pt-3 px-3 gap-2 flex-1">
                <div class="flex flex-col">
                  <ProfilePickBoardButton
                    @setBoard="setBoard"
                    :currentBoard="store.user.gameBoard"
                    :myColor="store.user.playerColor"
                    :enemyColor="store.user.enemyColor"
                    :type="'standard'"
                  />
                </div>
                <div class="flex flex-col">
                  <ProfilePickBoardButton
                    @setBoard="setBoard"
                    :currentBoard="store.user.gameBoard"
                    :type="'classic'"
                  />
                </div>
                <div class="flex flex-col">
                  <ProfilePickBoardButton
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
            <div class="flex-1 flex flex-col">
              <BaseMidHeadline>Game colors</BaseMidHeadline>
              <div
                class="flex flex-row justify-around md:mt-2 p-3 gap-2 flex-1"
              >
                <div class="flex flex-col items-center">
                  <BaseLowHeadline>Your color</BaseLowHeadline>
                  <ProfilePickColorButton
                    :currentColor="store.user.playerColor"
                    :isMyColor="true"
                    @setColor="setColor"
                  />
                </div>
                <div class="flex flex-col items-center">
                  <BaseLowHeadline>Enemy's color</BaseLowHeadline>
                  <ProfilePickColorButton
                    :currentColor="store.user.enemyColor"
                    :isMyColor="false"
                    @setColor="setColor"
                  />
                </div>
              </div>
            </div>
          </div>
          <div
            class="flex flex-1 flex-col md:flex-row justify-around md:items-center mt-4 lg:mt-0 gap-5 p-5"
          >
            <BaseButton
              @click="
                () => {
                  $router.push('/set-username');
                }
              "
              >Change Username</BaseButton
            >

            <BaseButton
              @click="
                () => {
                  $router.push('/set-email');
                }
              "
              >Change Email</BaseButton
            >

            <BaseButton
              @click="
                () => {
                  $router.push('/set-password');
                }
              "
              >Change Password</BaseButton
            >
          </div>
        </ProfileSection>

        <!-- Elo chart -->
        <!-- TODO replace the dummy graph with one with real data; add switches and so on -->
        <ProfileSection id="Graphs">
          <BaseBoldHeadline class="pt-2">Elo history</BaseBoldHeadline>
          <EloChart></EloChart>
        </ProfileSection>
      </div>
    </DarkContainer>
  </ViewBaseResponsive>
</template>
