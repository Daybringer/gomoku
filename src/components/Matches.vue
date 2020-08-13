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
        <div class="centered-div">
          <span class="match-text">PRIVATE</span>
        </div>
      </div>
      <div
        style="background-color:#01ffc3;border-top: solid #363636 10px;"
        class="skewMatchBox"
      >
        <div class="centered-div">
          <span class="match-text">RANKED</span>
        </div>
      </div>
      <div
        style="background-color:#ff2079;border-top: solid #363636 10px;"
        class="skewMatchBox"
      >
        <div class="centered-div">
          <span class="match-text">QUICK</span>
        </div>
      </div>
    </div>
    <div class="scroll-hint">
      <svg
        class="scroll-hint-svg"
        id="ead0bypm8o971"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 60 85"
        shape-rendering="geometricPrecision"
        text-rendering="geometricPrecision"
      >
        <g
          id="ead0bypm8o972"
          transform="matrix(1 0 0 1 -57.58752441406250 -88.34347534179688)"
        >
          <g
            id="ead0bypm8o973"
            transform="matrix(10.25780487060547 0 0 10.25780487060547 -731.68450927734364 -1200.55944824218795)"
          >
            <g
              id="ead0bypm8o974_to"
              transform="translate(79.856567,131.739087)"
            >
              <g
                id="ead0bypm8o974"
                style="mix-blend-mode:darken"
                transform="translate(-79.856567,-131.739087)"
              >
                <rect
                  id="ead0bypm8o975"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(-0.70710676908493 -0.70710676908493 0.70710676908493 -0.70710676908493 79.87975977147882 131.97478941968910)"
                  paint-order="markers fill stroke"
                  fill="rgb(0,179,254)"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
                <rect
                  id="ead0bypm8o976"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(0.70710676908493 -0.70710676908493 0.70710676908493 0.70710676908493 77.91676066982212 130.04304443722603)"
                  paint-order="markers fill stroke"
                  fill="rgb(0,179,254)"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
              </g>
            </g>
            <g
              id="ead0bypm8o977_to"
              transform="translate(79.856567,130.370412)"
            >
              <g
                id="ead0bypm8o977"
                transform="translate(-79.856567,-130.370412)"
              >
                <rect
                  id="ead0bypm8o978"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(-0.70710676908493 -0.70710676908493 0.70710676908493 -0.70710676908493 79.87523428815672 130.60611355744837)"
                  paint-order="markers fill stroke"
                  fill="rgb(0,179,254)"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
                <rect
                  id="ead0bypm8o979"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(0.70710676908493 -0.70710676908493 0.70710676908493 0.70710676908493 77.91676066944764 128.66156994289591)"
                  paint-order="markers fill stroke"
                  fill="rgb(0,179,254)"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
              </g>
            </g>
          </g>
        </g>
      </svg>
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
.centered-div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.match-text {
  font-style: italic;
  font-weight: 700;
  font-size: 2.5rem;
  color: #363636;
}
.skewMatchBox {
  width: 100%;
  height: 33%;
  transform: skewY(-7.5deg);
  text-align: center;
}

.scroll-hint-svg {
  height: 10rem;
}

.scroll-hint {
  bottom: 0;
  position: absolute;
  left: 50%;
  transform: translateX(-50%);
}

/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (max-width: 600px) {
  .page-desc {
    text-align: center;
    font-weight: 500;
    color: #2e4052;
    font-size: 2em;
    margin-top: 0rem;
    padding: 0 1rem;
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
}
#ead0bypm8o974_to {
  animation: ead0bypm8o974_to__to 4000ms linear infinite normal forwards;
}
@keyframes ead0bypm8o974_to__to {
  0% {
    transform: translate(79.856567px, 131.739087px);
  }
  12.500000% {
    transform: translate(79.856567px, 131.739087px);
  }
  25% {
    transform: translate(79.856567px, 133.981283px);
  }
  27.500000% {
    transform: translate(79.856567px, 129.204432px);
  }
  37.500000% {
    transform: translate(79.856567px, 130.37px);
  }
  100% {
    transform: translate(79.856567px, 130.37px);
  }
}
#ead0bypm8o974 {
  animation: ead0bypm8o974_c_o 4000ms linear infinite normal forwards;
}
@keyframes ead0bypm8o974_c_o {
  0% {
    opacity: 1;
  }
  12.500000% {
    opacity: 1;
  }
  25% {
    opacity: 0;
  }
  27.250000% {
    opacity: 0;
  }
  27.500000% {
    opacity: 0;
  }
  37.500000% {
    opacity: 1;
  }
  100% {
    opacity: 1;
  }
}
#ead0bypm8o977_to {
  animation: ead0bypm8o977_to__to 4000ms linear infinite normal forwards;
}
@keyframes ead0bypm8o977_to__to {
  0% {
    transform: translate(79.856567px, 130.370412px);
    animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
  }
  12.500000% {
    transform: translate(79.856567px, 131.345279px);
  }
  25% {
    transform: translate(79.856567px, 131.735226px);
  }
  37.500000% {
    transform: translate(79.856567px, 131.74px);
  }
  100% {
    transform: translate(79.856567px, 131.74px);
  }
}
</style>
