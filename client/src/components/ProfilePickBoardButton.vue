<template>
  <button
    @click="setGameBoard()"
    :class="
      isActive ? 'border-gray-800 dark:border-gray-300 ' : 'border-transparent'
    "
    class="border-4 p-1 rounded-md hover:opacity-80"
  >
    <base-low-headline>{{ headlineText }}</base-low-headline>
    <div class="p-1">
      <classic-board-icon class="h-16 md:h-20" v-if="type == 'classic'" />
      <modern-board-icon
        :myColor="myColor"
        :enemyColor="enemyColor"
        class="h-16 md:h-20"
        v-if="type == 'modern'"
      />
      <standard-board-icon
        :myColor="myColor"
        :enemyColor="enemyColor"
        class="h-16 md:h-20"
        v-if="type == 'standard'"
      />
    </div>
  </button>
</template>
<script lang="ts">
import ClassicBoardIcon from "@/assets/svg/ClassicBoardIcon.vue";
import ModernBoardIcon from "@/assets/svg/ModernBoardIcon.vue";
import StandardBoardIcon from "@/assets/svg/StandardBoardIcon.vue";
import BaseLowHeadline from "@/components/BaseLowHeadline.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "",
  props: {
    type: String,
    currentBoard: String,
    myColor: String,
    enemyColor: String,
  },
  components: {
    ClassicBoardIcon,
    ModernBoardIcon,
    StandardBoardIcon,
    BaseLowHeadline,
  },
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
});
</script>
<style scoped></style>
