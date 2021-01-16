// Vue router
import {
  createRouter,
  createWebHistory,
  RouteParams,
  RouteRecordRaw,
} from "vue-router";
// Components
import Home from "../views/Home.vue";
import Login from "../views/Login.vue";
import Register from "../views/Register.vue";
import NotFound from "../views/NotFound.vue";
import CasualGame from "../views/Game/CasualGame.vue";
// Pinia
import { useStore } from "@/store/store";

declare module "vue-router" {
  interface RouteMeta {
    // is optional
    isAdmin?: boolean;
    prohibitsAuth?: boolean;
    // must be declared by every route
    requiresAuth?: boolean;
  }
}

const routes: Array<RouteRecordRaw> = [
  {
    path: "/",
    component: Home,
  },
  {
    path: "/login",
    component: Login,
    meta: { prohibitsAuth: true },
  },
  {
    path: "/register",
    component: Register,
    meta: { prohibitsAuth: true },
  },
  {
    path: "/set-username",
    component: () => import("../views/SetUsername.vue"),
    meta: { prohibitsAuth: true },
  },
  {
    path: "/profile",
    component: () => import("../views/UserProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/q/game",
    component: CasualGame,
  },
  {
    path: "/q/search",
    component: () => import("../views/Game/CasualSearch.vue"),
  },
  { path: "/:pathMatch(.*)*", name: "not-found", component: NotFound },
];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes,
  scrollBehavior(to, from, savedPosition) {
    if (to.hash) {
      return {
        el: to.hash,
        // 4rem
        top: 16 * 4,
      };
    }
  },
});

router.beforeEach((to, from) => {
  const store = useStore();

  if (to.meta.requiresAuth && !store.isAuthenticated) {
    return {
      path: "/login",
      // save the location we were at to come back later
      // query: { redirect: to.fullPath },
    };
  }

  if (to.meta.prohibitsAuth && store.isAuthenticated) {
    return from;
  }
});

export default router;
