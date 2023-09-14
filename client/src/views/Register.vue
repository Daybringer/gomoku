<template>
  <view-base-responsive>
    <Container class="xl:mt-8 max-w-lg w-full flex-none">
      <base-high-headline>Register</base-high-headline>
      <BaseHRDivider />
      <form @submit.prevent="register" class="flex flex-col gap-4 p-2">
        <BaseInput
          :model-value="user.email"
          @update:model-value="(e) => (user.email = e)"
          name="email"
          type="email"
          title="Enter email"
          label="Email"
          :error="errors.email"
          @keyup="validate('email')"
        />
        <BaseInput
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
        <BaseInput
          :model-value="user.password"
          @update:model-value="(n) => (user.password = n)"
          name="password"
          type="password"
          label="Password"
          title="Enter password"
          :error="errors.password"
          @keyup="validate('password')"
        />
        <BaseInput
          :model-value="user.passwordConfirm"
          @update:model-value="(e) => (user.passwordConfirm = e)"
          name="passwordConfirm"
          type="password"
          title="Confirm password"
          label="Confirm password"
          :error="errors.passwordConfirm"
          @keyup="validate('passwordConfirm')"
        />
        <BaseButton :gomoku-blue="true" @click="register()" class="mt-2"
          >Register</BaseButton
        >
        <BaseRouterLink to="/login" class="text-right"
          >Already have an account?</BaseRouterLink
        >
        <BaseHRWithText class="my-4">Or continue with</BaseHRWithText>
        <div class="flex flex-row justify-around place-items-center">
          <GoogleSignIn />
          <FacebookSignIn />
        </div>
      </form>
    </Container>
  </view-base-responsive>
</template>

<script setup lang="ts">
import BaseInput from "@/components/BaseInput.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseHRWithText from "@/components/BaseHRWithText.vue";
import GoogleSignIn from "@/components/GoogleSignIn.vue";
import FacebookSignIn from "@/components/FacebookSignIn.vue";
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;
import { useProfileStore } from "@/store/profile";
import { object, string, ref as refYup } from "yup";
import { reactive, ref } from "vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import Container from "@/components/Container.vue";
import BaseHRDivider from "@/components/BaseHRDivider.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseRouterLink from "@/components/BaseRouterLink.vue";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
import router from "@/router";

const user = reactive({
  email: "",
  username: "",
  password: "",
  passwordConfirm: "",
});
const errors = reactive({
  email: "",
  username: "",
  password: "",
  passwordConfirm: "",
});

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
    .min(6, "Password is too weak"),
  passwordConfirm: string().oneOf(
    [refYup("password"), ""],
    "Passwords must match"
  ),
});

const serverError = ref("");

const notifications = useNotificationsStore();

const profileStore = useProfileStore();

async function register() {
  await validateAll();
  profileStore
    .register(user)
    .then(() => {
      serverError.value = "";
      notifications.createNotification(
        NotificationType.Info,
        "'You've been successfuly registered.\nVerify your email with your email provider."
      );
      router.push("/login");
    })
    .catch(() => {
      notifications.createNotification(
        NotificationType.Error,
        "Error has occured whilst registering"
      );
    });
}
// FIXME fix naming
async function usernameExists() {
  UsersRepository.userWithUsernameExists(user.username)
    .then((res) => {
      if (res.data) {
        errors.username = "Username is already taken";
      } else {
        errors.username = "";
      }
    })
    .catch(() => (errors.username = "Server error"));
}
// FIXME fix naming
async function emailExists() {
  UsersRepository.userWithMailExists(user.email)
    .then((res) => {
      if (res.data) {
        errors.email = "Email is already taken";
      } else {
        errors.email = "";
      }
    })
    .catch(() => (errors.email = "Server error"));
}
async function validate(
  field: "email" | "username" | "password" | "passwordConfirm"
) {
  registerFormSchema
    .validateAt(field, user)
    .then(() => {
      if (field === "email") {
        emailExists();
      } else if (field === "username") {
        usernameExists();
      } else {
        errors[field] = "";
      }
    })
    .catch((err) => {
      errors[field] = err.message;
    });
}

async function validateAll() {
  await Promise.all([
    validate("email"),
    validate("username"),
    validate("password"),
    validate("passwordConfirm"),
  ]);
}
</script>
