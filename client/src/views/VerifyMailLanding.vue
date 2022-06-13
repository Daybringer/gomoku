<template>
  <div
    class="min-height-screen-calc flex lg:flex-row flex-col bg-gray-100 text-gray-900 dark:text-gray-100  dark:bg-gray-700"
  >
    <h2>Email verification</h2>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";

import { useStore } from "@/store/store";
export default defineComponent({
  name: "VerifyMailLanding",
  data() {},
  mounted() {
    const urlParams = new URLSearchParams(window.location.search);

    const verificationCode = urlParams.get("code");
    const username = urlParams.get("username");

    const store = useStore();
    store
      .verifyMail(verificationCode, username)
      .then((res) => {
        console.log("success", res);
      })
      .catch((err) => {
        console.log(err);
      });
  },
});
</script>

<style scoped></style>
