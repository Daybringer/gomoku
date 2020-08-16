<template>
  <div>
    <div id="rulesSkewedDiv">
      <div class="centered-div">
        <span class="headline">Rules</span>
      </div>
    </div>
    <div id="skewed-container"></div>
    <footer class="footer">
      <a class="grad-link" href="https://daybringer.github.io/"
        >Michal Vaňata</a
      >
      <p class="footer-text">©2020</p>
    </footer>
  </div>
</template>
<script>
export default {
  name: "Rules",
  components: {},
  methods: {
    resizeSkew() {
      let mDiv = document.getElementById("rulesSkewedDiv");
      let navHeight = document.getElementById("smallNav").clientHeight;
      let rulesContainer = document.getElementById("skewed-container");

      let cornerHeight =
        (mDiv.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180);

      mDiv.style.top = cornerHeight + navHeight + "px";
      rulesContainer.style.top =
        mDiv.offsetHeight + cornerHeight + navHeight + -1 + "px";
    },
  },
  props: ["logged"],
  mounted() {
    this.resizeSkew();
    window.onresize = () => this.resizeSkew();
  },
};
</script>
<style scoped>
#rulesSkewedDiv {
  background-color: #8f8f8f;
  width: 100%;
  height: 15vh;
  transform: skewY(-7.5deg);
  position: absolute;
  text-align: center;
  margin-top: -1px;
}
.centered-div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.headline {
  font-weight: 700;
  font-size: 3rem;
  color: #363636;
  user-select: none;
}
#skewed-container {
  width: 100%;
  height: 60vh;
  position: absolute;
  z-index: 1;
  top: 0;
  transform: skewY(-7.5deg);
  text-align: center;
  background-color: white;
}
.grad-link {
  text-decoration: none;
  position: relative;
  display: inline;
  font-size: 1rem;
  font-weight: 700;
  color: #8f8f8f;
  font-family: "Roboto", sans-serif;
  overflow: hidden;
  background: linear-gradient(to right, #00b3fe, #00b3fe 50%, #8f8f8f 50%);
  background-clip: text;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-size: 200% 100%;
  background-position: 100%;
  transition: background-position 275ms ease;
}
.grad-link:visited {
  color: black;
}
.grad-link:hover {
  background-position: 0 100%;
}
.footer {
  position: absolute;
  bottom: 0;
  text-align: center;
  width: 100%;
  color: #8f8f8f;
  font-size: 1rem;
  font-weight: 700;
  background-color: #363636;
  padding: 0.5rem;
  font-family: "Roboto", sans-serif;
}
.footer-text {
  display: inline;
  position: relative;
  font-size: 1em;
  margin-left: 1rem;
  font-weight: 700;
  color: #8f8f8f;
}
</style>
