<template>
  <SocialSignInButton :is-disabled="isDisabled">
    <FacebookIcon class="h-8 -mt-1 -mb-1" />
  </SocialSignInButton>
</template>

<script setup lang="ts">
import FacebookIcon from "@/assets/svg/FacebookIcon.vue";
import SocialSignInButton from "./SocialSignInButton.vue";
const props = defineProps<{ isDisabled?: boolean }>();
</script>
