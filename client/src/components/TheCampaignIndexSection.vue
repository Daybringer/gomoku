<template>
  <BaseView class="min-h-screen bg-gray-200">
    <IntersectionObserver @intersect="$emit('intersect', 'campaign')" />
    <div
      class="flex-1 w-full justify-start place-items-center flex flex-col gap-10 pb-20">
      <BaseHighHeadline> Campaign </BaseHighHeadline>
      <p class="text-center text-xl md:text-2xl">
        Learn basic rules of Gomoku, fight progressively harder AIs and help old
        man in interactive minigame.
      </p>
      <div class="w-full flex flex-row justify-center flex-wrap gap-8 pb-10">
        <BaseSimpleInfoPill> 4 different AIs </BaseSimpleInfoPill>
        <BaseSimpleInfoPill> 12 milestones to conquer</BaseSimpleInfoPill>
        <BaseSimpleInfoPill> Oscarworthy rich story </BaseSimpleInfoPill>
      </div>
      <BaseButton
        link="/campaign#start"
        class="w-full md:w-1/2 text-2xl py-4"
        :gomoku-blue="true"
        >Start Campaign</BaseButton
      >
      <SadManIntroDialog
        class="w-full xl:w-1/2 border-0 shadow-2xl bg-white dark:bg-gray-800 pt-12 mt-12 rounded-2xl text-current fill-current"
        alt="Old man asking for help (Start of campaign)" />
    </div>
  </BaseView>
</template>
<script setup lang="ts">
import IntersectionObserver from "./IntersectionObserver.vue";
import SadManIntroDialog from "@/assets/svg/SadManIntroDialog.vue";
import BaseView from "./BaseView.vue";
import BaseButton from "./BaseButton.vue";
import BaseHighHeadline from "./BaseHighHeadline.vue";
import BaseSimpleInfoPill from "./BaseSimpleInfoPill.vue";
defineEmits<{ (e: "intersect", a: string) }>();
</script>
<style scoped></style>
