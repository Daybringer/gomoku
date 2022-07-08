<template>
  <div class="">
    <button
      @click="
        () => {
          modalActive = true;
        }
      "
      class="w-16 h-16 mt-1 border-4 border-gomoku-black hover:bg-opacity-80 flex justify-center items-center"
      :style="`background-color:${currentColor};`"
    >
      <SVGColorPickerIcon
        class="w-11 h-11 stroke-current text-gray-50 opacity-50"
      />
    </button>
    <base-modal
      :isActive="modalActive"
      @closeModal="
        () => {
          modalActive = false;
        }
      "
    >
      <div>text</div>
    </base-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
//Components
import BaseModal from "@/components/BaseModal.vue";
import SVGColorPickerIcon from "@/components/SVGColorPickerIcon.vue";
export default defineComponent({
  name: "ProfilePickColorButton",
  props: {
    currentColor: String,
    isMyColor: Boolean,
  },
  components: {
    BaseModal,
    SVGColorPickerIcon,
  },
  data(): { modalActive: boolean; newColor: string } {
    return {
      modalActive: false,
      newColor: "",
    };
  },
  computed: {},
  methods: {
    setColor(): void {
      this.$emit("setColor", this.isMyColor, this.newColor);
    },
  },
  mounted() {},
});
</script>
<style scoped></style>
