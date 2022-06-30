<template>
  <view-base>
    <h1 class="md:text-5xl text-4xl font-medium text-center">
      404 - Site not found
    </h1>
  </view-base>
</template>

<script lang="ts">
// Components
import ViewBase from "@/components/ViewBaseFixedHeight.vue";
// Utils
import { defineComponent } from "vue";
export default defineComponent({
  name: "NotFound",
  components: { ViewBase },
  data() {
    return {};
  },
});
</script>

<style scoped></style>
