<template>
  <div class="">
    <button
      @click="
        () => {
          modalActive = true;
        }
      "
      class="w-16 h-16 md:w-20 md:h-20 mt-1 border-4 border-gomoku-black z-0 flex justify-center items-center"
      :style="`background-color:${currentColor};`"
    >
      <SVGColorPickerIcon
        class="w-12 h-12 stroke-current text-gray-50 opacity-50"
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
      <div class="flex-1 flex flex-col ">
        <base-bold-headline class="md:mt-4">Pick a color</base-bold-headline>
        <div
          class="flex-1 flex flex-row gap-4 flex-wrap place-content-around justify-center"
        >
          <button
            v-for="color in colorList"
            :key="color"
            class="w-16 h-16 md:w-20 md:h-20 border-4 border-gomoku-black hover:opacity-80"
            :style="`background-color:${color};`"
            @click="
              () => {
                setColor(color);
                modalActive = false;
              }
            "
          />
        </div>
      </div>
    </base-modal>
  </div>
</template>
<script lang="ts">
import { defineComponent } from "vue";
//Components
import BaseModal from "@/components/BaseModal.vue";
import SVGColorPickerIcon from "@/components/SVGColorPickerIcon.vue";
import BaseBoldHeadline from "./BaseBoldHeadline.vue";
export default defineComponent({
  name: "ProfilePickColorButton",
  props: {
    currentColor: String,
    isMyColor: Boolean,
  },
  components: {
    BaseModal,
    SVGColorPickerIcon,
    BaseBoldHeadline,
  },
  data(): { modalActive: boolean; newColor: string; colorList: string[] } {
    return {
      modalActive: false,
      newColor: "",
      colorList: [
        "#ff006e",
        "#3a86ff",
        "#44bba4",
        "#ffbf00",
        "#ff822e",
        "#a937c8",
        "#0cce6b",
        "#4a3fd9",
        "#d94a3f",
      ],
    };
  },
  computed: {},
  methods: {
    setColor(newColor: string): void {
      this.$emit("setColor", this.isMyColor, newColor);
    },
  },
  mounted() {},
});
</script>
<style scoped></style>
