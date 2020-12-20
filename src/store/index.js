import Vue from "vue";
import Vuex from "vuex";
import UserModule from "./modules/user";
import AuthModule from "./modules/auth";
Vue.use(Vuex);

const debug = process.env.NODE_ENV !== "production";

export default new Vuex.Store({
  modules: {
    UserModule,
    AuthModule,
  },
  strict: debug,
});
