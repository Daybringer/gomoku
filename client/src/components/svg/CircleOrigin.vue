<template>
  <svg
    data-v-69bfb0ac=""
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 6.8557348 7.1098857"
    id="svgCircleOrigin"
    class="hidden"
  >
    <ellipse
      data-v-69bfb0ac=""
      cx="113.29025"
      cy="147.48361"
      rx="2.984288"
      ry="3.1113634"
      fill="none"
      :stroke="amIStartingPlayer ? myColor : enemyColor"
      stroke-width=".887159"
      stroke-linejoin="round"
      paint-order="markers fill stroke"
      transform="translate(-109.86239 -143.92867)"
    ></ellipse>
  </svg>
</template>

<script lang="ts">
import { defineComponent } from "vue";
export default defineComponent({
  props: {
    amIStartingPlayer: String,
    myColor: String,
    enemyColor: String,
  },
});
</script>
