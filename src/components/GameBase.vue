<template>
  <div id="container">
    <div class="timeGrid">
      <div class="firstOberGroup">
        <span class="names">{{ enemyName }}</span>
        <div class="firstTimeGroup">
          <span id="firstTimer">{{ enTime || "NaN" }}</span>
          <svg
            xmlns:dc="http://purl.org/dc/elements/1.1/"
            xmlns:cc="http://creativecommons.org/ns#"
            xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
            xmlns:svg="http://www.w3.org/2000/svg"
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 73.872963 32.593925"
            version="1.1"
            id="svg1339"
          >
            <g id="layer1" transform="translate(-70.789472,-135.44732)">
              <g
                id="g2914"
                transform="matrix(3.2491287,0,0,3.2491287,-399.3817,-431.26353)"
              >
                <path
                  id="enStroke"
                  style="fill:#363636;fill-opacity:1;stroke:#ff2079;stroke-width:0.72;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.757549"
                  d="m 147.72001,174.77933 -2.60277,6.00119 2.31717,3.3104 h 12.15946 4.63174 l 2.80329,-6.00119 -2.31717,-3.3104 h -5.11786 z"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
      <div class="secondOberGroup">
        <span class="names">You</span>
        <div class="secondTimeGroup">
          <span id="secondTimer">{{ myTime || "NaN" }}</span>
          <svg
            xmlns:svg="http://www.w3.org/2000/svg"
            viewBox="0 0 77.844025 34.346019"
            version="1.1"
            id="svg1339"
          >
            <g id="layer1" transform="translate(-67.63587,-133.94884)">
              <g
                id="g2959"
                transform="matrix(3.4237863,0,0,3.4237863,-508.52792,-455.09997)"
              >
                <path
                  d="m 171.2958,172.40602 -2.60277,6.00119 2.31717,3.3104 h 12.15946 4.63174 l 2.80329,-6.00119 -2.31717,-3.3104 h -5.11786 z"
                  style="fill:#363636;fill-opacity:1;stroke:#00b3fe;stroke-width:0.72;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.762404"
                  id="myStroke"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div id="gameBundler">
      <div id="gridOverlay"></div>
      <div id="coinOverlay" v-if="gameState === 'preBase'">
        <div id="coin" :class="coinSide">
          <div class="side-a"></div>
          <div class="side-b"></div>
        </div>
      </div>
      <div
        id="winOverlay"
        v-if="
          gameState === 'won' || gameState === 'lost' || gameState === 'left'
        "
      >
        <div class="centeredDiv">
          <h1 id="winText">{{ endText }}</h1>
          <router-link
            to="/q/search"
            id="winButton"
            v-if="typeOfGame !== 'private'"
            >Find new game</router-link
          >
          <router-link
            to="/private"
            id="winButton"
            v-if="typeOfGame === 'private'"
            >Rematch</router-link
          >
        </div>
      </div>
    </div>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 7.684 7.684"
      id="svgCrossOrigin"
    >
      <g
        transform="rotate(33.203 -466.024 -176.195)"
        fill="#ff2079"
        paint-order="markers fill stroke"
      >
        <rect
          transform="rotate(-168.89)"
          ry="0"
          y="277.865"
          x="28.526"
          height="9.29"
          width="1.484"
        />
        <rect
          transform="rotate(-78.89)"
          ry="0"
          y="-33.912"
          x="281.768"
          height="9.29"
          width="1.484"
        />
      </g>
    </svg>
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 6.8557348 7.1098857"
      id="svgCircleOrigin"
    >
      <ellipse
        cx="113.29025"
        cy="147.48361"
        rx="2.984288"
        ry="3.1113634"
        fill="none"
        stroke="#00b3fe"
        stroke-width=".887159"
        stroke-linejoin="round"
        paint-order="markers fill stroke"
        transform="translate(-109.86239 -143.92867)"
      />
    </svg>
  </div>
