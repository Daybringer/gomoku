<template>
  <div
    class="z-30 absolute px-20 pt-8 gap-4 w-full flex flex-col justify-center"
  >
    <button
      @click="this.open = !this.open"
      class="p-1 self-center rounded-full bg-gray-200 hover:bg-gray-300 text-gray-900 z-40 "
    >
      <chevrons-down-icon-svg
        :class="this.open ? '-rotate-180' : 'rotate-0'"
        class="h-8 transition-transform transform duration-300"
      />
    </button>
    <transition name="slidetop">
      <div
        v-if="open"
        class=" flex-1 flex flex-col justify-center gap-4 p-4 rounded-2xl bg-gray-50 dark:bg-gray-700 shadow-md"
      >
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import ChevronsDownIconSvg from "@/assets/svg/ChevronsDownIconSvg.vue";
export default defineComponent({
  name: "",
  props: {},
  components: { ChevronsDownIconSvg },
  data(): { open: boolean } {
    return {
      open: true,
    };
  },
  computed: {},
  methods: {},
  mounted() {},
});
</script>
<style>
.slidetop-enter-active {
  animation: slide-from-top 0.3s ease-out;
}
.slidetop-leave-active {
  animation: slide-to-top 0.5s ease-in;
}
@keyframes slide-from-top {
  0% {
    transform: translateY(-180px);
    opacity: 20%;
  }

  80% {
  }
  100% {
    transform: translateY(0px);
    opacity: 100%;
  }
}

@keyframes slide-to-top {
  0% {
    transform: translateY(0px);
    opacity: 100%;
  }

  80% {
    opacity: 0%;
  }

  100% {
    transform: translateY(-180px);
    opacity: 0%;
  }
}
</style>
