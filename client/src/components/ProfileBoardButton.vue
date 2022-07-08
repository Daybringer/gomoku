<template>
  <button
    @click="setGameBoard()"
    :class="
      isActive ? 'border-gray-800 dark:border-gray-300 ' : 'border-transparent'
    "
    class="border-4 rounded-md"
  >
    <base-low-headline>{{ headlineText }}</base-low-headline>
    <div class="p-1 ">
      <SVGClassicBoardIcon v-if="type == 'classic'" />
      <SVGModernBoardIcon v-if="type == 'modern'" />
      <SVGStandardBoardIcon v-if="type == 'standard'" />
    </div>
  </button>
</template>
<script lang="ts">
import SVGClassicBoardIcon from "@/components/SVGClassicBoardIcon.vue";
import SVGModernBoardIcon from "@/components/SVGModernBoardIcon.vue";
import SVGStandardBoardIcon from "@/components/SVGStandardBoardIcon.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
  props: { type: String, currentBoard: String },
  components: { SVGClassicBoardIcon, SVGModernBoardIcon, SVGStandardBoardIcon },
  data(): {} {
    return {};
  },
  computed: {
    isActive(): boolean {
      return this.currentBoard == this.type;
    },
    isClassic() {
      return this.type === "classic";
    },
    isModern() {
      return this.type === "modern";
    },
    isStandard() {
      return this.type === "standard";
    },
    headlineText(): string {
      if (this.isClassic) {
        return "Classic";
      } else if (this.isModern) {
        return "Modern";
      } else if (this.isStandard) {
        return "Standard";
      } else {
        return "";
      }
    },
  },
  methods: {
    setGameBoard() {
      if (this.isClassic) {
        this.$emit("setBoard", 1);
      } else if (this.isModern) {
        this.$emit("setBoard", 2);
      } else if (this.isStandard) {
        this.$emit("setBoard", 0);
      }
    },
  },
  mounted() {},
});
</script>
<style scoped></style>
