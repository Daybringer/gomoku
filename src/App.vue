<template>
  <navbar id="navbar" :activeIntersection="activeIntersection"></navbar>
  <router-view
    class="min-height-screen-calc "
    @intersectionCrossed="setIntersection"
  />
</template>
<script lang="ts">
import { useStore } from "@/store/store";
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
  beforeMount() {
    const store = useStore();
    if (store.isAuthenticated) store.setBearer(store.token);
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
