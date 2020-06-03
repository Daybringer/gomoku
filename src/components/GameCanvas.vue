<template>
  <div>
    <canvas id="gameAnimation" width="100" height="100">
      Your browser doesn't support Canvas. To see the animation please update to
      modern browser like Firefox. Tic-Tac-Toe | Five in a row | Gomoku game bot
      vs bot animation
    </canvas>
    <p hidden id="colorMain">{{ colorMain }}</p>
    <p hidden id="colorSecond">{{ colorSecond }}</p>
  </div>
</template>
<script>
export default {
  name: "GameCanvas",
  props: ["colorMain", "colorSecond"]
};
</script>
<style scoped>
#gameAnimation {
  z-index: -1;
  position: absolute;
  bottom: 0;
}
</style>
