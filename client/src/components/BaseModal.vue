<template>
  <div
    @click.self="closeModal"
    v-show="isActive"
    class="fixed z-10 top-0 left-0 flex justify-center items-center h-full overflow-y-auto w-full bg-opacity-60 bg-gray-800"
  >
    <transition name="zoom">
      <div
        v-show="isActive"
        class="flex flex-col bg-gray-50 dark:bg-gray-700 text-current relative w-90 md:w-50 min-h-50vh h-0 p-6 rounded-lg overflow-auto"
      >
        <button
          class="sticky z-50 top-0 self-end w-7 md:w-8 flex items-center justify-center h-8 rounded-full border-2 border-gray-400 dark:border-gray-800 bg-gray-300 hover:bg-gray-400 dark:bg-gray-300 text-gray-900 focus:outline-none"
          @click="closeModal"
        >
          <cross-icon class="h-6" />
        </button>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
//Components
import CrossIcon from "@/assets/svg/CrossIcon.vue";
export default defineComponent({
  name: "BaseModal",
  props: {
    isActive: Boolean,
  },
  components: { CrossIcon },
  computed: {},
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
});
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
