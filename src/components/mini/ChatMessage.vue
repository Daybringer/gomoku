<template>
  <div class="w-full">
    <div
      class="border-2 rounded-2xl break-words break-all p-y-2 px-4"
      :class="author === 'me' ? 'float-right' : 'float-left'"
      :style="`border-color:${borderColorHEX};`"
    >
      {{ text }}
    </div>
  </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
  name: "ChatMessage",
  props: {
    text: {
      type: String,
      required: true,
    },
    borderColorHEX: String,
    author: {
      type: String,
      required: true,
      validate: (author: string) => ["me", "opponent"].indexOf(author) !== -1,
    },
    authorNickname: {
      type: String,
    },
  },
  data() {
    return {};
  },
});
</script>
