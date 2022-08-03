<template>
  <button
    @click="
      () => {
        modalActive = true;
      }
    "
    class=" border-gray-700 dark:border-gray-400 border-4 p-1 md:p-3
    bg-gray-300 hover:bg-gray-400
    dark:hover:bg-gray-500 dark:bg-gray-600
    rounded-xl w-2/5 sm:w-1/4 xl:w-50 cursor-pointer"
  >
    <img :src="getSvgURL(currentIcon || '')" alt="" />
  </button>

  <!-- Select icon modal -->
  <base-modal
    @closeModal="
      () => {
        modalActive = false;
      }
    "
    :isActive="modalActive"
  >
    <div
      class="flex-1 flex flex-row gap-4 items-center justify-center flex-wrap"
    >
      <button
        v-for="iconName in Object.values(profileIconList)"
        v-show="iconName !== 'transparent'"
        :key="iconName"
        class=" bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400  p-2 rounded-lg hover:bg-gray-400 relative"
        :class="
          currentIcon == iconName
            ? 'border-4 border-gray-800 dark:border-gray-200'
            : 'border-4 border-gray-200 dark:border-gray-800'
        "
        @click="
          () => {
            this.currentBuyIconRecord = this.getIconRecord(iconName);
            this.currentBuyIconName = iconName;
            if (this.isAvailable(iconName)) {
              this.$emit('setIcon', iconName);
              this.modalActive = false;
            } else {
              this.buyModalActive = true;
            }
          }
        "
      >
        <base-tooltip :content="getIconRecord(iconName).iconFullName">
          <img
            class="h-16 md:h-20"
            :class="!this.isAvailable(iconName) ? 'opacity-50' : ''"
            :src="getSvgURL(iconName)"
            alt=""
          />
        </base-tooltip>
        <div
          v-show="!this.isAvailable(iconName)"
          class="absolute bottom-1 right-1 rounded h-6 w-6 bg-gray-200 border-2 border-gray-600 text-gray-900 z-30"
        >
          <lock-svg />
        </div>
      </button>
      <div
        class="h-20 md:h-24 w-20 md:w-24 mx-2 px-8 flex place-items-center justify-center text-center rounded-md "
      >
        <p class=" italic">More coming...</p>
      </div>
    </div>
  </base-modal>

  <!-- Buy icon modal -->
  <base-modal
    :isActive="buyModalActive"
    @closeModal="
      () => {
        buyModalActive = false;
      }
    "
  >
    <div class="flex-1 flex flex-col gap-1 items-center">
      <base-mid-headline class="dark:text-gray-800">
        {{ currentBuyIconRecord.iconFullName }}
      </base-mid-headline>
      <h4></h4>
      <hr
        class="w-1/3 border-2 rounded-sm border-gray-400 dark:border-gray-700 text-center"
      />
      <img
        class="h-20 md:h-32 my-2 border-gray-700 border-4 p-1 md:p-3
    bg-gray-300 rounded-lg"
        :src="getSvgURL(currentBuyIconName)"
        alt=""
      />
      <p class="italic">
        {{ currentBuyIconRecord.description }}
      </p>
      <p
        v-show="!currentBuyIconRecord.purchasable"
        class="py-4 text-3xl font-medium text-red-400"
      >
        Unpurchasable
      </p>
      <div
        v-show="currentBuyIconRecord.purchasable"
        class="flex flex-row place-items-center gap-2 py-4"
      >
        <span class="text-3xl font-bold">
          {{ currentBuyIconRecord.price }}
        </span>
        <img
          class="h-10"
          src="@/assets/svg/koin.svg"
          alt="Koin (Gomoku coin)"
        />
      </div>
      <div class="flex flex-row">
        <base-button
          class=" font-medium"
          @click="
            () => {
              this.$emit('buyIcon', currentBuyIconName);
              this.buyModalActive = false;
            }
          "
          :class="
            currentBuyIconRecord.purchasable
              ? 'bg-green-300 hover:bg-green-200 dark:bg-green-500 dark:hover:bg-green-600'
              : 'dark:hover:bg-gray-600 cursor-not-allowed'
          "
          >Purchase</base-button
        >
      </div>
    </div>
  </base-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import {
  ProfileIcon,
  profileIconRecords,
  ProfileIconRecordContent,
} from "@/shared/icons";

// components
import BaseModal from "@/components/BaseModal.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseTooltip from "./BaseTooltip.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import LockSvg from "@/assets/svg/LockSvg.vue";
export default defineComponent({
  name: "",
  props: {
    currentIcon: String,
    availableIcons: Object,
  },
  components: { BaseModal, LockSvg, BaseTooltip, BaseMidHeadline, BaseButton },
  data(): {
    modalActive: boolean;
    buyModalActive: boolean;
    currentBuyIconName: string;
    currentBuyIconRecord: ProfileIconRecordContent;
  } {
    return {
      modalActive: false,
      buyModalActive: false,
      currentBuyIconRecord: profileIconRecords.defaultBoy,
      currentBuyIconName: ProfileIcon.defaultBoy,
    };
  },
  computed: {
    profileIconList(): string[] {
      return Object.values(ProfileIcon);
    },
    availableIconsArr(): string[] {
      return Object.values(this.availableIcons!);
    },
  },
  methods: {
    getSvgURL(svgName: string) {
      return require(`../assets/svg/profile_icons/${svgName}.svg`);
    },
    isAvailable(iconName: string): boolean {
      return this.availableIcons!.includes(iconName);
    },
    getIconRecord(iconName: string): ProfileIconRecordContent {
      return profileIconRecords[iconName];
    },
    buyIcon(iconName: string): void {},
  },
  mounted() {},
});
</script>
<style scoped></style>
