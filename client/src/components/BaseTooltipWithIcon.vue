<template>
  <base-tooltip :content="content">
    <div
      class="bg-gray-600 hover:bg-gray-400 cursor-pointer rounded-full text-gray-200 "
    >
      <question-mark-svg class="h-6" />
    </div>
  </base-tooltip>
</template>
<script lang="ts">
import { defineComponent } from "vue";
// components
import BaseTooltip from "@/components/BaseTooltip.vue";
import QuestionMarkSvg from "@/assets/svg/QuestionMarkSvg.vue";
export default defineComponent({
  props: { content: String },
  components: { BaseTooltip, QuestionMarkSvg },
  data(): {} {
    return {};
  },
  computed: {},
  methods: {},
  mounted() {},
});
</script>
<style scoped></style>
