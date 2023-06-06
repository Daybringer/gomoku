<template>
  <!-- Coin -->
  <div id="coin" :class="isHeads ? 'heads' : 'tails'">
    <!-- heads -->
    <div class="side-a" :style="`background-color:${headsColor};`"></div>
    <!-- tails -->
    <div class="side-b" :style="`background-color:${tailsColor};`"></div>
  </div>
</template>
<script setup lang="ts">
const props = defineProps<{
  headsColor: string;
  tailsColor: string;
  isHeads: boolean;
}>();
</script>
<style scoped>
/* Coinflip styles */
#coin {
  width: 100px;
  height: 100px;
  cursor: default;
}

@media only screen and (min-width: 768px) {
  #coin {
    width: 200px;
    height: 200px;
  }
}

#coin div {
  width: 100%;
  height: 100%;
  -webkit-border-radius: 50%;
  -moz-border-radius: 50%;
  border-radius: 50%;
  -webkit-box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
  -moz-box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
  box-shadow: inset 0 0 45px rgba(255, 255, 255, 0.3),
    0 12px 20px -10px rgba(0, 0, 0, 0.4);
}

#coin {
  transition: -webkit-transform 1s ease-in;
  transform-style: preserve-3d;
  -webkit-transform-style: preserve-3d;
}
#coin div {
  position: absolute;
  backface-visibility: hidden;
  -webkit-backface-visibility: hidden;
}
.side-a {
  z-index: 100;
}
.side-b {
  transform: rotateY(-180deg);
}
#coin.heads {
  -webkit-animation: flipHeads 3s ease-in-out forwards;
  -moz-animation: flipHeads 3s ease-in-out forwards;
  -o-animation: flipHeads 3s ease-in-out forwards;
  animation: flipHeads 3s ease-in-out forwards;
}
#coin.tails {
  -webkit-animation: flipTails 3s ease-in-out forwards;
  -moz-animation: flipTails 3s ease-in-out forwards;
  -o-animation: flipTails 3s ease-in-out forwards;
  animation: flipTails 3s ease-in-out forwards;
}
@keyframes flipHeads {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1800deg);
    -moz-transform: rotateY(1800deg);
    transform: rotateY(1800deg);
  }
}
@keyframes flipTails {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(1980deg);
    -moz-transform: rotateY(1980deg);
    transform: rotateY(1980deg);
  }
}
</style>
