<template>
  <button
    class="border-2 border-gray-300 border-opacity-50 shadow-md text-gray-500 dark:text-gray-300 dark:hover:text-gomoku-blue hover:text-gomoku-blue hover:border-gomoku-blue focus:text-gomoku-blue dark:focus:text-gomoku-blue  focus:border-gomoku-blue focus:outline-none rounded-lg px-10 py-1"
  >
    <!-- Facebook -->
    <svg
      v-if="type === 'facebook'"
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
    <!-- Google -->
    <svg
      v-if="type === 'google'"
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
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  name: "SocialSignIn",
  props: {
    type: {
      type: String,
      validator(val: string): boolean {
        return ["google", "facebook"].indexOf(val) !== -1;
      }
    }
  }
});
</script>

<style></style>
