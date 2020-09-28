<template>
  <!-- <div class="navbar " id="smallNav">
    <div class="bg-gomoku-black w-full h-full rounder-bottom-nav">
      <router-link to="/" @click.native="scrollToTop" class="left-0">
        <img
          src="@/assets/logo.svg"
          class="absolute left-0 h-50 ml-4 transform translate-y-1/2"
        />
      </router-link>
      <tasty-burger-button
        id="hamburger-icon"
        ref="hamburger"
        :type="burgerOptions.buttonType"
        :active="burgerOptions.isActive"
        :size="burgerOptions.size"
        :color="colorMain"
        :active-color="colorMain"
        v-on:toggle="burgerToggle"
      />
      <div id="dropdown-content" :class="currentClass" @click="closeMenu">
        <router-link v-if="!logged" to="/login"
          ><span class="text-gomoku-blue">Log In</span></router-link
        >
        <router-link v-if="logged" to="/dashboard" style="color:#00b3fe"
          >Dashboard</router-link
        >
        <router-link @click.native="scrollToMatches" to="/"
          >Matches</router-link
        >
        <router-link @click.native="scrollToRules" to="/">Rules</router-link>
        <router-link to="/about">About</router-link>
        <a v-if="logged" href="#" @click="logOut">Log Out</a>
      </div>
    </div>
  </div> -->
  <nav
    id="navbar"
    :class="{
      navbarTop: navbarScroledStyle === 'top',
      navbarScrolled: navbarScroledStyle === 'scrolled',
    }"
    class="w-full bg-gray-800 sticky top-0 z-50 "
  >
    <div class="max-w-7xl mx-auto px-2 md:px-6 lg:px-8">
      <div class="relative flex items-center justify-between h-16">
        <div class="absolute inset-y-0 left-0 flex items-center md:hidden">
          <!-- Mobile menu button-->
          <tasty-burger-button
            id="hamburger-icon"
            ref="hamburger"
            style="margin-left:0.5rem;"
            aria-label="Main menu"
            aria-expanded="false"
            :type="burgerOptions.buttonType"
            :active="burgerOptions.isActive"
            :size="burgerOptions.size"
            :color="grey"
            :active-color="grey"
            v-on:toggle="burgerToggle"
          />
        </div>
        <div
          class="flex-1 flex items-center justify-center md:items-stretch md:justify-start"
        >
          <div class="flex-shrink-0">
            <router-link to="/" @click.native="scrollTo('#home')">
              <img
                class="h-6 w-auto align-middle inline sm:h-8"
                src="@/assets/logo.svg"
                alt="Playgomoku logo"
              />
            </router-link>
          </div>
          <div class="hidden md:block md:ml-6">
            <div class="flex">
              <router-link
                to="/q/search"
                :class="activeLink === 'home' ? 'buttonActive' : 'buttonOff'"
                class="ml-4 px-3 py-2 border-2 border-transparent rounded-md text-sm font-semibold leading-5 border-gomoku-blue text-gray-300 hover:bg-gomoku-blue-dark hover:border-gomoku-blue-dark hover:text-gomoku-black focus:shadow-outline focus:outline-none focus:text-white transition duration-150 ease-in-out"
                >Play</router-link
              >
              <router-link
                to="/#matches"
                @click.native="scrollTo('#matches')"
                :class="activeLink === 'matches' ? ' bg-gray-900' : ''"
                class="ml-4 px-3 py-2 border-2 border-transparent rounded-md text-sm font-semibold leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >Matches</router-link
              >
              <router-link
                to="/#rules"
                @click.native="scrollTo('#rules')"
                :class="activeLink === 'rules' ? ' bg-gray-900' : ''"
                class="ml-4 px-3 py-2 border-2 border-transparent rounded-md text-sm font-semibold leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >Rules</router-link
              >
              <router-link
                to="/#origins"
                @click.native="scrollTo('#origins')"
                :class="activeLink === 'origins' ? ' bg-gray-900' : ''"
                class="ml-4 px-3 py-2 border-2 border-transparent rounded-md text-sm font-semibold leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >Origins</router-link
              >
              <router-link
                to="/#contact"
                @click.native="scrollTo('contact')"
                :class="activeLink === 'contact' ? ' bg-gray-900' : ''"
                class="ml-4 px-3 py-2 border-2 border-transparent rounded-md text-sm font-semibold leading-5 text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
                >Contact</router-link
              >
            </div>
          </div>
        </div>
        <div
          class="absolute inset-y-0 right-0 flex items-center pr-2 md:static md:inset-auto md:ml-6 md:pr-0"
        >
          <!-- Profile dropdown -->
          <div class="ml-3 relative">
            <div>
              <button
                v-if="logged"
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
                v-if="!logged"
                class="md:flex hidden px-8 py-2 bg-gomoku-blue hover:bg-gomoku-blue-dark text-white font-bold border-transparent rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
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
                    class="block px-4 py-2 text-sm leading-5 text-gray-700 hover:bg-gray-100 focus:outline-none focus:bg-gray-100 transition duration-150 ease-in-out"
                    role="menuitem"
                    >Settings</a
                  >
                  <a
                    href="#"
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
      class="md:hidden"
      :class="burgerDropdownIsToggled ? 'block' : 'hidden'"
    >
      <div class="px-2 pt-2 pb-3 z-50" id="navbarDropdown">
        <router-link
          to="/login"
          class="inline-block w-auto px-3 py-2 text-base bg-gomoku-blue hover:bg-gomoku-blue-dark text-gray-800 shadow-lg font-bold border-transparent rounded focus:outline-none focus:shadow-outline transition duration-150 ease-in-out"
          >Sign in</router-link
        >
        <router-link
          to="/#matches"
          @click.native="scrollTo('#matches')"
          :class="activeLink === 'matches' ? ' bg-gray-900' : ''"
          class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
          >Matches</router-link
        >
        <router-link
          to="/#rules"
          @click.native="scrollTo('#rules')"
          :class="activeLink === 'rules' ? ' bg-gray-900' : ''"
          class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
          >Rules</router-link
        >
        <router-link
          to="/#origins"
          @click.native="scrollTo('#origins')"
          :class="activeLink === 'origins' ? ' bg-gray-900' : ''"
          class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
          >Origins</router-link
        >
        <router-link
          to="/#contact"
          @click.native="scrollTo('#contact')"
          :class="activeLink === 'contact' ? ' bg-gray-900' : ''"
          class="mt-1 block px-3 py-2 rounded-md text-base font-medium text-gray-300 hover:text-white hover:bg-gray-700 focus:outline-none focus:text-white focus:bg-gray-700 transition duration-150 ease-in-out"
          >Contact</router-link
        >
      </div>
    </div>
  </nav>
