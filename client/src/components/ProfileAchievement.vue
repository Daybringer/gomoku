<template>
  <!-- TODO add real achivements, not just question mark -->
  <base-tooltip :content="tooltipText">
    <div class="bg-gray-400 p-1 rounded-lg">
      <question-mark-svg class="h-20 text-gray-100"> </question-mark-svg>
    </div>
  </base-tooltip>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// components
import BaseTooltip from "@/components/BaseTooltip.vue";
import QuestionMarkSvg from "@/assets/svg/QuestionMarkSvg.vue";
export default defineComponent({
  name: "",
  props: {},
  components: { BaseTooltip, QuestionMarkSvg },
  data(): { tooltipText: string } {
    return {
      tooltipText: "Achievment locked",
    };
  },
  computed: {},
  methods: {},
  mounted() {},
});
</script>
<style scoped></style>
