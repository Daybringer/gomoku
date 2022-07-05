<template>
  <div
    class="bg-white dark:bg-gray-500 w-full rounded-lg min-h-12 p-2 flex flex-row items-center justify-between shadow-md"
  >
    <div class="flex flex-row items-center">
      <profile-match-blade-icon-name-box
        :logged="true"
        :username="'Daybringer'"
      />
      <p class="px-2 text-lg">VS</p>
      <profile-match-blade-icon-name-box :logged="false" :username="''" />
    </div>
    <profile-match-blade-win-lose-icon :tie="false" :win="true" />
    <profile-match-blade-game-type-icon :gameType="'quick'" />
    <div>+0 Elo</div>
    <div class="text-lg">12.11.2022</div>
    <div>...</div>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ProfileMatchBladeIconNameBox from "./ProfileMatchBladeIconNameBox.vue";
import ProfileMatchBladeWinLoseIcon from "./ProfileMatchBladeWinLoseIcon.vue";
import ProfileMatchBladeGameTypeIcon from "./ProfileMatchBladeGameTypeIcon.vue";
export default defineComponent({
  name: "ProfileMatchBlade",
  components: {
    ProfileMatchBladeIconNameBox,
    ProfileMatchBladeWinLoseIcon,
    ProfileMatchBladeGameTypeIcon,
  },
});
</script>
