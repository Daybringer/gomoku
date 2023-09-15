<template>
  <BaseView>
    <container class="place-items-center flex-none mt-12 gap-4">
      <base-high-headline>Site has not been found</base-high-headline>
      <p class="italic text-xl">Maybe try out other pages</p>
      <base-button @click="router.push('/')">Go to home page</base-button>
    </container>
  </BaseView>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import Container from "@/components/Container.vue";
import BaseView from "@/components/BaseView.vue";
import router from "@/router";
</script>
