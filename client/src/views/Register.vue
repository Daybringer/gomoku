<template>
  <view-base-responsive>
    <Container class="xl:mt-8 max-w-lg w-full flex-none">
      <base-high-headline>Register</base-high-headline>
      <BaseHRDivider />
      <form @submit.prevent="register" class="flex flex-col gap-3 p-2 pb-0">
        <input-base
          :model-value="user.email"
          @update:model-value="(e) => (user.email = e)"
          name="email"
          type="email"
          title="Enter email"
          label="Email"
          :error="errors.email"
          @keyup="validate('email')"
        />
        <input-base
          :model-value="user.username"
          @update:model-value="(e) => (user.username = e)"
          :name="'username'"
          :type="'text'"
          :title="'Enter username'"
          label="Username"
          :autocomplete="''"
          :error="errors.username"
          @keyup="validate('username')"
        />
        <input-base
          :model-value="user.password"
          :on-update:model-value="(n) => (user.password = n)"
          name="password"
          type="password"
          label="Password"
          title="Enter password"
          :error="errors.password"
          @keyup="validate('password')"
        />
        <input-base
          :model-value="user.passwordConfirm"
          @update:model-value="(e) => (user.passwordConfirm = e)"
          name="passwordConfirm"
          type="password"
          title="Confirm password"
          label="Confirm password"
          :error="errors.passwordConfirm"
          @keyup="validate('passwordConfirm')"
        />
        <BaseButton :gomoku-blue="true" class="mt-4">Register</BaseButton>
        <BaseRouterLink to="/login" class="text-right"
          >Already have an account?</BaseRouterLink
        >
        <BaseHRWithText>Or continue with</BaseHRWithText>
        <div class="mt-8 flex flex-row justify-around">
          <social-sign-in
            @click="googleLogin"
            :type="'google'"
          ></social-sign-in>
          <social-sign-in :type="'facebook'"></social-sign-in>
        </div>
      </form>
    </Container>
  </view-base-responsive>
</template>

<script lang="ts">
// Utility
import { throttle } from "throttle-debounce";
import { defineComponent } from "vue";

// Components
import InputBase from "@/components/FormInputBase.vue";
import SocialSignIn from "@/components/FormSocialSignIn.vue";
import StatusMessage from "@/components/FormStatusMessage.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseHRWithText from "@/components/BaseHRWithText.vue";

// Axios repositories
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;

// Pinia store
import { useStore } from "@/store/store";

// yup validation
import { object, string, ref } from "yup";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import Container from "@/components/Container.vue";
import BaseHRDivider from "@/components/BaseHRDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseRouterLink from "@/components/BaseRouterLink.vue";
const registerFormSchema = object().shape({
  email: string().required("Email is required").email("Invalid email"),
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
  components: {
    InputBase,
    SocialSignIn,
    StatusMessage,
    BaseHighHeadline,
    ViewBaseResponsive,
    Container,
    BaseHRDivider,
    BaseButton,
    BaseRouterLink,
    BaseHRWithText,
  },
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
      serverError: "",
      showSuccess: false,
    };
  },
  methods: {
    async register() {
      await this.validateAll();
      const store = useStore();
      store
        .register(this.user)
        .then(() => {
          this.serverError = "";
          this.showSuccess = true;
        })
        .catch((err) => {
          this.serverError = "Error has occured whilst registering";
          console.log(err);
        });
    },
    async googleLogin() {
      const store = useStore();
      // @ts-ignore
      await this.$gAuth
        .signIn()
        .then(async (res: any) => {
          const isNewUser = await store.googleLogin(
            res.getAuthResponse().id_token
          );
          if (isNewUser) {
            this.$router.push("/set-username");
          } else {
            this.$router.push("/");
          }
        })
        .catch((err: string) => (this.serverError = err));
    },
    async usernameExists() {
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
    async emailExists() {
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
    garbageFunction() {
      console.log(this.$data.user.email);
    },
    async validate(
      field: "email" | "username" | "password" | "passwordConfirm"
    ) {
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
    async validateAll() {
      await Promise.all([
        this.validate("email"),
        this.validate("username"),
        this.validate("password"),
        this.validate("passwordConfirm"),
      ]);
    },
  },
});
</script>

<style scoped></style>
