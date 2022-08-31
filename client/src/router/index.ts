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
import Game from "../views/Game/Game.vue";
import Search from "../views/Game/Search.vue";
import VerifyMailLanding from "../views/VerifyMailLanding.vue";
import CreateCustom from "../views/CreateCustom.vue";
import CustomWaitingRoom from "../views/CustomWaitingRoom.vue";
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
    meta: { requiresAuth: true },
  },
  {
    path: "/profile",
    component: () => import("../views/UserProfile.vue"),
    meta: { requiresAuth: true },
  },
  {
    path: "/profile/:id/match-history",
    component: () => import("../views/MatchHistoryOverview.vue"),
  },
  {
    path: "/profile/:id/achievements",
    component: () => import("../views/Achievements.vue"),
  },
  {
    path: "/test",
    component: () => import("../views/Test.vue"),
  },
  {
    path: "/custom",
    component: CreateCustom,
  },
  {
    path: "/custom/:roomID",
    component: CustomWaitingRoom,
  },
  // END
  {
    path: "/game",
    component: Game,
  },
  {
    path: "/search",
    component: Search,
  },
  {
    path: "/verify",
    component: VerifyMailLanding,
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
