<template>
  <button
    @click="
      () => {
        modalActive = true;
      }
    "
    class=" border-gray-700 dark:border-gray-400 border-4
    bg-gray-300 hover:bg-gray-400
    dark:hover:bg-gray-500 dark:bg-gray-600
    rounded-xl w-1/3 sm:w-1/4 xl:w-50 cursor-pointer"
  >
    <img src="../assets/samurai_blue.svg" alt="" />
  </button>
  <base-modal
    @closeModal="
      () => {
        modalActive = false;
      }
    "
    :isActive="modalActive"
  ></base-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// components
import BaseModal from "@/components/BaseModal.vue";
export default defineComponent({
  name: "",
  props: {},
  components: { BaseModal },
  data(): { modalActive: boolean } {
    return {
      modalActive: false,
    };
  },
  computed: {},
  methods: {},
  mounted() {},
});
</script>
<style scoped></style>
