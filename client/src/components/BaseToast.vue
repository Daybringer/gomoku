<template>
  <div
    :style="`--toast-duration:${duration}s;--toast-color:${toastColor};`"
    class=" relative flex flex-col place-items-center text-center mx-4 px-4 py-1 gap-1 md:py-2 bg-gray-50 border border-transparent rounded-full shadow-2xl"
  >
    <div class="flex-1 flex flex-row place-items-center pt-2">
      <info-icon v-if="isInfo" class="h-8 text-blue-500" />
      <success-icon v-if="isSuccess" class="h-8 text-green-500" />
      <error-icon v-if="isError" class="h-8 text-red-500" />
      <allert-icon v-if="isWarning" class="h-8 text-yellow-500" />
      <div class="px-2 flex-1 text-sm md:text-base text-left">
        Some text here, error here, error there and things
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
.progress {
  background: var(--toast-color);
  width: 80%;
  height: 0.6rem;
  animation: progress var(--toast-duration) linear forwards;
}

@keyframes progress {
  to {
    width: 0;
  }
}
</style>
