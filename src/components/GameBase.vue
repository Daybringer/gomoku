<template>
  <div id="container">
    <div class="timeGrid">
      <div class="firstOberGroup">
        <span class="names">An Enemy</span>
        <div class="firstTimeGroup">
          <span id="firstTimer">10:00</span>
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
                  id="path1693-8"
                  style="fill:#363636;fill-opacity:1;stroke:#00b3fe;stroke-width:0.72;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.757549"
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
          <span id="secondTimer">10:00</span>
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
                  style="fill:#363636;fill-opacity:1;stroke:#ff2079;stroke-width:0.72;stroke-linecap:round;stroke-miterlimit:4;stroke-dasharray:none;stroke-opacity:0.762404"
                  id="path1693-8-7"
                />
              </g>
            </g>
          </svg>
        </div>
      </div>
    </div>
    <div id="gameBundler">
      <div id="gridOverlay"></div>
      <!-- <div id="winOverlay" style="display:none;">
        <div id="winCenterDiv">
          <h1 id="winText"></h1>
          <router-link to="/q/search" id="winButton">Find new game</router-link>
        </div>
      </div> -->
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
  props: ["logged", "username", "colorMain", "colorSecond"],
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
    gameClick(el) {
      if (this.round % 2 === 0) {
        let crossCp = document.getElementById("svgCrossOrigin").cloneNode(true);
        crossCp.id = `cross${el.id}`;
        crossCp.classList.add("svgCC");
        el.appendChild(crossCp);
      } else {
        let circleCp = document
          .getElementById("svgCircleOrigin")
          .cloneNode(true);
        circleCp.id = `circle${el.id}`;
        circleCp.classList.add("svgCC");
        el.appendChild(circleCp);
      }
      document.getElementById(this.lastPosition).style.outline = "none";
      document.getElementById(el.id).style.outline = "3px solid #363636";
      this.lastPosition = el.id;
      this.round++;
    },
  },
  mounted() {
    this.resizeSkew();
    window.onresize = () => this.resizeSkew();
    this.generateGridOverlay();
    document.getElementsByClassName("overlayCell").forEach((el) => {
      el.addEventListener("click", () => {
        this.gameClick(el);
      });
    });
  },
  computed: {},
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
</style>
<style>
.overlayCell {
  background-color: white;
  position: relative;
}
</style>
