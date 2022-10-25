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
<style scoped>
.notification-enter-from {
  transform: translateX(-180px);
  opacity: 20%;
}
.notification-enter-to {
  transition: 0.25s ease-out;
  transform: translateX(0px);
  opacity: 100%;
}
.notification-leave-from {
  transform: translateX(0px);
  opacity: 100%;
}
.notification-leave-to {
  transition: 0.25s ease-in;
  transform: translatex(180px);
  opacity: 20%;
}
</style>
