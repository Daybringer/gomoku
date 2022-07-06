<template>
  <div
    class="bg-white dark:bg-gray-500 w-full rounded-lg min-h-12 p-2 grid md:grid-cols-2 gap-1 items-stretch md:flex-row  md:justify-between  shadow-md"
  >
    <!-- Names and icons -->
    <div class="grid grid-cols-11 items-center flex-1 gap-1 mb-2 md:mb-0">
      <profile-match-blade-icon-name-box
        :logged="logged"
        :username="username"
        class="col-span-5"
      />
      <p class="text-lg text-center">VS</p>
      <profile-match-blade-icon-name-box
        :logged="enemyLogged"
        :username="enemyUsername"
        class="col-span-5"
      />
    </div>
    <!-- Stuff -->
    <div class="grid grid-flow-col-dense items-center gap-2">
      <profile-match-blade-win-lose-icon
        class="col-span-1"
        :tie="tie"
        :win="win"
      />
      <profile-match-blade-game-type-icon
        class="col-span-1"
        :gameType="gameType"
      />
      <div class="col-span-1">{{ eloString }}</div>
      <div class="text-lg col-span-2">{{ humanDate }}</div>
      <div
        class="col-span-1 w-8 h-8 rounded-full  bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-50 hover:bg-gray-500 text-gray-900 cursor-pointer p-1"
      >
        <SVGWatchIcon />
      </div>
    </div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ProfileMatchBladeIconNameBox from "./ProfileMatchBladeIconNameBox.vue";
import ProfileMatchBladeWinLoseIcon from "./ProfileMatchBladeWinLoseIcon.vue";
import ProfileMatchBladeGameTypeIcon from "./ProfileMatchBladeGameTypeIcon.vue";
import SVGWatchIcon from "./SVGWatchIcon.vue";
import { GameType } from "@/shared/types";
export default defineComponent({
  name: "ProfileMatchBlade",
  props: {
    elo: Number,
    logged: Boolean,
    tie: Boolean,
    win: Boolean,
    username: String,
    enemyLogged: Boolean,
    enemyUsername: String,
    gameType: String,
    dateString: String,
  },
  components: {
    ProfileMatchBladeIconNameBox,
    ProfileMatchBladeWinLoseIcon,
    ProfileMatchBladeGameTypeIcon,
    SVGWatchIcon,
  },
  computed: {
    eloString(): string {
      return `${
        this.gameType === GameType.Ranked && (this.elo || 0) > 0 ? "+" : ""
      }${this.gameType === GameType.Ranked ? this.elo : "--"} Elo`;
    },
    humanDate(): string {
      const date = new Date(this.dateString!);
      return `${date.getDate()}.${date.getMonth()}.${date.getFullYear()}`;
    },
  },
});
</script>
