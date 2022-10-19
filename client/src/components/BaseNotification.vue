<template>
  <transition name="notification">
    <div
      class="fixed bottom-4 md:bottom-8 left-auto py-3 md:py-4 px-5 md:px-8 rounded-full md:text-lg bg-green-500 text-white"
    >
      {{ text }}
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseNotification",
  props: { text: String },
  data(): {} {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
});
</script>
<style></style>
