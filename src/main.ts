import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";

const app = createApp(App);

app.directive("click-outside", {
  mounted: function(el, binding, vnode) {
    el.clickOutsideEvent = function(event: Event) {
      if (!(el == event.target || el.contains(event.target))) {
        // TODO Implement click outside directive
        binding.instance;

        // vnode.context[binding.expression](event);
      }
    };
    document.body.addEventListener("click", el.clickOutsideEvent);
  },
  unmounted: function(el) {
    document.body.removeEventListener("click", el.clickOutsideEvent);
  },
});

app
  .use(store)
  .use(router)
  .mount("#app");
