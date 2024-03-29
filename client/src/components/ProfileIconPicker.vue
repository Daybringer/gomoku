<template>
  <button
    @click="
      () => {
        modalActive = true;
      }
    "
    :disabled="disabled"
    class="border-gray-700 dark:border-gray-400 border-4 p-3 bg-gray-300 hover:bg-gray-400 dark:hover:bg-gray-500 dark:bg-gray-600 rounded-xl w-2/5 sm:w-1/4 xl:w-50"
    :class="disabled ? 'cursor-not-allowed' : 'cursor-pointer'">
    <ProfileIconSvg class="h-auto" :profileIcon="currentIcon" />
  </button>

  <!-- Select icon modal -->
  <BaseModal
    @closeModal="
      () => {
        modalActive = false;
      }
    "
    :isActive="modalActive">
    <div
      class="flex-1 flex flex-row gap-4 items-center justify-center flex-wrap">
      <button
        v-for="profileIcon in Object.values(ProfileIcon)"
        v-show="
          profileIcon !== ProfileIcon.transparent &&
          profileIcon !== ProfileIcon.guest
        "
        :key="profileIcon"
        class="bg-gray-300 dark:bg-gray-500 dark:hover:bg-gray-400 p-2 rounded-lg hover:bg-gray-400 relative"
        :class="
          currentIcon === profileIcon
            ? 'border-4 border-gray-800 dark:border-gray-200'
            : 'border-4 border-gray-200 dark:border-gray-800'
        "
        @click="
          () => {
            if (availableIcons.includes(profileIcon)) {
              $emit('setIcon', profileIcon);
              modalActive = false;
            } else {
              currentBuyIcon = profileIcon;
              buyModalActive = true;
            }
          }
        ">
        <ProfileIconSvg
          :profileIcon="profileIcon"
          class="md:h-20 max-md:h-14"
          :class="!availableIcons.includes(profileIcon) ? 'opacity-50' : ''" />
        <div
          v-show="!availableIcons.includes(profileIcon)"
          class="absolute bottom-1 right-1 rounded h-6 w-6 bg-gray-200 border-2 border-gray-600 text-gray-900 z-30">
          <LockIcon />
        </div>
      </button>
    </div>
  </BaseModal>

  <!-- Buy icon modal -->
  <BaseModal
    :isActive="buyModalActive"
    @closeModal="
      () => {
        buyModalActive = false;
      }
    ">
    <div class="flex-1 flex flex-col gap-1 items-center">
      <BaseMidHeadline>
        {{ currentBuyIconRecord.iconFullName }}
      </BaseMidHeadline>
      <h4></h4>
      <hr
        class="w-1/3 border-2 rounded-sm border-gray-400 dark:border-gray-700 text-center" />
      <ProfileIconSvg
        class="max-md:h-24 md:h-32 my-2 border-gray-700 border-4 p-1 md:p-3 bg-gray-300 rounded-lg"
        :profileIcon="currentBuyIcon" />
      <p class="italic">
        {{ currentBuyIconRecord.description }}
      </p>
      <p
        v-show="!currentBuyIconRecord.purchasable"
        class="py-4 text-3xl font-medium text-red-400">
        Unpurchasable
      </p>
      <div
        v-show="currentBuyIconRecord.purchasable"
        class="flex flex-row place-items-center gap-2 py-4">
        <span class="text-3xl font-bold">
          {{ currentBuyIconRecord.price }}
        </span>
        <img
          class="h-10"
          src="@/assets/svg/koin.svg"
          alt="Koin (Gomoku coin)" />
      </div>
      <div class="flex flex-row">
        <BaseButton
          class="font-medium"
          @click="
            () => {
              $emit('buyIcon', currentBuyIcon);
              buyModalActive = false;
            }
          "
          :class="
            currentBuyIconRecord.purchasable
              ? 'bg-green-300 hover:bg-green-200 dark:bg-green-500 dark:hover:bg-green-600'
              : 'dark:hover:bg-gray-600 cursor-not-allowed'
          "
          >Purchase</BaseButton
        >
      </div>
    </div>
  </BaseModal>
</template>
<script setup lang="ts">
import { ProfileIcon, profileIconRecords } from "@/shared/icons";
import { ref, watch } from "vue";
// components
import BaseModal from "@/components/BaseModal.vue";
import ProfileIconSvg from "./ProfileIcon.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import LockIcon from "@/assets/svg/LockIcon.vue";
import { computed } from "@vue/reactivity";

const props = defineProps<{
  currentIcon: ProfileIcon;
  availableIcons: ProfileIcon[];
  disabled?: boolean;
}>();
defineEmits<{
  (e: "setIcon", profileIcon: ProfileIcon);
  (e: "buyIcon", profileIcon: ProfileIcon);
}>();

const modalActive = ref(false);
const buyModalActive = ref(false);
const currentBuyIcon = ref(ProfileIcon.defaultBoy);
const currentBuyIconRecord = computed(
  () => profileIconRecords[currentBuyIcon.value]
);
watch(props.availableIcons, () => {
  console.log(props.availableIcons);
});
</script>
