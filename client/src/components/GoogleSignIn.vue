<template>
  <GoogleLogin
    :client-id="'1064130338503-0g3bbnb9i03s10mb1douod4oes4kp0th.apps.googleusercontent.com'"
    popup-type="TOKEN"
    :callback="callback"
  >
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
  console.log(response);
  // call to API
  profileStore
    .googleLogin(response.access_token)
    .then((isFirstTimeLogin) => {

      if(isFirstTimeLogin){
      notificationStore.createNotification(
        NotificationType.Success,
        "Successfully registred with Google account.<br> Please set your username"
      );
        router.push("/set-username");
      } else {
      notificationStore.createNotification(
        NotificationType.Success,
        "Successfully logged in with Google account"
      );
        router.push("/");
      }
    })
    .catch((err) =>
      notificationStore.createNotification(NotificationType.Error, err)
    );
};
</script>
