<template>
  <div
    class="flex justify-center place-items-center bg-gray-100 dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-lg w-full md:p-8 p-4 space-y-6 rounded-lg border-gray-50 bg-white dark:bg-gray-600 dark:border-transparent border-opacity-30 border-t-1 shadow-2xl border-2"
    >
      <h2
        class="text-center text-gray-900 dark:text-gray-100 font-extrabold text-3xl"
      >
        Set username
      </h2>
      <status-message
        v-show="formData.errors.username"
        :type="'error'"
        :text="formData.errors.username"
      ></status-message>
      <form @submit.prevent="setUsername" class="flex flex-col p-2">
        <input-base
          v-model="formData.user.username"
          :name="'username'"
          :type="'text'"
          :autocomplete="'none'"
          :title="'Set username'"
          :error="formData.errors.username"
          @update:model-value="validate()"
        />
        <submit-button type="submit">Set username</submit-button>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref } from "vue";
// Components
import InputBase from "@/components/FormInputBase.vue";
import SubmitButton from "@/components/FormSubmitButton.vue";
import StatusMessage from "@/components/FormStatusMessage.vue";
// Pinia store
import { useStore } from "@/store/store";
import { NotificationType, useNotificationsStore } from "@/store/notifications";
// yup validation
import { object, string } from "yup";
import { throttle } from "throttle-debounce";
// Axios repositories
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
import { AxiosError } from "axios";
import router from "@/router";
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
const formData = reactive({ user: { username: "" }, errors: { username: "" } });
const serverError = ref("");

async function setUsername() {
  await validate();
  if (!formData.errors.username && formData.user.username) {
    UsersRepository.changeUsername(formData.user.username)
      .then(() => {
        formData.errors.username = "";
        useStore().setUsername(formData.user.username);
        serverError.value = "";
        useNotificationsStore().createNotification(
          NotificationType.Success,
          `Successfully changed username to <b>${formData.user.username}</b>`
        );
        router.push("/");
      })
      .catch((err: AxiosError) => {
        if (err.response) serverError.value = err.response.data.message;
      });
  } else {
    serverError.value = formData.errors.username;
  }
}
async function usernameExists() {
  UsersRepository.userWithUsernameExists(formData.user.username)
    .then((res) => {
      if (res.data) {
        formData.errors.username = "Username is already taken";
      } else {
        formData.errors.username = "";
      }
    })
    .catch(() => (formData.errors.username = "Server error"));
}
const throttledFunction = throttle(400, (call) => {
  call();
});
async function validate() {
  const field = "username";
  setUsernameSchema
    .validateAt(field, formData.user)
    .then(() => {
      throttledFunction(usernameExists);
    })
    .catch((err) => {
      formData.errors[field] = err.message;
    });
}
</script>
