<template>
  <button
    @click="
      () => {
        modalActive = true;
      }
    "
    class=" border-gray-700 dark:border-gray-400 border-4 p-1 md:p-3
    bg-gray-300 hover:bg-gray-400
    dark:hover:bg-gray-500 dark:bg-gray-600
    rounded-xl w-1/3 sm:w-1/4 xl:w-50 cursor-pointer"
  >
    <img :src="getSvgURL(currentIcon || '')" alt="" />
  </button>
  <base-modal
    @closeModal="
      () => {
        modalActive = false;
      }
    "
    :isActive="modalActive"
  >
    <div
      class="flex-1 flex flex-row gap-4 items-center justify-center flex-wrap"
    >
      <button
        v-for="iconName in Object.values(profileIconList)"
        :key="iconName"
        class=" bg-gray-300 p-2 rounded-lg hover:bg-gray-400"
        :class="
          currentIcon == iconName ? 'border-4 border-gray-800' : 'border-4'
        "
        @click="
          () => {
            this.$emit('setIcon', iconName);
            this.modalActive = false;
          }
        "
      >
        <img class="h-16 md:h-20" :src="getSvgURL(iconName)" alt="" />
      </button>
      <div
        class="h-20 md:h-24 w-20 md:w-24 mx-2 px-8 flex place-items-center justify-center text-center rounded-md "
      >
        <p class=" italic">More coming...</p>
      </div>
    </div>
  </base-modal>
</template>
<script lang="ts">
import { defineComponent } from "vue";
import { ProfileIcon } from "@/shared/icons";

// components
import BaseModal from "@/components/BaseModal.vue";
export default defineComponent({
  name: "",
  props: {
    currentIcon: String,
  },
  components: { BaseModal },
  data(): { modalActive: boolean } {
    return {
      modalActive: false,
    };
  },
  computed: {
    profileIconList(): string[] {
      return Object.values(ProfileIcon);
    },
  },
  methods: {
    getSvgURL(svgName: string) {
      return require(`../assets/svg/profile_icons/${svgName}.svg`);
    },
  },
  mounted() {},
});
</script>
<style scoped></style>
