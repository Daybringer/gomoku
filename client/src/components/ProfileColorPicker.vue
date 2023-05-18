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
      <color-picker-icon
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
      <div class="flex-1 flex flex-col">
        <high-headline class="md:mt-4">Pick a color</high-headline>
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
          ></button>
        </div>
      </div>
    </base-modal>
  </div>
</template>
<script setup lang="ts">
//Components
import { defineProps, ref } from "vue";
import BaseModal from "@/components/BaseModal.vue";
import ColorPickerIcon from "@/assets/svg/ColorPickerIcon.vue";
import HighHeadline from "./BaseHighHeadline.vue";
const props = defineProps<{ currentColor: string; isMyColor: boolean }>();
const emits = defineEmits<{
  (e: "setColor", isMyColor: boolean, color: string);
}>();
const modalActive = ref(false);
const colorList = [
  "#ff006e",
  "#3a86ff",
  "#44bba4",
  "#ffbf00",
  "#ff822e",
  "#a937c8",
  "#0cce6b",
  "#4a3fd9",
  "#d94a3f",
];

function setColor(chosenColor: string): void {
  emits("setColor", props.isMyColor, chosenColor);
}
</script>
