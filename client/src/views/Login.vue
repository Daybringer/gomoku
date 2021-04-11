<template>
  <div
    class="flex justify-center place-items-center bg-gray-100 dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-lg w-full md:p-8 p-4  space-y-8 rounded-lg border-gray-50 bg-white dark:bg-gray-600 dark:border-transparent border-opacity-30 border-t-1 shadow-2xl border-2"
    >
      <h2
        class="text-center text-gray-900 dark:text-gray-100 font-extrabold text-3xl"
      >
        Sign in
      </h2>
      <hr class="dark:border-gray-500" />
      <status-message
        v-show="showSuccess"
        :type="'success'"
        :text="'Successfully logged in'"
      ></status-message>
      <status-message
        v-show="serverError"
        :type="'error'"
        :text="serverError"
      ></status-message>
      <form @submit.prevent="login" class="flex flex-col p-2 pb-0">
        <label
          for="usernameOrEmail"
          class="text-gray-900 dark:text-gray-100  text-lg"
          >Username or Email</label
        >
        <input-base
          v-model="user.usernameOrEmail"
          :name="'usernameOrEmail'"
          :type="'text'"
          :autocomplete="'username'"
          :title="'Enter email or username'"
          :error="errors.usernameOrEmail"
          @blur="validate('usernameOrEmail')"
        />
        <label
          for="password"
          class="mt-8 text-gray-900 dark:text-gray-100 text-lg"
          >Password</label
        >
        <input-base
          v-model="user.password"
          :name="'password'"
          :type="'password'"
          :autocomplete="'password'"
          :title="'Enter password'"
          :error="errors.password"
          @blur="validate('password')"
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
        class="separator mt-2 flex items-center text-center leading-5 text-gray-700 dark:text-gray-200"
      >
        Or continue with
      </div>
      <div class=" flex flex-row justify-around">
        <social-sign-in @click="googleLogin" :type="'google'"></social-sign-in>
        <social-sign-in :type="'facebook'"></social-sign-in>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Components
import SubmitButton from "@/components/form/SubmitButton.vue";
import InputBase from "@/components/form/InputBase.vue";
import SocialSignIn from "@/components/form/SocialSignIn.vue";
import StatusMessage from "@/components/form/StatusMessage.vue";

// Pinia store
import { useStore } from "@/store/store";

// yup validation
import { object, string } from "yup";
const loginFormSchema = object().shape({
  usernameOrEmail: string().required("Field is required"),
  password: string().required("Password is required"),
});

// Utility
import { defineComponent } from "vue";
import { AxiosResponse } from "axios";

export default defineComponent({
  name: "Login",
  components: { SocialSignIn, InputBase, SubmitButton, StatusMessage },
  data() {
    return {
      user: {
        usernameOrEmail: "",
        password: "",
      },
      errors: {
        usernameOrEmail: "",
        password: "",
      },
      showSuccess: false,
      serverError: "",
    };
  },
  methods: {
    login() {
      this.validate("usernameOrEmail");
      this.validate("password");

      if (!this.errors.usernameOrEmail && !this.errors.password) {
        const store = useStore();
        store
          .login(this.user.usernameOrEmail, this.user.password)
          .then(() => {
            this.serverError = "";
            this.showSuccess = true;
          })
          .catch((err) => {
            this.serverError = err;
          });
      }
    },
    async googleLogin() {
      const store = useStore();
      // @ts-ignore
      await this.$gAuth
        .signIn()
        .then((res: any) => {
          return store.googleLogin(res.getAuthResponse().id_token);
        })
        .then((askForUsername: boolean) => {
          if (askForUsername) {
            this.serverError = "";
            this.showSuccess = true;
          } else {
            this.$router.push("/set-username");
          }
        })
        .catch((err: string) => (this.serverError = err));
    },
    validate(field: "usernameOrEmail" | "password") {
      loginFormSchema
        .validateAt(field, this.user)
        .then(() => {
          this.errors[field] = "";
        })
        .catch((err) => {
          this.errors[field] = err.message;
        });
    },
  },
});
</script>

<style scoped>
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
