<template>
  <base-tooltip :content="content">
    <div
      class="bg-gray-600 hover:bg-gray-400 cursor-pointer rounded-full text-gray-200"
    >
      <questionmark-icon class="h-6" />
    </div>
  </base-tooltip>
</template>
<script setup lang="ts">
// components
import BaseTooltip from "@/components/BaseTooltip.vue";
import QuestionmarkIcon from "@/assets/svg/QuestionmarkIcon.vue";
defineProps<{ content: string }>();
</script>
