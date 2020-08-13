<template>
  <div style="height:100%;width:100%;">
    <div
      style="position:absolute;top:0;height:75%;width:100%;"
      id="skewedContainer"
    >
      <div
        style="background-color:#defe47;"
        class="skewMatchBox"
        id="firstCont"
      >
        PRIVATE
      </div>
      <div
        style="background-color:#01ffc3;border-top: solid #363636 10px;"
        class="skewMatchBox"
      >
        RANKED
      </div>
      <div
        style="background-color:#ff2079;border-top: solid #363636 5px;"
        class="skewMatchBox"
      >
        QUICK
      </div>
    </div>
  </div>
</template>
<script>
export default {
  name: "Matches",
  components: {},
  props: ["logged"],
  mounted() {
    let firstCont = document.getElementById("firstCont");
    let skewedOberCont = document.getElementById("skewedContainer");
    let navHeight = document.getElementById("smallNav").clientHeight;
    skewedOberCont.style.top =
      (firstCont.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) +
      navHeight +
      "px";

    window.onresize = function() {
      let firstCont = document.getElementById("firstCont");
      let skewedOberCont = document.getElementById("skewedContainer");
      let navHeight = document.getElementById("smallNav").clientHeight;
      skewedOberCont.style.top =
        (firstCont.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) +
        navHeight +
        "px";
    };
  },
};
</script>
<style scoped>
.skewMatchBox {
  width: 100%;
  height: 33%;
  transform: skewY(-7.5deg);
  text-align: center;
}
.scroll-hint-svg {
  height: 5rem;
}

.scroll-hint {
  bottom: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}
</style>
