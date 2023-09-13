<template>
  <GoogleLogin :callback="callback">
    <button
      type="button"
      :disabled="isDisabled"
      class="border-2 border-gray-200 shadow-md text-gray-500 dark:text-gray-300 rounded-lg px-10 py-1"
      :class="
        isDisabled
          ? 'cursor-not-allowed'
          : 'dark:hover:text-gomoku-blue hover:text-gomoku-blue hover:border-gomoku-blue focus:text-gomoku-blue dark:focus:text-gomoku-blue focus:border-gomoku-blue focus:outline-none'
      "
    >
      <!-- Facebook -->
      <FacebookIcon v-if="type === 'facebook'" class="h-8" />
      <!-- Google -->
      <GoogleIcon v-if="type === 'google'" class="h-6" />
    </button>
  </GoogleLogin>
</template>
<script setup lang="ts">
import { GoogleLogin } from "vue3-google-login";
import FacebookIcon from "@/assets/svg/FacebookIcon.vue";
import GoogleIcon from "@/assets/svg/GoogleIcon.vue";
import router from "@/router";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import { useStore } from "@/store/store";
defineProps<{ type: "google" | "facebook"; isDisabled?: boolean }>();
const store = useStore();
const notificationStore = useNotificationsStore();
const callback = (response) => {
  console.log(response);
  store.googleLogin;
};
// function googleLogin() {
//   // @ts-ignore
//   this.$gAuth
//     .signIn()
//     .then(async (res: any) => {
//       const isNewUser = await store.googleLogin(res.getAuthResponse().id_token);
//       if (isNewUser) {
//         router.push("/set-username");
//       } else {
//         router.push("/");
//       }
//     })
//     .catch((error: string) =>
//       notificationStore.createNotification(NotificationType.Error, error)
//     );
// }
</script>
