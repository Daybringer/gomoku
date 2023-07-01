<script setup lang="ts">
// Components
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import GeneralProfileSection from "@/components/TheGeneralProfileSection.vue";
import MatchHistoryProfileSection from "@/components/TheMatchHistoryProfileSection.vue";
import CustomizationProfileSection from "@/components/TheCustomizationProfileSection.vue";
import BaseLoadingSpinner from "@/components/BaseLoadingSpinner.vue";
import Container from "@/components/Container.vue";
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
const visitedUser = reactive(userBase());
const isUserLoaded = ref(false);

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
  <ViewBaseResponsive id="Start">
    <BaseLoadingSpinner
      class="absolute top-1/2 left-1/2 h-24 w-24"
      v-show="!isUserLoaded"
    ></BaseLoadingSpinner>
    <div class="xl:w-60 w-full flex-1 flex flex-col gap-6">
      <Container>
        <GeneralProfileSection
          :user="areWeVisitingProfile ? visitedUser : store.user"
          :visiting-profile="areWeVisitingProfile"
        />
      </Container>

      <Container v-show="isUserLoaded">
        <MatchHistoryProfileSection
          :userID="areWeVisitingProfile ? Number(userID) : store.user.id"
        />
      </Container>
      <Container v-show="!areWeVisitingProfile">
        <CustomizationProfileSection />
      </Container>
    </div>
  </ViewBaseResponsive>
</template>
