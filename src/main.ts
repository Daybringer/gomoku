import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

const app = createApp(App);

// @ts-ignore
import GAuth from "vue3-google-oauth2";

const GAuthOptions = {
  clientId:
    "1064130338503-0g3bbnb9i03s10mb1douod4oes4kp0th.apps.googleusercontent.com",
  scope: "email openid",
  prompt: "consent",
  fetch_basic_profile: false,
};

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

app
  .use(router)
  .use(GAuth, GAuthOptions)
  .mount("#vue-app");
