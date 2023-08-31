<template>
  <ViewBaseResponsive>
    <Container class="xl:mt-8 max-w-lg w-full flex-none">
      <BaseHighHeadline>Sign in</BaseHighHeadline>
      <BaseHRDivider />
      <form @submit.prevent="login" class="flex flex-col p-2 gap-4">
        <input-base
          :model-value="user.usernameOrEmail"
          @update:model-value="(e) => (user.usernameOrEmail = e)"
          name="usernameOrEmail"
          type="text"
          label="Username or Email"
          title="Enter email or username"
          :error="errors.usernameOrEmail"
        />
        <input-base
          :model-value="user.password"
          @update:model-value="(e) => (user.password = e)"
          name="password"
          type="password"
          label="Password"
          title="Enter password"
          :error="errors.password"
        />
        <div class="flex flex-row justify-between flex-wrap">
          <!-- Remember me -->
          <div>
            <input
              type="checkbox"
              name="remember"
              class="align-text-top h-4 w-4 text-gomoku-blue bg-gray-50 rounded cursor-pointer focus:ring-0 focus:shadow-none focus:outline-none"
            />
            <label
              for="remember"
              class="ml-1 pr-3 text-gray-900 dark:text-gray-200"
              >Remember me</label
            >
          </div>
          <!-- Forgot password -->
          <BaseRouterLink to="/password-reset"
            >Forgot your password?</BaseRouterLink
          >
        </div>
        <!-- Sign in button -->
        <BaseButton :gomoku-blue="true" @click="login()">Sign in</BaseButton>
        <!-- Login router link -->
        <BaseRouterLink class="text-right" to="/register"
          >No account yet?</BaseRouterLink
        >
        <BaseHRWithText class="my-4">Or continue with</BaseHRWithText>
        <div class="flex flex-row justify-around">
          <social-sign-in
            @click="googleLogin"
            :type="'google'"
          ></social-sign-in>
          <social-sign-in :disabled="true" :type="'facebook'"></social-sign-in>
        </div>
      </form>
    </Container>
  </ViewBaseResponsive>
</template>

<script setup lang="ts">
import InputBase from "@/components/FormInputBase.vue";
import SocialSignIn from "@/components/FormSocialSignIn.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useStore } from "@/store/store";
import { object, string } from "yup";
const loginFormSchema = object().shape({
  usernameOrEmail: string().required("Username or email is required"),
  password: string().required("Password is required"),
});
import { reactive, ref } from "vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import Container from "@/components/Container.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import BaseHRDivider from "@/components/BaseHRDivider.vue";
import BaseRouterLink from "@/components/BaseRouterLink.vue";
import BaseHRWithText from "@/components/BaseHRWithText.vue";
import router from "@/router";

const user = reactive({
  usernameOrEmail: "",
  password: "",
});
const errors = reactive({
  usernameOrEmail: "",
  password: "",
});
const showSuccess = ref(false);
const serverError = ref("");
function login() {
  validate("usernameOrEmail");
  validate("password");

  if (!errors.usernameOrEmail && errors.password) {
    const store = useStore();
    store
      .login(user.usernameOrEmail, user.password)
      .then(() => {
        serverError.value = "";
        showSuccess.value = true;
      })
      .catch((err) => {
        serverError.value = err;
      });
  }
}
// FIXME Code duplication in Login/Register components
async function googleLogin() {
  const store = useStore();
  // @ts-ignore
  await this.$gAuth
    .signIn()
    .then(async (res: any) => {
      const isNewUser = await store.googleLogin(res.getAuthResponse().id_token);
      if (isNewUser) {
        router.push("/set-username");
      } else {
        router.push("/");
      }
    })
    .catch((err: string) => (serverError.value = err));
}
function validate(field: "usernameOrEmail" | "password") {
  loginFormSchema
    .validateAt(field, user)
    .then(() => {
      errors[field] = "";
    })
    .catch((err) => {
      errors[field] = err.message;
    });
}
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
