<template>
  <div
    :style="`--toast-duration:${notification.duration}s;--toast-color:${toastColor};`"
    class="min-toast-w relative flex flex-col place-items-center text-center mx-2 px-2 md:px-4 py-1 gap-1 md:py-1 bg-gray-50 dark:bg-gray-300 border border-transparent rounded-full custom-shadow"
    @click="selfClose"
  >
    <div class="flex-1 flex flex-row place-items-center pt-1">
      <InfoIcon
        v-if="notification.type === NotificationType.Info"
        class="h-7 md:h-8"
        :style="`color:${toastColor}`"
      />
      <SuccessIcon
        v-if="notification.type === NotificationType.Success"
        class="h-7 md:h-8"
        :style="`color:${toastColor}`"
      />
      <ErrorIcon
        v-if="notification.type === NotificationType.Error"
        class="h-7 md:h-8"
        :style="`color:${toastColor}`"
      />
      <AllertIcon
        v-if="notification.type === NotificationType.Warning"
        class="h-7 md:h-8"
        :style="`color:${toastColor}`"
      />
      <div
        class="px-2 flex-1 text-base text-center"
        v-html="notification.text"
      ></div>
    </div>
    <div
      class="progress left-0 bottom-0 border border-transparent rounded-full"
    ></div>
  </div>
</template>
<script setup lang="ts">
import AllertIcon from "@/assets/svg/AllertIcon.vue";
import ErrorIcon from "@/assets/svg/ErrorIcon.vue";
import InfoIcon from "@/assets/svg/InfoIcon.vue";
import SuccessIcon from "@/assets/svg/SuccessIcon.vue";
import {
  NotificationType,
  Notification,
  useNotificationsStore,
} from "@/store/notifications";
import { computed } from "vue";
const props = defineProps<{
  notification: Notification;
}>();
const toastColor = computed(() => {
  switch (props.notification.type) {
    case NotificationType.Error:
      // red-500
      return "#ef4444";
    case NotificationType.Success:
      // green-500
      return "#10B981";
    case NotificationType.Warning:
      // yellow-500
      return "#f59e0b";
    case NotificationType.Info:
      // blue-500
      return "#3B82F6";
    default:
      return "";
  }
});
function selfClose() {
  useNotificationsStore().removeNotification(props.notification.UUID);
}
</script>
<style scoped>
.custom-shadow {
  box-shadow: 0 2px 10px 1px rgba(0, 0, 0, 0.45);
}
.progress {
  background: var(--toast-color);
  width: 80%;
  height: 0.6rem;
  animation: progress var(--toast-duration) linear forwards;
}

.min-toast-w {
  min-width: 20rem;
}
@keyframes progress {
  to {
    width: 0;
  }
}
</style>
