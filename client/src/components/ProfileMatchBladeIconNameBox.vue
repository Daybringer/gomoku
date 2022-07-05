<template>
  <div
    class="flex flex-row place-items-center bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-50 hover:bg-gray-500 text-gray-900 font-normal gap-1 cursor-pointer rounded-lg py-1 px-3"
  >
    <SVGAnonymIcon v-if="!logged" />
    <rounded-small-user-icon v-if="logged"></rounded-small-user-icon
    ><span>{{ logged ? username : "Guest" }}</span>
  </div>
</template>
<script lang="ts">
import RoundedSmallUserIcon from "@/components/RoundedSmallUserIcon.vue";
import SVGAnonymIcon from "@/components/SVGAnonymIcon.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfileMatchBlade",
  components: { RoundedSmallUserIcon, SVGAnonymIcon },
  props: { username: String, logged: Boolean },
});
</script>
