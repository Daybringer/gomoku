<template>
  <BaseView> </BaseView>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import BaseView from "@/components/BaseView.vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import router from "@/router";
import authRepository from "@/repositories/authRepository";
const notificationStore = useNotificationsStore();
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const verificationCode = urlParams.get("code") || "";
  const username = urlParams.get("username") || "";
  authRepository
    .verifyMail(verificationCode, username)
    .then(() => {
      notificationStore.createNotification(
        NotificationType.Success,
        "Email has been successfully confirmed. You can now log in."
      );
      router.push("/login");
    })
    .catch((err) => {
      notificationStore.createNotification(NotificationType.Error, err);
      router.push("/");
    });
});
</script>
