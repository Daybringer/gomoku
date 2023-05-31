<template>
  <!-- TODO add real achivements, not just a question mark -->
  <base-tooltip :content="'Achievement locked'">
    <div class="bg-gray-400 p-1 rounded-lg">
      <questionmark-icon class="text-gray-100" />
    </div>
  </base-tooltip>
</template>
<script setup lang="ts">
// Components
import BaseTooltip from "@/components/BaseTooltip.vue";
import QuestionmarkIcon from "@/assets/svg/QuestionmarkIcon.vue";
</script>
