<template>
  <transition name="notification">
    <div
      class="fixed bottom-4 md:bottom-8 left-auto py-3 md:py-4 px-5 md:px-8 rounded-full md:text-lg bg-green-500 text-white"
    >
      <slot></slot>
    </div>
  </transition>
</template>
<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "BaseNotification",
  props: {},
  data(): {} {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
});
</script>
<style scoped>
.notification-enter-active {
  animation: bounce-in 0.5s ease-out;
}
.notification-leave-active {
  /* transition: all 0.5s cubic-bezier(0.075, 0.82, 0.165, 1); */
  animation: bounce-out 0.5s ease-in;
}

@keyframes bounce-in {
  0% {
    transform: translateX(-180px);
    opacity: 20%;
  }

  100% {
    transform: translateX(0px);
    opacity: 100%;
  }
}

@keyframes bounce-out {
  0% {
    transform: translateX(0px);
    opacity: 100%;
  }

  100% {
    transform: translateX(180px);
    opacity: 20%;
  }
}

/* .notification-enter-from {
  transform: translateX(-60px);
} */
</style>