</template>
<script>
export default {
  name: "GameBase",
  components: {},
  data() {
    return {
      round: 0,
      lastPosition: 0,
    };
  },
  computed: {
    endText() {
      switch (this.gameState) {
        case "won":
          return "You've won";
        case "lost":
          return "You've lost";
        case "left":
          return "Opponent's left the game.";
        default:
          return "Error";
      }
    },
  },
  props: [
    "logged",
    "username",
    "colorMain",
    "colorSecond",
    "typeOfGame",
    "gameState",
    "myTime",
    "enTime",
    "enemyName",
    "coinSide",
  ],
  methods: {
    resizeSkew() {
      let mDiv = document.getElementById("container");
      let navHeight = document.getElementById("smallNav").clientHeight;
      let viewHeight = Math.max(
        document.documentElement.clientHeight,
        window.innerHeight || 0
      );
      mDiv.style.height =
        viewHeight -
        mDiv.offsetWidth * Math.tan((7.5 * Math.PI) / 180) -
        navHeight +
        "px";

      // Sizing gameBundler
      let smallerDimensionSize = Math.min(
        document.documentElement.clientHeight,
        document.documentElement.clientWidth
      );
      let gameBundler = document.getElementById("gameBundler");
      gameBundler.style.height = smallerDimensionSize + "px";
      gameBundler.style.width = smallerDimensionSize + "px";
    },
    generateGridOverlay() {
      const fragment = document.createDocumentFragment();
      const grid = document.getElementById("gridOverlay");
      for (let x = 0; x < 15 * 15; x++) {
        const gridCell = document.createElement("div");
        gridCell.id = String(x);
        gridCell.classList.add("overlayCell");
        fragment.appendChild(gridCell);
      }
      grid.appendChild(fragment);
    },
  },
  mounted() {
    this.resizeSkew();
    window.onresize = () => this.resizeSkew();
    this.generateGridOverlay();
  },
};
</script>
<style scoped>
.timeGrid {
  display: grid;
}
.firstOberGroup {
  grid-column: 0;
  grid-row: 1;
  width: 50vw;
  text-align: center;
  padding-top: 1rem;
}
.secondOberGroup {
  grid-column: 1;
  grid-row: 1;
  width: 50vw;
  text-align: center;
  padding-top: 1rem;
}
.firstTimeGroup,
.secondTimeGroup {
  position: relative;
  padding: 0.5rem;
}
.names {
  color: #363636;
  font-weight: 700;
  font-size: 1.25rem;
}
#secondTimer,
#firstTimer {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -60%);
  font-size: 2rem;
  color: white;
  font-weight: 700;
}
#container {
  position: absolute;
  bottom: 0;
  width: 100%;
}
#gameBundler {
  background-color: #3636367a;
  position: relative;
  top: 1rem;
  border-top: 5px solid #363636;
  border-bottom: 5px solid #363636;
}
#winOverlay {
  top: -5px;
  position: absolute;
  width: 100%;
  height: calc(100% + 10px);
  background-color: rgba(100, 100, 100, 0.6);
}
#winButton {
  border: 5px solid black;
  padding: 0.5rem 1rem;
  position: relative;
  text-align: center;
  border-radius: 4px;
  color: #fff;
  font-weight: 700;
  font-size: 1.25rem;
  background: #00b3fe;
  width: 80%;
  border: 1px solid #00abf5;
  border-width: 1px 1px 3px;
  cursor: pointer;
  white-space: nowrap;
}
#winText {
  color: white;
  font-weight: 700;
  margin-bottom: 1.5rem;
  font-size: 1.5rem;
  background-color: #363636;
  border-radius: 4px;
  padding: 0.25rem 0.5rem;
}
#gridOverlay {
  position: relative;
  display: grid;
  width: 100%;
  height: 100%;
  grid-template-columns: repeat(15, minmax(0, 1fr));
  grid-template-rows: repeat(15, minmax(0, 1fr));
  row-gap: 3px;
  column-gap: 3px;
}
.svgCC {
  width: 90%;
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  animation: opacityIn 0.5s forwards;
  opacity: 0;
}
@keyframes opacityIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}
#svgCrossOrigin,
#svgCircleOrigin {
  display: none;
}
.centeredDiv {
  position: absolute;
  left: 50%;
  top: 40%;
  transform: translate(-50%, -50%);
  text-align: center;
}
#coinOverlay {
  top: -5px;
  position: absolute;
  width: 100%;
  height: calc(100% + 10px);
  background-color: rgba(100, 100, 100, 0.6);
}
#coin {
  position: relative;
  margin: 0 auto;
  margin-top: 8rem;
  width: 100px;
  height: 100px;
  cursor: default;
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
.side-a {
  background-color: #00b3fe;
}
.side-b {
  background-color: #ff2079;
}
#coin {
  transition: -webkit-transform 1s ease-in;
  -webkit-transform-style: preserve-3d;
}
#coin div {
  position: absolute;
  -webkit-backface-visibility: hidden;
}
.side-a {
  z-index: 100;
}
.side-b {
  transform: rotateY(-180deg);
}
#coin.heads {
  -webkit-animation: flipHeads 1.5s ease-out forwards;
  -moz-animation: flipHeads 1.5s ease-out forwards;
  -o-animation: flipHeads 1.5s ease-out forwards;
  animation: flipHeads 1.5s ease-out forwards;
}
#coin.tails {
  -webkit-animation: flipTails 1.5s ease-out forwards;
  -moz-animation: flipTails 1.5s ease-out forwards;
  -o-animation: flipTails 1.5s ease-out forwards;
  animation: flipTails 1.5s ease-out forwards;
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
<style>
.overlayCell {
  background-color: white;
  position: relative;
}
</style>
