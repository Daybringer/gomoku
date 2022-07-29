<template>
  <button
    class="w-2/5 sm:w-1/4 xl:w-60 cursor-pointer hover:opacity-80 focus:opacity-80"
    @click="
      () => {
        modalActive = true;
      }
    "
  >
    <img
      v-if="isPotato"
      src="../assets/svg/rank_icons/potatoRank.svg"
      alt="visual representation of potato rank"
    />
    <img
      v-if="isWarrior"
      src="../assets/svg/rank_icons/warriorRank.svg"
      alt="visual representation of warrior rank"
    />
    <img
      v-if="isSamurai"
      src="../assets/svg/rank_icons/samuraiRank.svg"
      alt="visual representation of samurai rank"
    />
    <img
      v-if="isChampion"
      src="../assets/svg/rank_icons/championRank.svg"
      alt="visual representation of champion rank"
    />
  </button>
  <base-modal
    @closeModal="
      () => {
        modalActive = false;
      }
    "
    :isActive="modalActive"
  >
    <div
      class="flex-1 flex flex-col md:flex-row gap-4 justify-between place-items-center flex-wrap"
    >
      <div class="flex-1 flex flex-col gap-2 justify-center place-items-center">
        <h3
          class="font-medium
         text-3xl text-center"
        >
          Potato <br />
          league
        </h3>
        <img
          class="h-36 md:h-52"
          src="../assets/svg/rank_icons/potatoRank.svg"
          alt="visual representation of potato rank"
        />
        <p class="text-xl">{{ potatoEloString }}</p>
      </div>
      <div class="flex-1 flex flex-col gap-2 justify-center place-items-center">
        <h3
          class="font-medium
         text-3xl text-center"
        >
          Warrior <br />
          <span class="font-normal">league</span>
        </h3>
        <img
          class="h-36 md:h-52"
          src="../assets/svg/rank_icons/warriorRank.svg"
          alt="visual representation of warrior rank"
        />
        <p class="text-xl">{{ warriorEloString }}</p>
      </div>
      <div class="flex-1 flex flex-col gap-2 justify-center place-items-center">
        <h3
          class="font-medium
         text-3xl text-center"
        >
          Samurai <br />
          league
        </h3>
        <img
          class="h-36 md:h-52"
          src="../assets/svg/rank_icons/samuraiRank.svg"
          alt="visual representation of samurai rank"
        />
        <p class="text-xl">{{ samuraiEloString }}</p>
      </div>
      <div class="flex-1 flex flex-col gap-2 justify-center place-items-center">
        <h3
          class="font-medium
         text-3xl text-center"
        >
          Champion <br />
          league
        </h3>
        <img
          class="h-36 md:h-52"
          src="../assets/svg/rank_icons/championRank.svg"
          alt="visual representation of champion rank"
        />
        <p class="text-xl">{{ championEloString }}</p>
      </div>
    </div>
  </base-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import {
  POTATO_MILESTONE,
  WARRIOR_MILESTONE,
  SAMURAI_MILESTONE,
  CHAMPION_MILESTONE,
} from "@/shared/constants";
export default defineComponent({
  name: "",
  props: { currElo: Number },
  components: { BaseModal },
  data(): { modalActive: boolean } {
    return { modalActive: false };
  },
  computed: {
    isPotato(): boolean {
      return (
        this.currElo! >= POTATO_MILESTONE && this.currElo! < WARRIOR_MILESTONE
      );
    },
    isWarrior(): boolean {
      return (
        this.currElo! >= WARRIOR_MILESTONE && this.currElo! < SAMURAI_MILESTONE
      );
    },
    isSamurai(): boolean {
      return (
        this.currElo! >= SAMURAI_MILESTONE && this.currElo! < CHAMPION_MILESTONE
      );
    },
    isChampion(): boolean {
      return this.currElo! > CHAMPION_MILESTONE;
    },
    potatoEloString(): string {
      return `0-${WARRIOR_MILESTONE} ELO`;
    },
    warriorEloString(): string {
      return `${WARRIOR_MILESTONE + 1}-${SAMURAI_MILESTONE} ELO`;
    },
    samuraiEloString(): string {
      return `${SAMURAI_MILESTONE + 1}-${CHAMPION_MILESTONE} ELO`;
    },
    championEloString(): string {
      return `>${CHAMPION_MILESTONE} ELO`;
    },
  },
  methods: {},
  mounted() {},
});
</script>
<style scoped></style>
