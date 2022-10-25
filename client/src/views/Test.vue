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
    createNotification() {
      const store = useNotificationsStore();
      store.createNotification(NotificationType.Success, "Some text");
    },
  },
});
</script>
<template>
  <view-base-fixed-height :placeItems="'start'">
    <div>
      <button
        class="rounded-lg shadow-lg py-2 px-4 text-xl border-2 border-gray-500"
        @click="createNotification()"
      >
        Create notification
      </button>
    </div>
  </view-base-fixed-height>
</template>
<style scoped></style>
