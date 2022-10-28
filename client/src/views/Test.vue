<script lang="ts">
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import { defineComponent } from "vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
export default defineComponent({
  data(): {} {
    return {};
  },
  components: {
    ViewBaseFixedHeight,
  },
  name: "Test",
  methods: {
    createNotification(mode: number) {
      const store = useNotificationsStore();
      if (mode == 1) {
        store.createNotification(NotificationType.Success, "Some text");
      } else if (mode == 2) {
        store.createNotification(NotificationType.Error, "Some text");
      } else if (mode == 3) {
        store.createNotification(NotificationType.Warning, "Some text");
      } else {
        store.createNotification(NotificationType.Info, "Some text");
      }
    },
  },
});
</script>
<template>
  <view-base-fixed-height :placeItems="'start'">
    <div>
      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(1)"
      >
        Create success notification
      </button>
      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(2)"
      >
        Create error notification
      </button>
      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(3)"
      >
        Create warning notification
      </button>

      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification(4)"
      >
        Create info notification
      </button>
    </div>
  </view-base-fixed-height>
</template>
<style scoped></style>
