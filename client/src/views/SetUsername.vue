<template>
  <div
    class="flex justify-center place-items-center bg-gray-100 dark:bg-gray-700 py-12 px-4 sm:px-6 lg:px-8"
  >
    <div
      class="max-w-lg w-full md:p-8 p-4  space-y-6 rounded-lg border-gray-50 bg-white dark:bg-gray-600 dark:border-transparent border-opacity-30 border-t-1 shadow-2xl border-2"
    >
      <h2
        class="text-center text-gray-900 dark:text-gray-100 font-extrabold text-3xl"
      >
        Set username
      </h2>
      <status-message
        v-show="showSuccess"
        :type="'success'"
        :text="'Successfully changed name'"
      ></status-message>
      <status-message
        v-show="serverError"
        :type="'error'"
        :text="serverError"
      ></status-message>
      <form @submit.prevent="setUsername" class="flex flex-col p-2">
        <input-base
          v-model="user.username"
          :name="'username'"
          :type="'text'"
          :autocomplete="'none'"
          :title="'Set username'"
          :error="errors.username"
          @blur="validate()"
        />
        <submit-button type="submit">Set username</submit-button>
      </form>
    </div>
  </div>
</template>

<script lang="ts">
// Components
import InputBase from "@/components/form/InputBase.vue";
import SubmitButton from "@/components/form/SubmitButton.vue";
import StatusMessage from "@/components/form/StatusMessage.vue";
// Axios repositories
import { RepositoryFactory } from "@/repositories/RepositoryFactory";
const UsersRepository = RepositoryFactory.getUserRepository;
// Pinia store
import { useStore } from "@/store/store";
// yup validation
import { object, string } from "yup";
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
import { defineComponent } from "vue";
import { throttle } from "throttle-debounce";
export default defineComponent({
  name: "SetUsername",
  components: { InputBase, SubmitButton, StatusMessage },
  data() {
    return {
      user: {
        username: "",
      },
      errors: {
        username: "",
      },
      showSuccess: false,
      serverError: "",
    };
  },
  methods: {
    setUsername() {
      const store = useStore();
      if (!this.errors.username && this.user.username) {
        store
          .setUsername(this.user.username)
          .then(() => {
            this.serverError = "";
            this.showSuccess = true;
          })
          .catch((err) => {
            this.showSuccess = false;
            this.serverError = err;
          });
      } else {
        this.showSuccess = false;
        this.serverError = this.errors.username;
      }
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
    throttledFunction: throttle(500, (call) => {
      call();
    }),
    async validate() {
      const field = "username";
      setUsernameSchema
        .validateAt(field, this.user)
        .then(() => {
          this.throttledFunction(this.usernameExists);
        })
        .catch((err) => {
          this.errors[field] = err.message;
        });
    },
  },
});
</script>

<style scoped></style>
