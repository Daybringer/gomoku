<template>
  <div class="w-full">
    <div
      class="border-2 rounded-lg text-lg break-words break-all px-2"
      :class="author === 'me' ? 'float-right' : 'float-left'"
      :style="`border-color:${borderColor};`"
    >
      {{ text }}
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  text: string;
  borderColor: string;
  author: "me" | "opponent";
}>();
</script>
