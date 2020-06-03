<template>
  <div id="rulesScript">
    <!-- <h1 class="rule-title">Rules</h1>
    <canvas id="rulesAnimation" width="100" height="100">
      Your browser doesn't support Canvas. To see the animation please update to
      modern browser like Firefox. Tic-Tac-Toe | Five in a row | Gomoku game
      rules animation
    </canvas>
    <button class="button_styleless butt_abs_left" id="arrow_left">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 49.1 44.78"
        style="transform: rotate(90deg);height:10vh;"
      >
        <g :fill="colorMain" paint-order="markers fill stroke">
          <path d="M24.69 44.54l-2.98-2.99 24.4-24.4 2.98 2.98z" />
          <path d="M.06 20.36l2.98-2.98 24.4 24.4-2.98 2.99z" />
          <g>
            <path d="M24.63 27.38l-2.98-2.98L46.05 0l2.98 2.98z" />
            <path d="M0 3.2L2.98.23l24.4 24.4-2.98 2.99z" />
          </g>
        </g>
      </svg>
    </button>
    <button class="button_styleless butt_abs_right" id="arrow_right">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 49.1 44.78"
        style="transform: rotate(-90deg);height: 10vh;"
      >
        <g :fill="colorMain" paint-order="markers fill stroke">
          <path d="M24.69 44.54l-2.98-2.99 24.4-24.4 2.98 2.98z" />
          <path d="M.06 20.36l2.98-2.98 24.4 24.4-2.98 2.99z" />
          <g>
            <path d="M24.63 27.38l-2.98-2.98L46.05 0l2.98 2.98z" />
            <path d="M0 3.2L2.98.23l24.4 24.4-2.98 2.99z" />
          </g>
        </g>
      </svg>
    </button>
    <p id="rule-text" class="lead rule-abs"></p>-->
  </div>
</template>
<script>
export default {
  name: "Rules",
  components: {},
  props: ["logged", "username", "colorMain", "colorSecond"],
  mounted() {
    // let ruleAnim = document.createElement("script");
    // ruleAnim.setAttribute("src", "./scripts/ruleAnim.js");
    // document.getElementById("rulesScript").appendChild(ruleAnim);
  }
};
</script>
<style scoped>
.rule-title {
  position: absolute;
  top: calc(0px + 2rem);
  left: 50%;
  font-size: 5rem;
  color: #2e4052;
  transform: translate(-50%, 0);
}

.rule-abs {
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}

.butt_abs_left {
  position: absolute;
  left: 10%;
  transform: translate(0, -50%);
}
.butt_abs_right {
  position: absolute;
  right: 10%;
  transform: translate(0, -50%);
}

.lead {
  font-size: 2.5em;
  bottom: 10%;
  left: 50%;
  transform: translate(-50%, 60%);
  color: #2e4052;
  text-align: center;
}

.button_styleless {
  background-color: transparent;
  border: none;
  cursor: pointer;
}
.button_styleless::-moz-focus-inner {
  border: 0;
}

#rulesAnimation {
  border: 15px solid #2e4052;
  border-radius: 2rem;
  position: absolute;
  left: 50%;
  transform: translate(-50%, -50%);
}

.rounded {
  border-radius: 15px;
}
</style>
