<template>
  <div
    class="bg-white dark:bg-gray-500 w-full rounded-lg min-h-12 p-2 flex flex-row items-center justify-between shadow-md"
  >
    <div class="flex flex-row items-center">
      <profile-match-blade-icon-name-box
        :logged="logged"
        :username="username"
      />
      <p class="px-2 text-lg">VS</p>
      <profile-match-blade-icon-name-box
        :logged="enemyLogged"
        :username="enemyUsername"
      />
    </div>
    <profile-match-blade-win-lose-icon :tie="tie" :win="win" />
    <profile-match-blade-game-type-icon :gameType="gameType" />
    <div>{{ eloString }}</div>
    <div class="text-lg">{{ humanDate }}</div>
    <div
      class="rounded-full bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-50 hover:bg-gray-500 text-gray-900 cursor-pointer p-1"
    >
      <SVGWatchIcon />
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
      return `${date.getDay()}.${date.getMonth()}.${date.getFullYear()}`;
    },
  },
});
</script>
