<template>
  <div
    class=" flex justify-center place-items-center  bg-gray-100  dark:bg-gray-700  py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-lg w-full md:p-8 p-4  space-y-8 rounded-lg border-gray-50 dark:bg-gray-600 dark:border-transparent  bg-white border-opacity-30 border-t-1 shadow-2xl border-2"
    >
      <h2
        class="text-center text-gray-900 dark:text-gray-200 font-extrabold text-3xl"
      >
        Register
      </h2>
      <hr class="dark:border-gray-500" />
      <form @submit.prevent="register" class="flex flex-col p-2 pb-0">
        <label for="email" class="text-gray-900 dark:text-gray-200 text-lg"
          >Email</label
        >
        <input-base
          v-model="user.email"
          :name="'email'"
          :type="'email'"
          :autocomplete="'email'"
          :title="'Enter email'"
          :error="errors.email"
          @blur="validate('email')"
        />
        <label
          for="username"
          class="text-gray-900 dark:text-gray-200 text-lg mt-2"
          >Username</label
        >
        <input-base
          v-model="user.username"
          :name="'username'"
          :type="'text'"
          :title="'Enter username'"
          :autocomplete="''"
          :error="errors.username"
          @blur="validate('username')"
        />
        <label
          for="password"
          class="mt-4 text-gray-900 dark:text-gray-200 text-lg"
          >Password</label
        >
        <input-base
          v-model="user.password"
          :name="'password'"
          :type="'password'"
          :title="'Enter password'"
          :autocomplete="'new-password'"
          :error="errors.password"
          @blur="validate('password')"
        />
        <label
          for="passwordConfirm"
          class="mt-2 text-gray-900 dark:text-gray-200 text-lg"
          >Confirm password</label
        >
        <input-base
          v-model="user.passwordConfirm"
          :name="'passwordConfirm'"
          :type="'password'"
          :title="'Confirm password'"
          :autocomplete="''"
          :error="errors.passwordConfirm"
          @blur="validate('passwordConfirm')"
        />
        <!-- Sign in button -->
        <submit-button type="submit">Register</submit-button>
        <router-link
          class="text-right mt-3 -mb-3 text-lg text-gomoku-blue hover:text-gomoku-blue-dark focus:text-gomoku-blue-dark focus:outline-none"
          to="/login"
          >Already have an account?</router-link
        >
      </form>
      <div
        class="separator flex items-center text-center leading-5 text-gray-700 dark:text-gray-200"
      >
        Or continue with
      </div>
      <div class="flex flex-row justify-around">
        <social-sign-in @click="googleLogin" :type="'google'"></social-sign-in>
        <social-sign-in :type="'facebook'"></social-sign-in>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
// Utility
import { throttle } from "throttle-debounce";
import { defineComponent } from "vue";

// Components
import SubmitButton from "@/components/form/SubmitButton.vue";
import InputBase from "@/components/form/InputBase.vue";
import SocialSignIn from "@/components/form/SocialSignIn.vue";

// Axios repositories
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;
const AuthRepository = RepositoryFactory.getAuthRepository;

// Pinie store
import { userAuthStore } from "@/store/auth";

// yup validation
import { object, string, ref } from "yup";
const registerFormSchema = object().shape({
  email: string()
    .required("Email is required")
    .email("Invalid email"),
  username: string()
    .required("Username is required")
    .min(3, "Username is too short (3-20)")
    .max(20, "Username is too long (3-20")
    .matches(
      /^[a-z0-9]+$/i,
      "Username can only contain alhpanumeric characters"
    ),
  password: string()
    .required("Password is required")
    .min(4, "Password is too weak")
    .matches(
      /((?=.*\d)|(?=.*\W+))(?=.*[A-Z])(?=.*[a-z]).*$/,
      "Password is too weak \n One uppercase, one lowercase, one number or special character"
    ),
  passwordConfirm: string().oneOf(
    [ref("password"), null],
    "Passwords must match"
  ),
});

export default defineComponent({
  name: "Register",
  components: { InputBase, SocialSignIn, SubmitButton },
  data() {
    return {
      user: {
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
      },
      errors: {
        email: "",
        username: "",
        password: "",
        passwordConfirm: "",
      },
    };
  },
  methods: {
    register() {
      // validate all

      const auth = userAuthStore();
      auth
        .register(this.user)
        .then((res) => {
          console.log("the response", res);
        })
        .catch((err) => console.log("the error", err));
    },
    googleLogin() {
      console.log("here handle google login");
    },
    usernameExists() {
      UsersRepository.userWithUsernameExists(this.user.username)
        .then((res) => {
          if (res.data) {
            this.errors.username = "Username is already taken";
          } else {
            this.errors.username = "";
          }
        })
        .catch(() => (this.errors.username = "Server error"));
    },
    emailExists() {
      UsersRepository.userWithMailExists(this.user.email)
        .then((res) => {
          if (res.data) {
            this.errors.email = "Email is already taken";
          } else {
            this.errors.email = "";
          }
        })
        .catch(() => (this.errors.email = "Server error"));
    },
    throttledFunction: throttle(500, (call) => {
      call();
    }),
    validate(field: "email" | "username" | "password" | "passwordConfirm") {
      registerFormSchema
        .validateAt(field, this.user)
        .then(() => {
          if (field === "email") {
            this.throttledFunction(this.emailExists);
          } else if (field === "username") {
            this.throttledFunction(this.usernameExists);
          } else {
            this.errors[field] = "";
          }
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
