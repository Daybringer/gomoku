<template>
  <ViewBaseResponsive>
    <div class="flex-1 w-full md:w-50 flex">
      <GameChat :messages="[]" :my-color="'red'" :opponent-color="'blue'" />
    </div>
  </ViewBaseResponsive>
</template>
<script setup lang="ts">
import GameChat from "@/components/GameChat.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import { useCampaignStore } from "@/store/campaign";

const campaign = useCampaignStore();
</script>
