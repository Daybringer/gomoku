<template>
  <div
    :style="`--toast-duration:${duration}s;--toast-color:${toastColor};`"
    class="min-toast-w relative flex flex-col place-items-center text-center mx-2 px-2 md:px-4 py-1 gap-1 md:py-1 bg-gray-50 dark:bg-gray-300 border border-transparent rounded-full custom-shadow"
  >
    <div class="flex-1 flex flex-row place-items-center pt-1">
      <info-icon v-if="isInfo" class="h-7 md:h-8 self-start text-blue-500" />
      <success-icon v-if="isSuccess" class="h-7 md:h-8 text-green-500" />
      <error-icon v-if="isError" class="h-7 md:h-8 text-red-500" />
      <allert-icon v-if="isWarning" class="h-7 md:h-8 text-yellow-500" />
      <div class="px-2 flex-1 text-base text-center">
        {{ text }}
      </div>
    </div>
    <div
      class="progress left-0 bottom-0 border border-transparent rounded-full"
    ></div>
  </div>
</template>
<script lang="ts">
import AllertIcon from "@/assets/svg/AllertIcon.vue";
import ErrorIcon from "@/assets/svg/ErrorIcon.vue";
import InfoIcon from "@/assets/svg/InfoIcon.vue";
import SuccessIcon from "@/assets/svg/SuccessIcon.vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import { defineComponent, PropType } from "vue";
export default defineComponent({
  props: {
    UUID: { type: String, required: true },
    type: { type: Object as PropType<NotificationType>, required: true },
    text: { type: String, required: true },
    duration: { type: Number, required: true },
    autoDismiss: { type: Boolean, required: true },
    imageName: String,
  },
  components: { InfoIcon, SuccessIcon, ErrorIcon, AllertIcon },
  data(): {} {
    return {};
  },
  computed: {
    toastColor(): string {
      if (this.isError) {
        // red-500
        return "#ef4444";
      } else if (this.isSuccess) {
        // green-500
        return "#10B981";
      } else if (this.isWarning) {
        // yellow-500
        return "#f59e0b";
      } else if (this.isInfo) {
        // blue-500
        return "#3B82F6";
      }
      return "";
    },
    isInfo() {
      return this.type === NotificationType.Info;
    },
    isError() {
      return this.type === NotificationType.Error;
    },
    isSuccess() {
      return this.type === NotificationType.Success;
    },
    isWarning() {
      return this.type === NotificationType.Warning;
    },
  },
  methods: {
    selfClose() {
      const store = useNotificationsStore();
      store.removeNotification(this.UUID);
    },
  },
  mounted() {},
});
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
