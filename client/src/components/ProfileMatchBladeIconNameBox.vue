<template>
  <div
    class="flex flex-row place-items-center bg-gray-300 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-50 hover:bg-gray-500 text-gray-900 font-medium gap-1 cursor-pointer rounded-lg py-1 px-3"
  >
    <rounded-small-user-icon></rounded-small-user-icon
    ><span>{{ logged ? username : "Guest" }}</span>
  </div>
</template>
<script lang="ts">
import RoundedSmallUserIcon from "@/components/RoundedSmallUserIcon.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "ProfileMatchBlade",
  components: { RoundedSmallUserIcon },
  props: { username: String, logged: Boolean },
});
</script>
