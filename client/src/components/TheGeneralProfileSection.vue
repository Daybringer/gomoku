<script setup lang="ts">
import ProfileIconPicker from "@/components/ProfileIconPicker.vue";
import BaseTooltipWithIcon from "@/components/BaseTooltipWithIcon.vue";
import ProfileAchievement from "@/components/ProfileAchievement.vue";
import ProfileSection from "./ProfileSection.vue";
import ProfileRankRepresentation from "@/components/ProfileRankRepresentation.vue";
import BaseMidHeadline from "./BaseMidHeadline.vue";
import BaseButton from "./BaseButton.vue";
import UsersRepository from "@/repositories/usersRepository";
import * as utils from "@/utils/user";
import { User } from "@/shared/interfaces/user.interface";
import { ProfileIcon, profileIconRecords } from "@/shared/icons";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import { useStore } from "@/store/store";

defineProps<{ user: User; visitingProfile: boolean }>();
const store = useStore();
const notificationsStore = useNotificationsStore();

// <---Functions--->
async function setIcon(profileIcon: ProfileIcon) {
  if (store.user.availableIcons.includes(profileIcon))
    UsersRepository.selectIcon(profileIcon).then(() => {
      store.user.selectedIcon = profileIcon;
      store.saveLocalUser();
    });
}

async function buyIcon(profileIcon: ProfileIcon) {
  const price = profileIconRecords[profileIcon].price;
  if (store.user.credit >= price) {
    UsersRepository.buyIcon(profileIcon).then(() => {
      store.user.credit -= price;
      store.user.availableIcons.push(profileIcon);
    });
  } else {
    notificationsStore.createNotification(
      NotificationType.Error,
      "You don't have enough Koins."
    );
  }
}
</script>
<template>
  <ProfileSection
    class="flex-1 flex flex-col xl:grid gap-5 xl:gap-0 grid-cols-7 grid-rows-3"
    id="General"
  >
    <!-- Name, icon, koins -->
    <div class="col-span-3 row-span-2 flex items-center flex-col gap-2 p-1">
      <!-- name -->
      <h1 class="text-4xl text-center font-medium py-2 underline">
        {{ user.username }}
      </h1>
      <!-- user profile icon -->
      <ProfileIconPicker
        :disabled="visitingProfile"
        :currentIcon="user.selectedIcon"
        :availableIcons="user.availableIcons"
        @setIcon="setIcon"
        @buyIcon="buyIcon"
      />
      <!-- koins -->
      <div
        class="flex flex-row place-items-center gap-2 py-4"
        v-if="!visitingProfile"
      >
        <span class="text-3xl font-bold">
          {{ user.credit }}
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
      <ProfileRankRepresentation :currElo="user.elo" />
      <p>
        <span class="text-xl font-medium">ELO: </span
        ><span class="text-lg">{{ user.elo }}</span>
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
        <span>{{ utils.getTotalMatches(user) }}</span>
      </p>
      <p class="whitespace-nowrap">
        <span class="text-lg font-medium">Won: </span>
        <span>{{ utils.getTotalWon(user) }}</span>
      </p>
      <p class="whitespace-nowrap">
        <span class="text-lg font-medium">Lost: </span>
        <span>{{ utils.getTotalLost(user) }}</span>
      </p>
      <p class="whitespace-nowrap">
        <span class="text-lg font-medium">Tied: </span>
        <span>{{ utils.getTotalTie(user) }}</span>
      </p>
    </div>
    <!-- Achievements -->
    <div
      class="2xl:mt-4 mt- col-span-full row-span-1 flex flex-col gap-3 items-center"
    >
      <BaseMidHeadline>Achievements</BaseMidHeadline>
      <div class="flex flex-row justify-around items-center flex-wrap gap-2">
        <!-- <ProfileAchievement class="h-20 w-20" />
          <ProfileAchievement class="h-20 w-20" />
          <ProfileAchievement class="h-20 w-20" />
          <ProfileAchievement class="h-20 w-20" />
          <ProfileAchievement class="h-20 w-20" /> -->
      </div>
      <RouterLink :to="`/profile/${user.id}/achievements`">
        <BaseButton class="mb-2">See all achievements</BaseButton>
      </RouterLink>
    </div>
  </ProfileSection>
</template>
