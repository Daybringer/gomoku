<script setup lang="ts">
// Components
import BaseView from "@/components/BaseView.vue";
import GeneralProfileSection from "@/components/TheGeneralProfileSection.vue";
import MatchHistoryProfileSection from "@/components/TheMatchHistoryProfileSection.vue";
import CustomizationProfileSection from "@/components/TheCustomizationProfileSection.vue";
import BaseLoadingSpinner from "@/components/BaseLoadingSpinner.vue";
import Container from "@/components/Container.vue";
// TS
import { useRoute } from "vue-router";
import { computed, onBeforeMount, reactive, ref } from "vue";
import { useProfileStore, userBase } from "@/store/profile";
import usersRepository from "@/repositories/usersRepository";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import router from "@/router";
import TheStatisticsUserProfileSection from "@/components/TheStatisticsUserProfileSection.vue";
import { storeToRefs } from "pinia";

const { user } = storeToRefs(useProfileStore());
const userID = ref(useRoute().params.id);
const areWeVisitingProfile = ref(userID.value !== undefined);
const currUserID = computed(() =>
  areWeVisitingProfile.value ? Number(userID.value) : user.value.id
);
const visitedUser = reactive(userBase());
const isUserLoaded = ref(false);

onBeforeMount(async () => {
  if (areWeVisitingProfile.value) {
    usersRepository
      .getUserProfile(Number(userID.value))
      .then((response) => {
        useProfileStore().copyUser(response.data, visitedUser);
        isUserLoaded.value = true;
      })
      .catch(() => {
        useNotificationsStore().createNotification(
          NotificationType.Error,
          "User with given ID doesn't exist"
        );
        router.push("/");
      });
  } else {
    isUserLoaded.value = true;
  }
});
</script>

<template>
  <BaseView id="Start">
    <BaseLoadingSpinner
      class="absolute top-1/2 left-1/2 h-24 w-24"
      v-show="!isUserLoaded"></BaseLoadingSpinner>
    <div class="xl:w-60 w-full flex-1 flex flex-col gap-6">
      <Container>
        <GeneralProfileSection
          :user="areWeVisitingProfile ? visitedUser : user"
          :visiting-profile="areWeVisitingProfile" />
      </Container>

      <Container v-show="isUserLoaded">
        <MatchHistoryProfileSection :userID="currUserID" />
      </Container>
      <Container v-show="isUserLoaded">
        <TheStatisticsUserProfileSection :user-id="currUserID" />
      </Container>
      <Container v-show="!areWeVisitingProfile">
        <CustomizationProfileSection />
      </Container>
    </div>
  </BaseView>
</template>
