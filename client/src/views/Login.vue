<template>
  <BaseView>
    <Container class="xl:mt-8 max-w-lg w-full flex-none">
      <BaseHighHeadline>Sign in</BaseHighHeadline>
      <BaseHRDivider />
      <form @submit.prevent="login" class="flex flex-col p-2 gap-4">
        <BaseInput
          :model-value="user.usernameOrEmail"
          @update:model-value="(e) => (user.usernameOrEmail = e)"
          name="usernameOrEmail"
          type="text"
          label="Username or Email"
          title="Enter email or username"
          :error="errors.usernameOrEmail"
        />
        <BaseInput
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
          <BaseInputCheckbox
            label="Remember me"
            :model-value="rememberMe"
            name="remember"
          />
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
        <div class="flex flex-row justify-around place-items-center">
          <GoogleSignIn />
          <FacebookSignIn />
        </div>
      </form>
    </Container>
  </BaseView>
</template>

<script setup lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
import { useProfileStore } from "@/store/profile";
import { object, string } from "yup";
const loginFormSchema = object().shape({
  usernameOrEmail: string().required("Username or email is required"),
  password: string().required("Password is required"),
});
import { reactive, ref } from "vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import Container from "@/components/Container.vue";
import BaseView from "@/components/BaseView.vue";
import BaseHRDivider from "@/components/BaseHRDivider.vue";
import BaseRouterLink from "@/components/BaseRouterLink.vue";
import BaseHRWithText from "@/components/BaseHRWithText.vue";
import BaseInputCheckbox from "@/components/BaseInputCheckbox.vue";
import GoogleSignIn from "@/components/GoogleSignIn.vue";
import FacebookSignIn from "@/components/FacebookSignIn.vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import router from "@/router";

const user = reactive({
  usernameOrEmail: "",
  password: "",
});

// TODO implement remember me -> so far is just a dummy
const rememberMe = ref(false);

const profileStore = useProfileStore();
const notifications = useNotificationsStore();

const errors = reactive({
  usernameOrEmail: "",
  password: "",
});
function login() {
  validate("usernameOrEmail");
  validate("password");

  if (!errors.usernameOrEmail && !errors.password) {
    profileStore
      .login(user.usernameOrEmail, user.password)
      .then(() => {
        // Handling success log in
        router.push("/");
        notifications.createNotification(
          NotificationType.Success,
          "Successfully logged in"
        );
      })
      .catch(() => {
        // Handling server error
        notifications.createNotification(
          NotificationType.Error,
          "Invalid credentials"
        );
      });
  }
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
