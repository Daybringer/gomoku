import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

app.directive("click-outside", {
  beforeMount(el, binding, vnode) {
    el.clickOutsideEvent = function(event: any) {
      if (!(el === event.target || el.contains(event.target))) {
        binding.value(event, el);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

app.use(router).mount("#vue-app");
