<template>
  <div
    class="min-height-screen-calc flex-align-center bg-gray-100 dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="absolute-center-top-third max-w-lg w-full md:p-8 p-4  space-y-8 rounded-lg border-gray-50 bg-white dark:bg-gray-600 dark:border-transparent border-opacity-30 border-t-1 shadow-2xl border-2"
    >
      <h2
        class="text-center text-gray-900 dark:text-gray-100 font-extrabold text-3xl"
      >
        Sign in
      </h2>
      <hr class="dark:border-gray-500" />
      <form @submit.prevent="login" class="flex flex-col p-2 pb-0">
        <label
          for="usernameOrEmail"
          class="text-gray-900 dark:text-gray-100  text-lg"
          >Username or Email</label
        >
        <input-base
          :name="'usernameOrEmail'"
          :type="'text'"
          :autocomplete="'username'"
        />
        <label
          for="password"
          class="mt-8 text-gray-900 dark:text-gray-100 text-lg"
          >Password</label
        >
        <input-base
          :name="'password'"
          :type="'password'"
          :autocomplete="'password'"
        />
        <div class="mt-3 flex flex-row justify-between flex-wrap">
          <!-- Remember me -->
          <div>
            <input
              type="checkbox"
              name="remember"
              class="align-text-top h-4 w-4 text-gomoku-blue  bg-gray-50 rounded cursor-pointer focus:ring-0 focus:shadow-none focus:outline-none"
            />
            <label
              for="remember"
              class="ml-1 pr-3 text-gray-900 dark:text-gray-200"
              >Remember me</label
            >
          </div>
          <!-- Forgot password -->
          <router-link
            class="text-gomoku-blue  hover:text-gomoku-blue-dark focus:text-gomoku-blue-dark focus:outline-none"
            to="/password-reset"
            >Forgot your password?</router-link
          >
        </div>
        <!-- Sign in button -->
        <submit-button type="submit">Sign in</submit-button>
        <!-- Login router link -->
        <router-link
          class="text-right mt-3 -mb-3 text-lg text-gomoku-blue hover:text-gomoku-blue-dark focus:text-gomoku-blue-dark focus:outline-none"
          to="/register"
          >No account yet?</router-link
        >
      </form>
      <div
        class="separator flex items-center text-center leading-5 text-gray-700 dark:text-gray-200 "
      >
        Or continue with
      </div>
      <div class="flex flex-row justify-around">
        <social-sign-in @click="googleLogin" :type="'google'"></social-sign-in
        ><social-sign-in :type="'facebook'"> </social-sign-in>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import SubmitButton from "@/components/form/SubmitButton.vue";
import InputBase from "@/components/form/InputBase.vue";
import SocialSignIn from "@/components/form/SocialSignIn.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "Login",
  components: { SocialSignIn, InputBase, SubmitButton },
  data() {
    return {
      username: "",
      password: "",
    };
  },
  methods: {
    // TODO find what type event has
    login() {
      console.log("login");
    },
    googleLogin() {
      console.log("insert google login logic");
    },
  },
});
</script>

<style scoped>
@media (min-width: 768px) {
  .absolute-center-top-third {
    position: absolute;
    left: 50%;
    margin-top: 4rem;
    top: 10%;
    transform: translate(-50%, 0);
  }
}

@media (max-width: 768px) {
  .flex-align-center {
    display: flex;
    justify-content: center;
    place-items: center;
  }
}

.separator::before,
.separator::after {
  content: "";
  flex: 1;
  @apply border-current;
  @apply border-b-2;
}
.separator::before {
  margin-right: 1em;
}
.separator::after {
  margin-left: 1em;
}
</style>
