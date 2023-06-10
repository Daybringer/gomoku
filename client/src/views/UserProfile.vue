<script setup lang="ts">
// Components
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import GeneralProfileSection from "@/components/TheGeneralProfileSection.vue";
import MatchHistoryProfileSection from "@/components/TheMatchHistoryProfileSection.vue";
import CustomizationProfileSection from "@/components/TheCustomizationProfileSection.vue";
import DarkContainer from "@/components/DarkContainer.vue";
import BaseLoadingSpinner from "@/components/BaseLoadingSpinner.vue";
// TS
import { useRoute } from "vue-router";
import { onBeforeMount, reactive, ref } from "vue";
import { useStore, userBase } from "@/store/store";
import usersRepository from "@/repositories/usersRepository";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import router from "@/router";

const store = useStore();
const userID = useRoute().params.id;
const areWeVisitingProfile = ref(userID !== undefined);
let visitedUser = reactive(userBase());
let isUserLoaded = ref(false);

onBeforeMount(async () => {
  if (areWeVisitingProfile.value) {
    usersRepository
      .getUserProfile(Number(userID))
      .then((response) => {
        store.copyUser(response.data, visitedUser);
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
  <ViewBaseResponsive class="items-center" id="Start">
    <div class="xl:w-60 flex-1 flex flex-col gap-12">
      <BaseLoadingSpinner
        class="absolute top-1/2 left-1/2 h-24 w-24"
        v-show="!isUserLoaded"
      ></BaseLoadingSpinner>
      <DarkContainer v-show="isUserLoaded">
        <GeneralProfileSection
          :user="areWeVisitingProfile ? visitedUser : store.user"
          :visiting-profile="areWeVisitingProfile"
        >
        </GeneralProfileSection>
      </DarkContainer>

      <DarkContainer v-show="isUserLoaded">
        <MatchHistoryProfileSection
          :userID="areWeVisitingProfile ? Number(userID) : store.user.id"
        ></MatchHistoryProfileSection>
      </DarkContainer>
      <DarkContainer v-if="!areWeVisitingProfile">
        <CustomizationProfileSection></CustomizationProfileSection>
      </DarkContainer>
    </div>
  </ViewBaseResponsive>
</template>
