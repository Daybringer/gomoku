import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import { LoaderPlugin } from "vue-google-login";
Vue.use(LoaderPlugin, {
  client_id:
    "1064130338503-0g3bbnb9i03s10mb1douod4oes4kp0th.apps.googleusercontent.com",
});

import "@/assets/css/tailwind.css";

Vue.config.productionTip = true;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
