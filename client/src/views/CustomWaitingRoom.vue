<template>
  <view-base-fixed-height>
    <div class="flex-1 flex flex-col-reverse md:flex-row justify-center ">
      <div class=" flex-1 flex flex-col justify-center">
        <swing-animation-svg class="w-80 md:w-60 self-center md:self-end" />
      </div>
      <div class="flex-1 flex justify-center place-items-center mb-20">
        <div class="flex flex-col gap-1 place-items-center">
          <p
            class="text-5xl text-gray-700 dark:text-current font-light md:mb-2 self-start"
          >
            Room ID:
          </p>
          <div
            class="text-gray-400 dark:text-gray-500 md:text-8xl text-7xl relative"
            style="letter-spacing: 0.5rem;"
          >
            <!--SHADOW -->
            <span>{{ this.$route.params.roomID }}</span>
            <!-- Real text -->
            <span class="absolute -left-1 -top-1 text-gomoku-pink z-0">
              {{ this.$route.params.roomID }}
            </span>
          </div>
          <base-button
            class="text-xl w-full bg-gomoku-blue dark:bg-gomoku-blue text-gray-50 font-medium mt-5"
            @click="copyToClipboard()"
            >Copy link<clipboard-icon-svg class="pl-2 h-6"
          /></base-button>
        </div>
      </div>
    </div>
    <base-notification v-show="notificationShown">{{
      notificationText
    }}</base-notification>
  </view-base-fixed-height>
</template>
<script lang="ts">
import ViewBaseFixedHeight from "@/components/ViewBaseFixedHeight.vue";
import SwingAnimationSvg from "@/assets/svg/SwingAnimationSvg.vue";
import BaseButton from "@/components/BaseButton.vue";
import BaseMidHeadline from "@/components/BaseMidHeadline.vue";
import ClipboardIconSvg from "@/assets/svg/ClipboardIconSvg.vue";
import BaseNotification from "@/components/BaseNotification.vue";
import { defineComponent } from "vue";
export default defineComponent({
  name: "CustomWaitingRoom",
  props: {},
  components: {
    ViewBaseFixedHeight,
    BaseButton,
    SwingAnimationSvg,
    ClipboardIconSvg,
    BaseMidHeadline,
    BaseNotification,
  },
  data(): { notificationText: string; notificationShown: boolean } {
    return {
      notificationText: "Successfully copied to clipboard",
      notificationShown: false,
    };
  },
  computed: {},
  methods: {
    copyToClipboard(): void {
      this.notificationShown = true;
      setTimeout(() => {
        this.notificationShown = false;
      }, 3000);
    },
  },
  mounted() {},
});
</script>
<style scoped></style>
