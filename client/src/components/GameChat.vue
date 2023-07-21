<template>
  <!-- Chat container -->
  <div
    class="min-h-50vh bg-gray-200 dark:bg-gray-500 rounded-lg p-4 flex relative flex-col"
  >
    <!-- Mute Button -->
    <button
      class="absolute p-1 top-0 right-0 rounded-bl-lg hover:bg-red-500 text-white"
      :class="isMuted ? 'bg-red-500' : 'bg-gray-700'"
      @click="isMuted = !isMuted"
    >
      <NoMicrophoneIcon v-show="isMuted" class="h-6 stroke-current" />
      <MicrophoneIcon v-show="!isMuted" class="h-6 stroke-current" />
    </button>
    <!-- Title -->
    <BaseMidHeadline>Chat</BaseMidHeadline>
    <!-- Divider -->
    <BaseHRDivider class="dark:border-gray-700" />
    <!-- Messages container -->
    <div
      id="chatContainer"
      class="flex-grow h-0 flex flex-col p-2 gap-2 overflow-scroll"
      v-show="!isMuted"
      style="scroll-behavior: smooth"
    >
      <GameChatMessageComponent
        v-for="message in messages"
        v-show="!isMuted"
        :text="message.message"
        :author="message.author"
        :key="message.message + message.author"
        :borderColor="message.author === 'me' ? myColor : opponentColor"
      />
    </div>

    <!-- Muted overlay -->
    <div
      v-show="isMuted"
      class="flex-1 flex flex-col justify-center bg-gray-600 rounded-xl"
    >
      <p class="text-center text-gray-100 text-xl">Muted</p>
    </div>
    <!-- Input container -->
    <div
      v-show="!isMuted"
      class="w-full bg-gray-100 dark:bg-gray-700 rounded-md shadow flex flex-col md:flex-row gap-2 p-4"
    >
      <input
        class="h-full bg-transparent placeholder-gray-400 flex-1 p-0 border-0 border-b-2 border-gray-500 dark:border-gray-300 text-gray-900 dark:text-gray-50 text-lg float-left focus:border-gomoku-blue dark:focus:border-gomoku-blue focus:ring-transparent"
        type="text"
        v-model="message"
        placeholder="Write a message"
        @keyup.enter="sendMessage"
      />
      <BaseButton class="md:px-12 py-2" @click="sendMessage">Send</BaseButton>
    </div>
  </div>
</template>
<script setup lang="ts">
import GameChatMessageComponent from "./GameChatMessage.vue";
import NoMicrophoneIcon from "@/assets/svg/NoMicrophoneIcon.vue";
import MicrophoneIcon from "@/assets/svg/MicrophoneIcon.vue";
import { GameChatMessage } from "@/shared/types";
import { ref } from "vue";
import BaseHRDivider from "./BaseHRDivider.vue";
import BaseButton from "./BaseButton.vue";
import BaseMidHeadline from "./BaseMidHeadline.vue";
const message = ref("");
const isMuted = ref(false);
defineProps<{
  messages: GameChatMessage[];
  myColor: string;
  opponentColor: string;
}>();
const emits = defineEmits<{
  (e: "sendMessage", message: string);
}>();
function sendMessage() {
  message.value = message.value.trim();
  if (message.value) {
    emits("sendMessage", message.value);
    message.value = "";
  }
}
</script>
