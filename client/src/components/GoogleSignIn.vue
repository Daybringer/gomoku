<template>
  <GoogleLogin :callback="callback">
    <SocialSignInButton :is-disabled="isDisabled">
      <GoogleIcon class="h-6" />
    </SocialSignInButton>
  </GoogleLogin>
</template>

<script setup lang="ts">
import type { CallbackTypes } from "vue3-google-login";
import { GoogleLogin } from "vue3-google-login";
import SocialSignInButton from "./SocialSignInButton.vue";
import GoogleIcon from "@/assets/svg/GoogleIcon.vue";
const props = defineProps<{ isDisabled?: boolean }>();
const callback: CallbackTypes.CodeResponseCallback = (response) => {
  // call to API
};
</script>
