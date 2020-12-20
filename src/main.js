import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import store from "./store";
import axios from "axios";

import { LoaderPlugin } from "vue-google-login";
Vue.use(LoaderPlugin, {
  client_id:
    "1064130338503-0g3bbnb9i03s10mb1douod4oes4kp0th.apps.googleusercontent.com",
});

import "@/assets/css/tailwind.css";

Vue.config.productionTip = true;

new Vue({
  router,
  store,
  created: function() {
    axios.interceptors.response.use(undefined, function(err) {
      return new Promise(function() {
        if (err.status === 401 && err.config && !err.config.__isRetryRequest) {
          // if you ever get an unauthorized, logout the user
          this.$store.dispatch("authLogOut");
          // you can also redirect to /login if needed !
        }
        throw err;
      });
    });
  },
  render: (h) => h(App),
}).$mount("#app");
