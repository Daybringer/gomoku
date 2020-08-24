<template>
  <div>
    <div id="indexSkewedDiv">
      <div class="centered-div">
        <span class="light-text">Let's play</span>
        <span class="bold-text"><br />Gomoku</span>
        <span class="bold-text"><br />Five in a row</span>
        <span class="bold-text"><br />五目並べ</span>
        <span class="bold-text"><br />Fünf in eine Reihe</span>
      </div>
    </div>
    <router-link to="/q/search">
      <svg id="playButton" version="1.1" viewBox="0 0 29.884285 10.03159">
        <g transform="translate(-87.111429,-108.37706)" id="layer1">
          <g transform="translate(108.46804,82.389592)" id="g1614">
            <path
              d="m -15.08448,26.34747 -5.806882,6.00119 2.317171,3.3104 h 12.1594633 8.670275 l 5.806878,-6.00119 -2.317168,-3.3104 h -12.159985 z"
              style="fill:#363636;fill-opacity:1;stroke:#00b3fe;stroke-width:0.72;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.757549"
              id="path1693-6"
            />
            <text
              xml:space="preserve"
              style="font-size:7.71623px;line-height:1.25;font-family:Cantarell;-inkscape-font-specification:Cantarell;fill:#00b3fe;fill-opacity:1;stroke-width:0.192905"
              x="-15.137695"
              y="33.684677"
              id="text1718-5-7"
            >
              <tspan
                id="tspan1716-4-5"
                x="-15.137695"
                y="33.684677"
                style="fill:#00b3fe;fill-opacity:1;stroke-width:0.192905"
              >
                PLAY
              </tspan>
            </text>
          </g>
        </g>
      </svg>
    </router-link>
    <div class="backgroundImgWrapper"></div>
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
  name: "Index",
  components: {},
  data() {
    return {
      colorMain: "#00b3fe",
    };
  },
  methods: {
    resizeSkew() {
      let mDiv = document.getElementById("indexSkewedDiv");
      let navHeight = document.getElementById("smallNav").clientHeight;
      mDiv.style.top =
        (mDiv.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) +
        navHeight +
        "px";
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
#indexSkewedDiv {
  background-color: #8f8f8f;
  width: 100%;
  height: 20vh;
  transform: skewY(-7.5deg);
  position: absolute;
  text-align: center;
  margin-top: -1px;
}
#playButton {
  position: absolute;
  width: 50%;
  left: 50%;
  bottom: 30%;
  transform: translate(-50%, -30%);
  user-select: none;
}
.backgroundImgWrapper {
  height: 100vh;
  width: 100%;
  top: 0;
  z-index: -1;
  position: absolute;
  background-image: url("../static/lowResBack.png");
  opacity: 0.4;
}
.centered-div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 100%;
  height: 100%;
}
.bold-text {
  font-style: normal;
  font-weight: 700;
  font-size: 2rem;
  color: #363636;
  animation: fadeIn ease 12s infinite;
  -webkit-animation: fadeIn ease 12s infinite;
  -moz-animation: fadeIn ease 12s infinite;
  -o-animation: fadeIn ease 12s infinite;
  -ms-animation: fadeIn ease 12s infinite;
  white-space: nowrap;
  overflow: hidden;
  opacity: 0;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}

.bold-text:nth-child(2) {
  animation-delay: 3s;
}
.bold-text:nth-child(3) {
  animation-delay: 6s;
}
.bold-text:nth-child(4) {
  animation-delay: 9s;
}

@keyframes fadeIn {
  0% {
    opacity: 0;
    display: inline;
  }
  5% {
    opacity: 1;
    display: inline;
  }
  20% {
    opacity: 1;
    display: inline;
  }
  25% {
    opacity: 0;
    display: none;
  }
}
.light-text {
  white-space: nowrap;
  font-weight: 400;
  font-size: 2rem;
  color: #363636;
  position: absolute;
  left: 50%;
  top: 3vh;
  transform: translate(-50%, 0);
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
