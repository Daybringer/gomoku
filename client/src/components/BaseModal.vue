<template>
  <div
    @click.self="closeModal"
    v-show="isActive"
    class="fixed z-10 top-0 left-0 flex justify-center items-center h-full  w-full bg-opacity-60 bg-gray-800"
  >
    <transition name="zoom">
      <div
        v-show="isActive"
        class="flex flex-col bg-gray-50 dark:bg-gray-400 text-current relative w-90 md:w-50 min-h-50vh p-6 rounded-lg overflow-auto"
      >
        <button
          class="absolute top-3 right-3 p-1 rounded-full bg-gray-300 dark:bg-gray-300 text-gray-900 focus:outline-none"
          @click="closeModal"
        >
          <SVGCloseIcon class="h-6 stroke-current" />
        </button>
        <slot></slot>
      </div>
    </transition>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
//Components
import SVGCloseIcon from "@/components/SVGCloseIcon.vue";
export default defineComponent({
  name: "BaseModal",
  props: {
    isActive: Boolean,
  },
  components: { SVGCloseIcon },
  data(): {} {
    return {};
  },
  computed: {},
  methods: {
    closeModal() {
      this.$emit("closeModal");
    },
  },
  mounted() {},
});
</script>
<style scoped>
.zoom-enter-active,
.zoom-leave-active {
  transition: all 0.5s ease;
}

.zoom-enter-from {
  transform: translateY(-60px);
}
</style>
