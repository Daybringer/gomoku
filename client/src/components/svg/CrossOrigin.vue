<template>
  <svg
    data-v-69bfb0ac=""
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 7.684 7.684"
    id="svgCrossOrigin"
    class="hidden"
  >
    <g
      data-v-69bfb0ac=""
      transform="rotate(33.203 -466.024 -176.195)"
      :fill="!amIStartingPlayer ? myColor : enemyColor"
      paint-order="markers fill stroke"
    >
      <rect
        data-v-69bfb0ac=""
        transform="rotate(-168.89)"
        ry="0"
        y="277.865"
        x="28.526"
        height="9.29"
        width="1.484"
      ></rect>
      <rect
        data-v-69bfb0ac=""
        transform="rotate(-78.89)"
        ry="0"
        y="-33.912"
        x="281.768"
        height="9.29"
        width="1.484"
      ></rect>
    </g>
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