</template>

<script>
import debounce from "debounce";
import { TastyBurgerButton } from "vue-tasty-burgers";
import router from "@/router";
export default {
  name: "Navbar",
  props: { logged: Boolean },
  data() {
    return {
      burgerOptions: {
        buttonType: "elastic",
        isActive: this.burgerDropdownIsToggled,
        size: "s",
      },
      burgerDropdownIsToggled: false,
      profileDropdownIsToggled: false,
      colorMain: "#00b3fe",
      grey: "#cbd5e0",
      activeLink: "",
      navbarScroledStyle: "top",
    };
  },
  mounted() {
    this.navbarActiveElChange();
    if (location.pathname === "/") {
      document.addEventListener(
        "scroll",
        debounce(this.navbarActiveElChange, 0)
      );
    }
  },
  destroyed() {
    document.removeEventListener(
      "scroll",
      debounce(this.navbarActiveElChange, 0)
    );
  },
  methods: {
    logOut() {
      window.localStorage.removeItem("jwtToken");
      this.$emit("loggedOut");
    },
    navbarActiveElChange() {
      // TODO Try to change to more dynamic, vue way

      if (location.pathname === "/") {
        // Defining constants of parts of home page

        const navbarHeight = document.getElementById("navbar").clientHeight;
        // const indexOffsetTop =
        //   document.getElementById("home").offsetTop - navbarHeight;
        const matches = document.getElementById("matches");
        const matchesOffsetTop = Math.round(
          matches.offsetTop - navbarHeight + matches.clientHeight / 2
        );
        const rules = document.getElementById("rules");
        const rulesOffsetTop = Math.round(
          rules.offsetTop - navbarHeight + rules.clientHeight / 2
        );
        const origins = document.getElementById("origins");
        const originsOffsetTop = Math.round(
          origins.offsetTop - navbarHeight + origins.clientHeight / 2
        );
        const contact = document.getElementById("contact");
        const contactOffsetTop = Math.round(
          contact.offsetTop - navbarHeight + contact.clientHeight / 2
        );

        const clientTopOffset = Math.round(
          window.pageYOffset + window.innerHeight
        );

        let bottomOfWindow =
          Math.max(
            window.pageYOffset,
            document.documentElement.scrollTop,
            document.body.scrollTop
          ) +
            window.innerHeight >=
          document.documentElement.offsetHeight - contact.clientHeight / 4;
        if (bottomOfWindow === true) {
          this.activeLink = "contact";
        } else if (clientTopOffset >= 0 && clientTopOffset < matchesOffsetTop) {
          this.activeLink = "home";
        } else if (
          clientTopOffset > matchesOffsetTop &&
          clientTopOffset < rulesOffsetTop
        ) {
          this.activeLink = "matches";
        } else if (
          clientTopOffset > rulesOffsetTop &&
          clientTopOffset < originsOffsetTop
        ) {
          this.activeLink = "rules";
        } else if (
          clientTopOffset > originsOffsetTop &&
          clientTopOffset < contactOffsetTop
        ) {
          this.activeLink = "origins";
        }
      } else {
        this.activeLink = "";
        console.log(location);
      }

      if (window.pageYOffset > document.getElementById("navbar").clientHeight) {
        this.navbarScroledStyle = "scrolled";
      } else {
        this.navbarScroledStyle = "top";
      }
    },
    burgerToggle() {
      if (this.burgerDropdownIsToggled === false) {
        this.burgerDropdownIsToggled = true;
      } else {
        this.burgerDropdownIsToggled = false;
      }
    },
    profileToggle() {
      if (this.profileDropdownIsToggled === false) {
        this.profileDropdownIsToggled = true;
      } else {
        this.profileDropdownIsToggled = false;
      }
    },
    routerLinkToLogin() {
      router.push("login");
    },
    scrollTo(hashbang) {
      if (location.pathname === "/") {
        location.hash = hashbang;
        const posFromTop = document.getElementById(hashbang.slice(1)).offsetTop;
        const navbarHeight = document.getElementById("navbar").clientHeight;

        if (window.innerWidth <= 768 && hashbang !== "#home") {
          const dropdownSize = document.getElementById("navbarDropdown")
            .offsetHeight;
          window.scrollTo(0, posFromTop - navbarHeight + dropdownSize);
          console.log(dropdownSize);
        } else {
          window.scrollTo(0, posFromTop - navbarHeight);
          console.log("desktop", window.innerWidth);
        }
      }
    },
  },
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond,
      };
    },
  },
  components: {
    "tasty-burger-button": TastyBurgerButton,
  },
};
</script>

<style scoped>
.buttonActive {
  @apply bg-gomoku-blue;
  @apply text-gomoku-black;
  @apply shadow-lg;
}

.buttonOff {
  @apply border-gomoku-blue;
  @apply border-2;
}
</style>
