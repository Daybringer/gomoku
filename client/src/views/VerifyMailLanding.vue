<template>
  <view-base :placeItems="'start'">
    <div
      class="max-w-lg w-full md:p-8 p-4 space-y-6 rounded-lg border-gray-50 bg-white dark:bg-gray-600 dark:border-transparent border-opacity-30 border-t-1 shadow-2xl border-2"
    >
      Email confirmation
      <status-message
        v-show="resolved"
        :type="!success ? 'error' : 'success'"
        :text="statusText"
      ></status-message>
    </div>
  </view-base>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import StatusMessage from "@/components/FormStatusMessage.vue";
import ViewBase from "@/components/ViewBaseFixedHeight.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import { useStore } from "@/store/store";
export default defineComponent({
  name: "VerifyMailLanding",
  data() {
    return {
      resolved: false,
      success: true,
      statusText: "",
    };
  },
  components: { StatusMessage, BaseHighHeadline, ViewBase },
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    const verificationCode = urlParams.get("code") || "";
    const username = urlParams.get("username") || "";

    const store = useStore();

    store
      .verifyMail(verificationCode, username)
      .then((res) => {
        this.resolved = true;
        this.success = true;
        this.statusText =
          "Email has been successfully confirmed. You can now log in.";
      })
      .catch((err) => {
        this.resolved = true;
        this.success = false;
        this.statusText = err;
      });
  },
});
</script>

<style scoped></style>
