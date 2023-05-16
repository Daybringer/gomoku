<template>
  <!-- TODO add real achivements, not just question mark -->
  <base-tooltip :content="tooltipText">
    <div class="bg-gray-400 p-1 rounded-lg">
      <questionmark-icon class="text-gray-100" />
    </div>
  </base-tooltip>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// components
import BaseTooltip from "@/components/BaseTooltip.vue";
import QuestionmarkIcon from "@/assets/svg/QuestionmarkIcon.vue";
export default defineComponent({
  name: "",
  props: {},
  components: { BaseTooltip, QuestionmarkIcon },
  data(): { tooltipText: string } {
    return {
      tooltipText: "Achievement locked",
    };
  },
  computed: {},
  methods: {},
});
</script>
<style scoped></style>
