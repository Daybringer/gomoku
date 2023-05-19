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
import { onBeforeMount, ref } from "vue";
import { useStore, userBase } from "@/store/store";
import { User } from "@/shared/interfaces/user.interface";
import { exampleUser1 } from "@/dummy_data/users";

const store = useStore();
const userID = useRoute().params.id;
const areWeVisitingProfile = ref(userID !== undefined);
let user = ref(userBase());
let isUserLoaded = ref(false);

onBeforeMount(async () => {
  if (areWeVisitingProfile.value) {
    user.value = await fetchUser();
    isUserLoaded.value = true;
  } else {
    user.value = store.user;
    isUserLoaded.value = true;
  }
});

// TODO implement fetching a real user
async function fetchUser(): Promise<User> {
  return new Promise<User>((resolve) => {
    setTimeout(() => {
      resolve(exampleUser1);
    }, 2000);
  });
}
</script>

<template>
  <ViewBaseResponsive class="flex-1 flex flex-col gap-12" id="Start">
    <BaseLoadingSpinner
      class="absolute top-1/2 left-1/2 h-24 w-24"
      v-if="!isUserLoaded"
    ></BaseLoadingSpinner>
    <!-- General info -->
    <DarkContainer v-show="isUserLoaded">
      <GeneralProfileSection
        :user="user"
        :visiting-profile="areWeVisitingProfile"
      >
      </GeneralProfileSection>
    </DarkContainer>

    <!-- Match history -->
    <DarkContainer v-show="isUserLoaded">
      <MatchHistoryProfileSection
        :userID="user.id"
      ></MatchHistoryProfileSection>
    </DarkContainer>
    <!-- Customizations -->
    <DarkContainer v-if="!areWeVisitingProfile" v-show="isUserLoaded">
      <CustomizationProfileSection></CustomizationProfileSection>
    </DarkContainer>
  </ViewBaseResponsive>
</template>
