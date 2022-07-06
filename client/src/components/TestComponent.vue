<template>
  <div class="h-12">{{ projectName }}</div>
</template>

<script>
import { defineComponent } from "vue";
export default defineComponent({
  props: ["projectName"],
});
</script>
