<template>
  <ViewBaseResponsive>
    <Container class="xl:mt-8 mt-4 max-w-xl w-full flex-none">
      <BaseHighHeadline class="whitespace-nowrap">
        Set username</BaseHighHeadline
      >
      <form @submit.prevent="setUsername" class="flex flex-col mt-4 gap-4">
        <BaseInput
          :model-value="newUsername"
          @keyup="validate"
          @update:model-value="(e) => (newUsername = e)"
          name="username"
          placeholder="New Username"
          type="text"
          title="Enter New Username"
          :error="newUsernameError"
        />
        <BaseButton @click="setUsername" :gomoku-blue="true">Submit</BaseButton>
      </form>
    </Container>
  </ViewBaseResponsive>
</template>

<script setup lang="ts">
import { ref } from "vue";
import router from "@/router";
// Components
import Container from "@/components/Container.vue";
import ViewBaseResponsive from "@/components/ViewBaseResponsive.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import BaseInput from "@/components/BaseInput.vue";
import BaseButton from "@/components/BaseButton.vue";
// Pinia store
import { useProfileStore } from "@/store/profile";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
// yup validation
import { object, string } from "yup";
import { throttle } from "throttle-debounce";
// Axios repositories
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AxiosError } from "axios";
const UsersRepository = RepositoryFactory.getUserRepository;

const setUsernameSchema = object().shape({
  username: string()
    .required("Username is required")
    .min(3, "Username is too short (3-20)")
    .max(20, "Username is too long (3-20")
    .matches(
      /^[a-z0-9]+$/i,
      "Username can only contain alhpanumeric characters"
    ),
});
// Utility
// const formData = reactive({ user: { username: "" }, errors: { username: "" } });
const newUsername = ref("");
const newUsernameError = ref("");
const notifications = useNotificationsStore();
const profileStore = useProfileStore();

async function setUsername() {
  await validate();
  if (!newUsernameError.value && newUsername.value) {
    UsersRepository.changeUsername(newUsername.value)
      .then(() => {
        profileStore.setUsername(newUsername.value);
        notifications.createNotification(
          NotificationType.Success,
          `Successfully changed username to <b>${newUsername.value}</b>`
        );
        router.push("/");
      })
      .catch((err: AxiosError) => {
        if (err.response)
          notifications.createNotification(
            NotificationType.Error,
            err.response?.data.message
          );
      });
  }
}
async function usernameExists() {
  // UsersRepository.userWithUsernameExists(formData.user.username)
  //   .then((res) => {
  //     if (res.data) {
  //       formData.errors.username = "Username is already taken";
  //     } else {
  //       formData.errors.username = "";
  //     }
  //   })
  //   .catch(() => (formData.errors.username = "Server error"));
}
const throttledFunction = throttle(400, (call) => {
  call();
});
async function validate() {
  setUsernameSchema
    .validate({ username: newUsername.value })
    .then(() => {
      throttledFunction(usernameExists);
      newUsernameError.value = "";
    })
    .catch((err) => {
      newUsernameError.value = err.message;
    });
}
</script>
