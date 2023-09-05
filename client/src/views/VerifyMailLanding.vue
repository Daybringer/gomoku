<template>
  <ViewBaseResponsive> </ViewBaseResponsive>
</template>
<script setup lang="ts">
import { onMounted } from "vue";
import { useStore } from "@/store/store";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import router from "@/router";
const notificationStore = useNotificationsStore();
onMounted(() => {
  const urlParams = new URLSearchParams(window.location.search);
  const verificationCode = urlParams.get("code") || "";
  const username = urlParams.get("username") || "";
  const store = useStore();
  store
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

<style scoped></style>
