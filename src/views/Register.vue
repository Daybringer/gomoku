<template>
  <div
    class="min-height-screen-calc flex-align-center bg-gray-100 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="absolute-center-top-third max-w-lg w-full md:p-8 p-4  space-y-8 rounded-lg border-gray-50  bg-white border-opacity-30 border-t-1 shadow-2xl border-2"
    >
      <h2 class="text-center text-gray-900 font-extrabold text-3xl">
        Register
      </h2>
      <hr />
      <form class="flex flex-col p-2 pb-0">
        <label for="email" class="text-gray-900 text-lg">Email</label>
        <input
          name="email"
          type="email"
          autocomplete="email"
          class="mt-2 py-1 px-2 rounded-md block border-2 border-gray-300 border-opacity-50 shadow-sm text-xl text-gray-900 focus:outline-none focus:border-gomoku-blue focus:ring-gomoku-blue focus:ring-1"
        />
        <label for="username" class="text-gray-900 text-lg mt-2"
          >Username</label
        >
        <input
          name="username"
          type="text"
          autocomplete="username"
          class="mt-2 py-1 px-2 rounded-md block border-2 border-gray-300 border-opacity-50 shadow-sm text-xl text-gray-900 focus:outline-none focus:border-gomoku-blue focus:ring-gomoku-blue focus:ring-1"
        />
        <label for="password" class="mt-4 text-gray-900 text-lg"
          >Password</label
        >
        <input
          name="password"
          type="password"
          autocomplete="new-password"
          class="mt-2 py-1 px-2 rounded-md block border-2 border-gray-300 border-opacity-50 shadow-sm text-lg text-gray-900 focus:outline-none focus:border-gomoku-blue focus:ring-gomoku-blue focus:ring-1"
        />
        <label for="password2" class="mt-2 text-gray-900 text-lg"
          >Confirm password</label
        >
        <input
          name="password2"
          type="password"
          autocomplete="new-password"
          class="mt-2 py-1 px-2 rounded-md block border-2 border-gray-300 border-opacity-50 shadow-sm text-lg text-gray-900 focus:outline-none focus:border-gomoku-blue focus:ring-gomoku-blue focus:ring-1"
        />

        <button
          class="w-full mt-8 py-2 rounded-lg text-gray-50 font-medium text-lg bg-gomoku-blue hover:bg-gomoku-blue-dark focus:bg-gomoku-blue-dark"
          @click.prevent="register"
        >
          Register
        </button>
        <router-link
          class="text-right mt-3 -mb-3 text-gomoku-blue hover:text-gomoku-blue-dark focus:text-gomoku-blue-dark focus:outline-none"
          to="/login"
          >Already have an account?</router-link
        >
      </form>
      <div
        class="separator flex items-center text-center leading-5 text-gray-700"
      >
        Or continue with
      </div>
      <div class="flex flex-row justify-around">
        <button
          class="border-2 border-gray-300 border-opacity-50 shadow-md text-gray-500 hover:text-gomoku-blue hover:border-gomoku-blue focus:text-gomoku-blue  focus:border-gomoku-blue focus:outline-none rounded-lg px-10 py-1"
        >
          <svg
            role="img"
            class="text-current fill-current h-5"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <title>Google login</title>
            <path
              d="M12.24 10.285V14.4h6.806c-.275 1.765-2.056 5.174-6.806 5.174-4.095 0-7.439-3.389-7.439-7.574s3.345-7.574 7.439-7.574c2.33 0 3.891.989 4.785 1.849l3.254-3.138C18.189 1.186 15.479 0 12.24 0c-6.635 0-12 5.365-12 12s5.365 12 12 12c6.926 0 11.52-4.869 11.52-11.726 0-.788-.085-1.39-.189-1.989H12.24z"
            />
          </svg>
        </button>
        <button
          class="border-2 border-gray-300 border-opacity-50 shadow-md text-gray-500 hover:text-gomoku-blue hover:border-gomoku-blue focus:text-gomoku-blue  focus:border-gomoku-blue focus:outline-none rounded-lg px-10 py-1"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            class="text-current fill-current h-7"
            viewBox="0 0 24 24"
            stroke-width="1"
            stroke="current"
            fill="none"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <title>Facebook login</title>
            <path stroke="none" d="M0 0h24v24H0z" fill="none" />
            <path
              d="M7 10v4h3v7h4v-7h3l1 -4h-4v-2a1 1 0 0 1 1 -1h3v-4h-3a5 5 0 0 0 -5 5v2h-3"
            />
          </svg>
        </button>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "Register",
  data() {
    return {
      usernameOrEmail: "",
      password: "",
      password2: "",
    };
  },
  methods: {
    // TODO find what type event has
    register() {
      console.log("register");
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
  @apply border-gray-600;
  @apply border-b-2;
}
.separator::before {
  margin-right: 1em;
}
.separator::after {
  margin-left: 1em;
}
</style>
