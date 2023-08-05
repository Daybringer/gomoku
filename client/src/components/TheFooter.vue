<template>
  <div
    ref="contact"
    id="contact"
    class="w-full bg-gomoku-black text-gray-200 focus:text-gray-500 p-2 flex flex-col gap-2 scroll-margin-navbar"
  >
    <IntersectionObserver @intersect="emit('intersectionCrossed')" />
    <div
      class="flex items-center flex-row justify-items-center justify-center gap-4"
    >
      <a href="https://github.com/Daybringer/gomoku" target="_blank">
        <GithubIcon class="h-8 hover:text-gray-500" />
      </a>
      <a href="https://discord.gg/ASYgt6j" target="_blank">
        <DiscordIcon class="h-8 hover:text-gray-500" />
      </a>
      <a href="https://play.google.com/store/apps" target="_blank">
        <GooglePlayIcon class="h-8 hover:text-gray-500" />
      </a>
    </div>
    <div class="flex justify-items-center justify-center gap-4">
      Contact me: vanata.michal(at)gmail.com
    </div>
    <div class="flex-1 text-center">
      <span
        >Copyright (c) 2020-2023
        <a
          href="https://vanata.dev"
          class="focus:text-gray-600 focus:outline-none hover:text-gray-500"
          target="_blank"
          >Vaňata
        </a>
        <span class="text-sm italic"
          >licensed under
          <a
            href="https://github.com/Daybringer/gomoku/blob/master/LICENSE"
            class="focus:text-gray-600 focus:outline-none not-italic hover:text-gray-500"
            target="_blank"
            >MIT</a
          ></span
        >
      </span>
    </div>
  </div>
</template>
<script setup lang="ts">
import IntersectionObserver from "./IntersectionObserver.vue";
import GithubIcon from "@/assets/svg/GithubIcon.vue";
import DiscordIcon from "@/assets/svg/DiscordIcon.vue";
import GooglePlayIcon from "@/assets/svg/GooglePlayIcon.vue";
const emit = defineEmits<{
  (e: "intersectionCrossed");
}>();
</script>
