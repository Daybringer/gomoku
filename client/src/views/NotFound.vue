<template>
  <BaseView>
    <Container class="place-items-center flex-none mt-12 gap-4">
      <BaseHighHeadline>Site has not been found</BaseHighHeadline>
      <p class="italic text-xl">Maybe try out other pages</p>
      <BaseButton link="/">Go to home page</BaseButton>
    </Container>
  </BaseView>
</template>

<script setup lang="ts">
import BaseButton from "@/components/BaseButton.vue";
import BaseHighHeadline from "@/components/BaseHighHeadline.vue";
import Container from "@/components/Container.vue";
import BaseView from "@/components/BaseView.vue";
import router from "@/router";
</script>
