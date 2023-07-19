<template>
  <div>some</div>
  <BaseButton
    @click="
      () => {
        campaign.iterate();
        router.back();
      }
    "
  ></BaseButton>
</template>
<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import router from "@/router";
import { useCampaignStore } from "@/store/campaign";

const campaign = useCampaignStore();
</script>
