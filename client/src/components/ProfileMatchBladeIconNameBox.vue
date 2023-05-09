<template>
  <router-link :to="link">
    <div
      class="flex flex-row  place-items-center justify-start overflow-auto bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-500 dark:text-gray-50 hover:bg-gray-500 text-gray-900 gap-1 cursor-pointer rounded-lg py-1 px-2">
      <SVGAnonymIcon v-if="!logged" />
      <rounded-small-user-icon v-if="logged"></rounded-small-user-icon><span>{{ logged ? username : "Guest" }}</span>
    </div>
  </router-link>
</template>
<script lang="ts">
import RoundedSmallUserIcon from "@/components/RoundedSmallUserIcon.vue";
import SVGAnonymIcon from "@/components/SVGAnonymIcon.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfileMatchBlade",
  components: { RoundedSmallUserIcon, SVGAnonymIcon },
  props: { username: String, logged: Boolean, userID: Number },
  computed: {
    link(): string {
      if (this.logged) {
        return `/profile/${this.userID}`;
      } else {
        return ``;
      }
    },
  },
});
</script>
