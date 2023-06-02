<script setup lang="ts">
import ProfileIconPicker from "@/components/ProfileIconPicker.vue";
import BaseTooltipWithIcon from "@/components/BaseTooltipWithIcon.vue";
import ProfileAchievement from "@/components/ProfileAchievement.vue";
import ProfileSection from "./ProfileSection.vue";
import ProfileRankRepresentation from "@/components/ProfileRankRepresentation.vue";
import BaseMidHeadline from "./BaseMidHeadline.vue";
import BaseButton from "./BaseButton.vue";
import UsersRepository from "@/repositories/usersRepository";
import {
  getTotalLost,
  getTotalMatches,
  getTotalTie,
  getTotalWon,
} from "@/utils/user";
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
      notificationsStore.createNotification(
        NotificationType.Success,
        "Successfully bought icon."
      );
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
    <!-- Trophy -->
    <div
      class="col-span-2 row-span-2 flex flex-col justify-start items-center gap-2 p-2"
    >
      <BaseMidHeadline>Rank</BaseMidHeadline>
      <ProfileRankRepresentation :currElo="user.elo" />
      <p>
        <span class="text-xl font-medium">ELO: </span
        ><span class="text-lg">{{ user.elo }}</span>
      </p>
      <p>
        <!-- TODO leaderboard position -->
        <span class="text-xl font-medium">Leaderboard: </span
        ><span class="text-lg">#1</span>
      </p>
    </div>
    <!-- Name, icon, koins -->
    <div class="col-span-3 row-span-2 flex items-center flex-col gap-2 p-1">
      <!-- name -->
      <BaseMidHeadline style="font-size: 2rem" class="underline">{{
        user.username
      }}</BaseMidHeadline>
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

    <!-- User match statistics -->
    <div
      class="col-span-2 row-span-2 flex flex-col justify-start items-center gap-2 p-2"
    >
      <BaseMidHeadline>Statistics</BaseMidHeadline>
      <p class="whitespace-nowrap">
        <span class="text-lg font-medium">Total matches: </span>
        <span> {{ getTotalMatches(user) }}</span>
      </p>
      <p class="whitespace-nowrap">
        <span class="text-lg font-medium">Won: </span>
        <span>{{ getTotalWon(user) }}</span>
      </p>
      <p class="whitespace-nowrap">
        <span class="text-lg font-medium">Lost: </span>
        <span>{{ getTotalLost(user) }}</span>
      </p>
      <p class="whitespace-nowrap">
        <span class="text-lg font-medium">Tied: </span>
        <span>{{ getTotalTie(user) }}</span>
      </p>
    </div>
    <!-- Achievements -->
    <div class="col-span-full flex flex-col gap-3 items-center">
      <BaseMidHeadline>Achievements</BaseMidHeadline>
      <div class="flex flex-row justify-around items-center flex-wrap gap-2">
        <ProfileAchievement v-for="item in [0, 1, 2, 3]" class="h-20 w-20" />
      </div>
      <RouterLink :to="`/profile/${user.id}/achievements`">
        <BaseButton class="mb-2">See all achievements</BaseButton>
      </RouterLink>
    </div>
  </ProfileSection>
</template>