<template>
  <nav id="navbar" class="w-full bg-gray-800 sticky top-0 z-50 ">
    <div class="max-w-full mx-auto px-2 md:px-6 xl:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center xl:hidden">
          <hamburger-button
            :isActive="burgerDropdownIsToggled"
            @click="burgerToggle"
          ></hamburger-button>
        </div>
        <div
          class="flex-1 flex items-center justify-center xl:items-stretch xl:justify-start"
        >
          <div class="flex-shrink-0">
            <router-link
              to="/#home"
              class="focus:outline-none focus:opacity-75"
            >
              <img
                class="h-6 w-auto align-middle inline sm:h-8 stroke-current  hover:opacity-75"
                src="@/assets/logo.svg"
                alt="Playgomoku logo"
              />
            </router-link>
          </div>
          <div class="hidden xl:block xl:ml-6">
            <div class="flex">
              <navbar-navigation-link
                :active="activeIntersection === 'home' && isHomePage"
                :to="'/q/search'"
                :type="'primary'"
                >Play</navbar-navigation-link
              >

              <navbar-navigation-link
                :active="activeIntersection === 'matches' && isHomePage"
                :to="'/#matches'"
                :type="'secondary'"
                >Matches</navbar-navigation-link
              >

              <navbar-navigation-link
                :active="activeIntersection === 'rules' && isHomePage"
                :to="'/#rules'"
                :type="'secondary'"
                >Rules</navbar-navigation-link
              >

              <navbar-navigation-link
                :active="activeIntersection === 'origins' && isHomePage"
                :to="'/#origins'"
                :type="'secondary'"
                >Origins</navbar-navigation-link
              >

              <navbar-navigation-link
                :active="activeIntersection === 'contact' && isHomePage"
                :to="'/#contact'"
                :type="'secondary'"
                >Contact</navbar-navigation-link
              >
            </div>
          </div>
        </div>
        <label class="px-6 flex items-center cursor-pointer select-none">
          <!-- toggle -->
          <div class="relative">
            <!-- input -->
            <input
              id="toogleA"
              type="checkbox"
              v-model="darkModeToggled"
              class="hidden"
            />
            <!-- line -->
            <div
              class="toggle__line w-16 bg-gray-300 dark:bg-gray-400 rounded-full shadow-inner"
              style="height:1.90rem;"
            ></div>
            <!-- dot -->
            <div
              class="toggle__dot absolute flex place-items-center justify-items-center w-8 h-8 text-yellow-300 bg-white rounded-full shadow inset-y-0 left-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="flex-1 h-7 fill-current  stroke-current"
                viewBox="0 0 24 24"
                stroke-width="0"
                stroke="#000000"
                fill="none"
                stroke-linecap="round"
                stroke-linejoin="round"
              >
                <path stroke="none" d="M0 0h24v24H0z" fill="none" />
                <path
                  d="M12 3c.132 0 .263 0 .393 0a7.5 7.5 0 0 0 7.92 12.446a9 9 0 1 1 -8.313 -12.454z"
                />
              </svg>
            </div>
          </div>
        </label>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 xl:static xl:inset-auto xl:ml-6 xl:pr-0"
        >
          <!-- Profile dropdown -->
          <div class="ml-3 relative" v-click-outside="clickedOutsideProfile">
            <div>
              <button
                v-show="logged"
                class="flex text-sm border-2 border-transparent rounded-full focus:outline-none focus:border-white transition duration-150 ease-in-out"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
                @click="profileToggle"
              >
                <img
                  class="h-8 w-8 rounded-full"
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80"
                  alt=""
                />
              </button>
              <button
                v-show="!logged"
                class="xl:flex hidden px-8 py-2 bg-gomoku-blue hover:bg-gomoku-blue-dark text-white font-bold border-transparent rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
                @click="routerLinkToLogin"
              >
                Sign in
              </button>
            </div>
            <transition
              enter-active-class="transition ease-out duration-100 transform"
              enter-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75 transform"
              leave-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-show="profileDropdownIsToggled"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg
              "
              >
                <div
                  class="py-1 rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <a
                    href="#"
                    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    role="menuitem"
                    >Your Profile</a
                  >
                  <a
                    href="#"
                    @click.prevent="routeToSettings('/settings')"
                    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    role="menuitem"
                    >Settings</a
                  >
                  <a
                    href="#"
                    @click.prevent="logout"
                    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    role="menuitem"
                    >Sign out</a
                  >
                </div>
              </div>
            </transition>
          </div>
        </div>
      </div>
    </div>

    <!--
    Mobile menu, toggle classes based on menu state.

    Menu open: "block", Menu closed: "hidden"
  -->
    <div
      class="xl:hidden"
      :class="burgerDropdownIsToggled ? 'block' : 'hidden'"
    >
      <div class="px-2 pt-2 pb-3 z-50" id="navbarDropdown">
        <router-link
          to="/login"
          class="inline-block w-auto px-4 py-2 text-base bg-gomoku-blue hover:bg-gomoku-blue-dark text-gray-800 shadow-lg font-semibold border-transparent rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >Sign in</router-link
        >
        <mobile-navbar-link
          :to="'/#matches'"
          :active="activeIntersection === 'matches' && isHomePage"
          >Matches</mobile-navbar-link
        >
        <mobile-navbar-link
          :to="'/#rules'"
          :active="activeIntersection === 'rules' && isHomePage"
          >Rules</mobile-navbar-link
        >
        <mobile-navbar-link
          :to="'/#origins'"
          :active="activeIntersection === 'origins' && isHomePage"
          >Origins</mobile-navbar-link
        >
        <mobile-navbar-link
          :to="'/#contact'"
          :active="activeIntersection === 'contact' && isHomePage"
          >Contact</mobile-navbar-link
        >
      </div>
    </div>
  </nav>
