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
import { User } from "@/shared/interfaces/user.interface";
import usersRepository from "@/repositories/usersRepository";

const store = useStore();
const userID = useRoute().params.id;
const areWeVisitingProfile = ref(userID !== undefined);
let visitedUser = reactive(userBase());

let isUserLoaded = ref(false);

onBeforeMount(async () => {
  if (areWeVisitingProfile.value) {
    const fetchedUser: User = (
      await usersRepository.getUserProfile(Number(userID))
    ).data;
    store.copyUser(fetchedUser, visitedUser);
    isUserLoaded.value = true;
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
        v-if="!isUserLoaded"
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
          :userID="areWeVisitingProfile ? visitedUser.id : store.user.id"
        ></MatchHistoryProfileSection>
      </DarkContainer>
      <DarkContainer v-if="!areWeVisitingProfile" v-show="isUserLoaded">
        <CustomizationProfileSection></CustomizationProfileSection>
      </DarkContainer>
    </div>
  </ViewBaseResponsive>
</template>
