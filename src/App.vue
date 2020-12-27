<template>
  <navbar id="navbar" :activeIntersection="activeIntersection"></navbar>
  <router-view
    class="min-height-screen-calc"
    @intersectionCrossed="setIntersection"
  />
</template>
<script lang="ts">
import { defineComponent } from "vue";
import Navbar from "@/components/Navbar.vue";
export default defineComponent({
  name: "App",
  components: { Navbar },
  data() {
    return {
      activeIntersection: "",
    };
  },
  methods: {
    setIntersection(intersectionName: string): void {
      this.activeIntersection = intersectionName;
    },
  },
});
</script>
<style>
@tailwind base;
@tailwind components;
@tailwind utilities;

.min-height-screen-calc {
  min-height: calc(100vh - 4rem);
}

.input-text {
  @apply mt-2;
  @apply py-1;
  @apply px-2;
  @apply rounded-md;
  @apply block;
  @apply border-2;
  @apply border-gray-300;
  @apply border-opacity-50;
  @apply shadow-sm;
  @apply text-xl;
  @apply text-gray-900;
}
.input-text:focus {
  @apply outline-none;
  @apply border-gomoku-blue;
  @apply ring-gomoku-blue;
  @apply ring-1;
}

html,
body {
  margin: 0;
  padding: 0;
  font-family: "Fira Sans", sans-serif;
  box-sizing: border-box;
  scroll-behavior: smooth;
  -webkit-tap-highlight-color: rgba(0, 0, 0, 0);
  -webkit-tap-highlight-color: transparent;
}

a {
  text-decoration: none !important;
}
a:active {
  outline: none !important;
}
</style>
