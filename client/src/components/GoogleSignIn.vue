<template>
  <GoogleLogin popup-type="TOKEN" :callback="callback">
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
import { useProfileStore } from "@/store/profile";
import router from "@/router";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
defineProps<{ isDisabled?: boolean }>();
const profileStore = useProfileStore();
const notificationStore = useNotificationsStore();
const callback: CallbackTypes.TokenResponseCallback = (response) => {
  // call to API
  profileStore
    .googleLogin(response.access_token)
    .then(() => {
      router.push("/");
      notificationStore.createNotification(
        NotificationType.Success,
        "Successfully logged in with Google account"
      );
    })
    .catch((err) =>
      notificationStore.createNotification(NotificationType.Error, err)
    );
};
</script>
