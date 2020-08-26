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

Vue.use(VueRouter);

const routes = [
  {
    path: "/",
    name: "index",
    component: Home,
    meta: {
      title: "Gomoku | Online tic-tac-toe",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/example",
    name: "example",
    component: GameBase,
    meta: {
      title: "Gomoku | Online tic-tac-toe",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/login",
    name: "login",
    component: Login,
    meta: {
      title: "Gomoku | Login",
      metaTags: [
        {
          name: "description",
          content: "The login page of our example app.",
        },
        {
          property: "og:description",
          content: "The login page of our example app.",
        },
      ],
    },
  },
  {
    path: "/register",
    name: "register",
    component: Register,
    meta: {
      title: "Gomoku | Register",
      metaTags: [
        {
          name: "description",
          content: "The register page of our example app.",
        },
        {
          property: "og:description",
          content: "The register page of our example app.",
        },
      ],
    },
  },
  {
    path: "/q/search",
    name: "q/search",
    component: CasualSearch,
    meta: {
      title: "Gomoku | Casual game | Search",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/r/search",
    name: "r/search",
    component: RankedSearch,
    meta: {
      title: "Gomoku | Ranked game | Search",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/q/game",
    name: "q/game",
    component: CasualGame,
    meta: {
      title: "Gomoku | Casual game",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/r/game",
    name: "r/game",
    component: RankedGame,
    meta: {
      title: "Gomoku | Ranked game",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/p/game",
    name: "p/game",
    component: PrivateGame,
    meta: {
      title: "Gomoku | Private game",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/private",
    name: "private",
    component: Private,
    meta: {
      title: "Gomoku | Private Matches",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/waiting",
    name: "waiting",
    component: WaitingRoom,
    meta: {
      title: "Gomoku | Waiting Room",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/logout",
    name: "logout",
    component: Logout,
    meta: {
      title: "Gomoku | Logged out",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/settings",
    name: "settings",
    component: Settings,
    meta: {
      title: "Gomoku | Settings",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "/dashboard",
    name: "dashboard",
    component: Dashboard,
    meta: {
      title: "Gomoku | Dashboard",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
  {
    path: "*",
    redirect: "/404",
  },
  {
    path: "/404",
    name: "404",
    component: Missing,
    meta: {
      title: "Gomoku | 404",
      metaTags: [
        {
          name: "description",
          content: "The home page of our example app.",
        },
        {
          property: "og:description",
          content: "The home page of our example app.",
        },
      ],
    },
  },
];

const router = new VueRouter({
  mode: "history",
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach((to, from, next) => {
  document.title = to.meta.title;
  next();
});

export default router;
