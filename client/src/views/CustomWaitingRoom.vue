<template>
  <view-base-fixed-height>
    <div>
      <base-button>Create game</base-button>
    </div>
  </view-base-fixed-height>
</template>
<script lang="ts">
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import BaseButton from "@/components/BaseButton.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "CustomWaitingRoom",
  props: {},
  components: { ViewBaseFixedHeight, BaseButton },
  data(): {} {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
});
</script>
<style scoped></style>
