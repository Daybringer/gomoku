<template>
  <div :class="type === 'section' ? 'sectionBody' : 'subsectionBody'">
    <button
      class="relative flex-row w-full flex text-gray-200 items-center justify-between h-10 cursor-pointer outline-none focus:text-gray-500 focus:outline-none"
      @click="toggleExpand(toggleTarget)"
    >
      <h3 :class="type === 'section' ? 'sectionHeading' : 'subsectionHeading'">
        {{ targetHeading }}
      </h3>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        class="icon icon-tabler icon-tabler-chevrons-down stroke-current h-full transform transition-transform ease-in duration-100"
        :class="!toggleTarget.toggled ? '-rotate-90 ' : 'rotate-0'"
        viewBox="0 0 24 24"
        stroke-width="1.5"
        fill="none"
        stroke-linecap="round"
        stroke-linejoin="round"
      >
        <path stroke="none" d="M0 0h24v24H0z" fill="none" />
        <polyline points="7 7 12 12 17 7" />
        <polyline points="7 13 12 18 17 13" />
      </svg>
    </button>
    <transition name="slide">
      <div v-show="toggleTarget.toggled">
        <slot></slot>
      </div>
    </transition>
  </div>
</template>

<script>
export default {
  name: "RuleSection",
  props: ["toggleTarget", "targetHeading", "type"],
  methods: {
    toggleExpand(toExpand) {
      toExpand.toggled = !toExpand.toggled;
    },
  },
};
</script>
<style>
.sectionBody {
  @apply p-2;
  @apply pl-3;
  @apply rounded-md;
  @apply bg-gray-700;
}
.subsectionBody {
  @apply flex-1;
  @apply bg-gray-800;
  @apply my-4;
  @apply rounded-md;
  @apply p-3;
  @apply py-2;
}

.sectionHeading {
  @apply font-semibold;
  @apply text-lg;
}

.subsectionHeading {
  @apply text-gray-200;
  @apply text-left;
  @apply font-medium;
  @apply text-lg;
}

@screen md {
  .sectionBody {
    @apply p-4;
  }
  .sectionHeading {
    @apply text-2xl;
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
