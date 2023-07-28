<template>
  <nav id="navbar" class="w-full bg-gray-800 sticky top-0 z-50">
    <div class="max-w-full mx-auto px-2 md:px-6 xl:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center xl:hidden">
          <HamburgerButton
            :isActive="burgerDropdownIsToggled"
            @click="burgerToggle"
          ></HamburgerButton>
        </div>
        <div
          class="flex-1 flex items-center justify-center xl:items-stretch xl:justify-start"
        >
          <div class="flex-shrink-0">
            <RouterLink to="/#home" class="focus:outline-none focus:opacity-75">
              <img
                class="h-6 w-auto align-middle inline sm:h-8 stroke-current hover:opacity-75"
                @click="burgerDropdownIsToggled = false"
                src="@/assets/logo.svg"
                alt="Playgomoku logo"
              />
            </RouterLink>
          </div>
          <div class="hidden xl:block xl:ml-6">
            <div class="flex">
              <NavbarNavigationLink
                :active="activeIntersection === 'home' && isHomePage"
                :to="'/search?type=quick'"
                :type="'primary'"
                >Play</NavbarNavigationLink
              >

              <NavbarNavigationLink
                :active="activeIntersection === 'matches' && isHomePage"
                :to="'/#matches'"
                :type="'secondary'"
                >Matches</NavbarNavigationLink
              >

              <NavbarNavigationLink
                :active="activeIntersection === 'campaign' && isHomePage"
                :to="'/#campaign'"
                :type="'secondary'"
                >Campaign</NavbarNavigationLink
              >

              <NavbarNavigationLink
                :active="activeIntersection === 'rules' && isHomePage"
                :to="'/#rules'"
                :type="'secondary'"
                >Rules</NavbarNavigationLink
              >

              <NavbarNavigationLink
                :active="activeIntersection === 'origins' && isHomePage"
                :to="'/#origins'"
                :type="'secondary'"
                >Origins</NavbarNavigationLink
              >

              <NavbarNavigationLink
                :active="activeIntersection === 'contact' && isHomePage"
                :to="'/#contact'"
                :type="'secondary'"
                >Contact</NavbarNavigationLink
              >
            </div>
          </div>
        </div>
        <button
          class="mx-6 hidden xl:flex items-center cursor-pointer select-none rounded-full ring-opacity-50 focus:ring-4 focus:ring-gomoku-blue focus:outline-none"
          @click="toggleDarkMode"
        >
          <!-- toggle -->
          <div class="relative">
            <!-- input -->
            <input
              id="toogleA"
              type="checkbox"
              v-model="store.darkModeToggled"
              class="hidden"
            />
            <!-- line -->
            <div
              class="toggle__line w-16 bg-gray-300 dark:bg-gray-400 rounded-full shadow-inner"
              style="height: 1.9rem"
            ></div>
            <!-- dot -->
            <div
              class="toggle__dot absolute flex place-items-center justify-items-center w-8 h-8 text-yellow-300 bg-white rounded-full shadow inset-y-0 left-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="flex-1 h-7 fill-current stroke-current"
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
        </button>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 xl:static xl:inset-auto xl:ml-6 xl:pr-0"
        >
          <!-- Profile dropdown -->
          <div class="ml-3 relative" v-click-outside="closeProfile">
            <div>
              <button
                v-show="logged"
                class="flex text-sm border-2 border-transparent rounded-full p-1 bg-gray-100 focus:outline-none focus:border-gomoku-blue transition duration-150 ease-in-out"
                id="user-menu"
                aria-label="User menu"
                aria-haspopup="true"
                @click="profileToggle"
              >
                <ProfileIcon
                  class="h-7"
                  :profile-icon="store.user.settings.selectedIcon"
                />
                <!--Placeholder to prevent box jumping-->
                <div class="h-8 w-8" v-show="!store.userLoaded"></div>
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
            <Transition
              enter-active-class="transition ease-out duration-100 transform"
              enter-class="opacity-0 scale-95"
              enter-to-class="opacity-100 scale-100"
              leave-active-class="transition ease-in duration-75 transform"
              leave-class="opacity-100 scale-100"
              leave-to-class="opacity-0 scale-95"
            >
              <div
                v-show="profileDropdownIsToggled"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg"
              >
                <div
                  class="py-1 rounded-md bg-white shadow-xs"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <a
                    href="#"
                    @click.prevent="pushAndCloseDropdown('/profile')"
                    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    role="menuitem"
                    >Your Profile</a
                  >
                  <a
                    href="#"
                    @click.prevent="logout"
                    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-300 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    role="menuitem"
                    >Sign out</a
                  >
                </div>
              </div>
            </Transition>
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
        <RouterLink
          v-show="!logged"
          to="/login"
          class="inline-block w-auto px-4 py-2 text-base bg-gomoku-blue hover:bg-gomoku-blue-dark text-gray-800 shadow-lg font-semibold border-transparent rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >Sign in</RouterLink
        >
        <MobileNavbarLink
          :to="'/#matches'"
          @click="burgerDropdownIsToggled = false"
          :active="activeIntersection === 'matches' && isHomePage"
          >Matches</MobileNavbarLink
        >
        <MobileNavbarLink
          :to="'/#campaign'"
          @click="burgerDropdownIsToggled = false"
          :active="activeIntersection === 'campaign' && isHomePage"
          >Campaign</MobileNavbarLink
        >
        <MobileNavbarLink
          :to="'/#rules'"
          @click="burgerDropdownIsToggled = false"
          :active="activeIntersection === 'rules' && isHomePage"
          >Rules</MobileNavbarLink
        >
        <MobileNavbarLink
          :to="'/#origins'"
          @click="burgerDropdownIsToggled = false"
          :active="activeIntersection === 'origins' && isHomePage"
          >Origins</MobileNavbarLink
        >
        <MobileNavbarLink
          :to="'/#contact'"
          @click="burgerDropdownIsToggled = false"
          :active="activeIntersection === 'contact' && isHomePage"
          >Contact</MobileNavbarLink
        >

        <button
          class="mx-3 my-2 flex items-center cursor-pointer select-none rounded-full ring-opacity-50 focus:ring-4 focus:ring-gomoku-blue focus:outline-none"
          @click="toggleDarkMode"
        >
          <!-- toggle -->
          <div class="relative">
            <!-- input -->
            <input
              id="toogleA"
              type="checkbox"
              v-model="store.darkModeToggled"
              class="hidden"
            />
            <!-- line -->
            <div
              class="toggle__line w-16 bg-gray-300 dark:bg-gray-400 rounded-full shadow-inner"
              style="height: 1.9rem"
            ></div>
            <!-- dot -->
            <div
              class="toggle__dot absolute flex place-items-center justify-items-center w-8 h-8 text-yellow-300 bg-white rounded-full shadow inset-y-0 left-0"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="flex-1 h-7 fill-current stroke-current"
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
        </button>
      </div>
    </div>
  </nav>
