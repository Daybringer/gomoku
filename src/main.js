import Vue from "vue";
import App from "./App.vue";
import router from "./router";
import VueFullPage from "vue-fullpage.js";
import GAuth from "vue-google-oauth2";
const gauthOption = {
  clientId:
    "1064130338503-0g3bbnb9i03s10mb1douod4oes4kp0th.apps.googleusercontent.com",
  scope: "profile email",
  prompt: "select_account",
};
Vue.use(GAuth, gauthOption);
// Vue.use(Vuex)
Vue.use(VueFullPage);

Vue.config.productionTip = true;

new Vue({
  router,
  render: (h) => h(App),
}).$mount("#app");
