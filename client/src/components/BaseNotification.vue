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
<style>
.notification-enter-active {
  animation: notification-in 0.5s ease-out;
}
.notification-leave-active {
  animation: notification-out 0.5s ease-in;
}
@keyframes notification-in {
  0% {
    transform: translateX(-180px);
    opacity: 20%;
  }

  100% {
    transform: translateX(0px);
    opacity: 100%;
  }
}

@keyframes notification-out {
  0% {
    transform: translateX(0px);
    opacity: 100%;
  }

  100% {
    transform: translateX(180px);
    opacity: 20%;
  }
}
</style>
