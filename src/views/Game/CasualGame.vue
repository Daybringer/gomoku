<template>
  <GameBase></GameBase>
</template>
<script lang="ts">
// Components
import GameBase from "@/components/GameBase.vue";
// Utils
import { defineComponent } from "vue";
export default defineComponent({
  name: "CasualGame",
  components: { GameBase },
  data() {
    return {};
  },
});
</script>