</template>

<script lang="ts">
import HamburgerButton from "@/components/mini/HamburgerButton.vue";
import NavbarNavigationLink from "@/components/mini/NavbarNavigationLink.vue";
import MobileNavbarLink from "@/components/mini/MobileNavbarLink.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Navbar",
  props: { activeIntersection: String },
  components: { HamburgerButton, NavbarNavigationLink, MobileNavbarLink },
  data() {
    return {
      burgerDropdownIsToggled: false,
      profileDropdownIsToggled: false,
      activeLink: "",
      navbarScroledStyle: "top",
      isActive: false,
      darkModeToggled: false,
    };
  },
  watch: {
    darkModeToggled() {
      if (this.darkModeToggled) {
        document.querySelector("body")?.classList.add("dark");
      } else {
        document.querySelector("body")?.classList.remove("dark");
      }
    },
  },
  methods: {
    logout() {
      // this.$store
      //   .dispatch("authLogOut")
      //   .then(() => {
      //     if (this.profileDropdownIsToggled) this.profileToggle();
      //     if (this.$router.currentRoute.path != "/") this.$router.push("/");
      //   })
      //   .catch((err) => {
      //     console.log(err);
      //   });
    },
    routeToSettings(path: string) {
      if (this.profileDropdownIsToggled) this.profileToggle();
      this.$router.push(path);
    },
    burgerToggle() {
      this.burgerDropdownIsToggled = !this.burgerDropdownIsToggled;
    },
    profileToggle() {
      this.profileDropdownIsToggled = !this.profileDropdownIsToggled;
    },
    routerLinkToLogin() {
      this.$router.push("/login");
    },
    clickedOutsideProfile() {
      if (this.profileDropdownIsToggled) {
        this.profileToggle();
      }
    },
  },
  computed: {
    isHomePage(): boolean {
      if (this.$router.currentRoute.value.path === "/") return true;
      return false;
    },
    logged(): boolean {
      // return this.$store.getters.isAuthenticated;
      return false;
    },
  },
});
</script>

<style scoped>
.toggle__dot {
  top: -0.05rem;
  transition: all 0.3s ease-in-out;
}

input:checked ~ .toggle__dot {
  transform: translateX(101%) rotate(-130deg);
  @apply text-gray-100;
  @apply bg-gray-700;
}
</style>
