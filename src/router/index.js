import Vue from "vue";
import VueRouter from "vue-router";
import Home from "../views/Home.vue";
import RankedSearch from "../views/RankedSearch.vue";
import CasualSearch from "../views/CasualSearch.vue";
import PrivateGame from "../views/PrivateGame.vue";
import CasualGame from "../views/CasualGame.vue";
import RankedGame from "../views/RankedGame.vue";
import WaitingRoom from "../views/WaitingRoom.vue";
import Private from "../views/Private.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import Logout from "../views/Logout.vue";
import Settings from "../views/Settings.vue";
import Dashboard from "../views/Dashboard.vue";
import Missing from "../views/404.vue";
import GameBase from "../components/GameBase.vue";

import store from "../store";

const ifAuthenticated = (to, from, next) => {
  if (store.getters.isAuthenticated) {
    console.log(store.getters.isAuthenticated);
    next();
    return;
  }
  next("/login");
};

const ifNotAuthenticated = (to, from, next) => {
  if (!store.getters.isAuthenticated) {
    next();
    return;
  }
  next("/");
};

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Home,
  },
  {
    path: "/example",
    name: "example",
    component: GameBase,
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    beforeEnter: ifNotAuthenticated,
  },
  {
    path: "/q/search",
    name: "q/search",
    component: CasualSearch,
  },
  {
    path: "/r/search",
    name: "r/search",
    component: RankedSearch,
  },
  {
    path: "/q/game",
    name: "q/game",
    component: CasualGame,
  },
  {
    path: "/r/game",
    name: "r/game",
    component: RankedGame,
  },
  {
    path: "/p/game",
    name: "p/game",
    component: PrivateGame,
  },
  {
    path: "/private",
    name: "private",
    component: Private,
  },
  {
    path: "/waiting",
    name: "waiting",
    component: WaitingRoom,
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    beforeEnter: ifAuthenticated,
  },
  {
    path: "*",
    redirect: "/404",
  },
  {
    path: "/404",
    name: "404",
    component: Missing,
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

// router.beforeEach((to, from, next) => {
//   document.title = to.meta.title;
//   next();
// });

export default router;
