<template>
  <view-base-responsive>
    <button @click="createGame()">Start game against AI</button>
  </view-base-responsive>
</template>
<script lang="ts">
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
  props: {},
  components: { ViewBaseResponsive },
  data(): {} {
    return {};
  },
  computed: {},
  methods: { createGame() {} },
  mounted() {},
});
</script>
<style scoped></style>
