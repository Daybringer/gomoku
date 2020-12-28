<template>
  <h2>Reset password</h2>
  <input-base v-model="inputValue" />
  {{ inputValue }}
</template>

<script lang="ts">
import { defineComponent } from "vue";
import InputBase from "../components/form/InputBase.vue";
export default defineComponent({
  name: "PasswordReset",
  data() {
    return {
      inputValue: "",
    };
  },
  components: {
    InputBase,
  },
});
</script>

<style scoped></style>