</template>

<script setup lang="ts">
// Components
import HamburgerButton from "@/components/HamburgerButton.vue";
import NavbarNavigationLink from "./NavbarNavigationLink.vue";
import MobileNavbarLink from "./MobileNavbarLink.vue";

// Pinia
import { useStore } from "@/store/store";

// Utility
import { ref, reactive } from "vue";
import router from "@/router";
import { computed } from "@vue/reactivity";
import ProfileIcon from "./ProfileIcon.vue";

defineProps<{ activeIntersection: string }>();

const burgerDropdownIsToggled = ref(false);
const profileDropdownIsToggled = ref(false);
const store = reactive(useStore());
function logout() {
  closeProfile();
  const store = useStore();
  store.logout();
  router.push("/");
}
function pushAndCloseDropdown(path: string) {
  if (profileDropdownIsToggled.value) profileToggle();
  router.push(path);
}
function toggleDarkMode() {
  store.toggleDarkMode();
  if (store.darkModeToggled) {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
}
function burgerToggle() {
  burgerDropdownIsToggled.value = !burgerDropdownIsToggled.value;
}
function profileToggle() {
  profileDropdownIsToggled.value = !profileDropdownIsToggled.value;
}
function routerLinkToLogin() {
  router.push("/login");
}
function closeProfile() {
  if (profileDropdownIsToggled.value) {
    profileToggle();
  }
}
const isHomePage = computed(() => {
  return router.currentRoute.value.path === "/";
});
const logged = computed(() => {
  return store.isAuthenticated;
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
