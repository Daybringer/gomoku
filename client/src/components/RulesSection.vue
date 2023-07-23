<template>
  <div :class="type === 'section' ? 'sectionBody' : 'subsectionBody'">
    <button
      class="relative flex-row w-full flex text-gray-200 items-center justify-between h-14 cursor-pointer outline-none focus:text-gray-500 focus:outline-none"
      @click="isToggled = !isToggled"
    >
      <p
        :class="
          type === 'section'
            ? 'font-medium text-lg md:text-2xl'
            : 'text-gray-200 text-left font-medium text-xl'
        "
      >
        {{ title }}
      </p>
      <chevrons-down-icon
        class="stroke-current h-full transform transition-transform ease-in duration-100"
        :class="!isToggled ? '-rotate-90 ' : 'rotate-0'"
      />
    </button>
    <transition name="slide">
      <div v-show="isToggled">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script lang="ts" setup>
import ChevronsDownIcon from "@/assets/svg/ChevronsDownIcon.vue";
import { ref } from "vue";
defineProps<{ type: "section" | "subsection"; title: string }>();
const isToggled = ref(false);
</script>
<style scoped>
.sectionBody {
  @apply p-2;
  @apply pl-3;
  @apply rounded-md;
  @apply bg-gray-700;
}
.subsectionBody {
  @apply flex-1;
  @apply bg-gray-900;
  @apply my-4;
  @apply rounded-md;
  @apply p-3;
  @apply py-2;
}
@screen md {
  .sectionBody {
    @apply p-4;
  }
}

.slide-enter-active {
  animation: slide-animation 0.3s ease-in forwards;
}
.slide-leave-active {
  animation: slide-animation 0.3s ease-in forwards reverse;
}

@keyframes slide-animation {
  0% {
    max-height: 0;
    opacity: 0;
  }
  40% {
    opacity: 0;
  }
  100% {
    max-height: 1000px;
    opacity: 1;
  }
}
</style>
