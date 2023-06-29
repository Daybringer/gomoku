<template>
  <div
    @click.self="$emit('closeModal')"
    v-show="isActive"
    class="fixed z-10 top-0 left-0 flex justify-center items-center h-full overflow-y-auto w-full bg-opacity-60 bg-gray-800"
  >
    <transition name="zoom">
      <div
        v-show="isActive"
        class="flex flex-col bg-gray-50 dark:bg-gray-700 relative w-90 xl:w-50 h-80 sm:h-50 p-6 rounded-lg overflow-auto"
      >
        <button
          class="relative z-50 top-0 self-end p-1 m-2 rounded-full border-2 border-gray-400 dark:border-gray-800 bg-gray-300 hover:bg-gray-400 dark:bg-gray-300 text-gray-900 focus:outline-none"
          @click="$emit('closeModal')"
        >
          <cross-icon class="h-6" />
        </button>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script setup lang="ts">
//Components
import CrossIcon from "@/assets/svg/CrossIcon.vue";
defineProps<{ isActive: boolean }>();
defineEmits<{ (e: "closeModal") }>();
</script>
<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.5s ease-out;
}

.zoom-enter-from {
  transform: translateY(-60px);
}
</style>
