<template>
  <div>
    <div
      style="background-color:#8f8f8f;width:100%;height:20vh;transform: skewY(-7.5deg);position:absolute;text-align:center;margin-top:-1px;"
      id="testDiv"
    >
      <h4>Let's play</h4>
      <h1>Piškvorky</h1>
    </div>
    <h2 class="page-desc">THE Place to play Gomoku</h2>
    <div class="scroll-hint">
      <svg
        class="scroll-hint-svg"
        id="ew8o2su1br9h1"
        xmlns="http://www.w3.org/2000/svg"
        xmlns:xlink="http://www.w3.org/1999/xlink"
        viewBox="0 0 60 85"
        shape-rendering="geometricPrecision"
        text-rendering="geometricPrecision"
      >
        <g
          id="ew8o2su1br9h2"
          transform="matrix(1 0 0 1 -57.58752441406250 -88.34347534179688)"
        >
          <g
            id="ew8o2su1br9h3"
            transform="matrix(10.25780487060547 0 0 10.25780487060547 -731.68450927734364 -1200.55944824218795)"
          >
            <g
              id="ew8o2su1br9h4_to"
              transform="translate(79.856567,131.739087)"
            >
              <g
                id="ew8o2su1br9h4"
                style="mix-blend-mode:darken"
                transform="translate(-79.856567,-131.739087)"
              >
                <rect
                  id="ew8o2su1br9h5"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(-0.70710676908493 -0.70710676908493 0.70710676908493 -0.70710676908493 79.87975977147882 131.97478941968910)"
                  paint-order="markers fill stroke"
                  :fill="colorMain"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
                <rect
                  id="ew8o2su1br9h6"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(0.70710676908493 -0.70710676908493 0.70710676908493 0.70710676908493 77.91676066982212 130.04304443722603)"
                  paint-order="markers fill stroke"
                  :fill="colorMain"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
              </g>
            </g>
            <g
              id="ew8o2su1br9h7_to"
              transform="translate(79.856567,130.370412)"
            >
              <g
                id="ew8o2su1br9h7"
                transform="translate(-79.856567,-130.370412)"
              >
                <rect
                  id="ew8o2su1br9h8"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(-0.70710676908493 -0.70710676908493 0.70710676908493 -0.70710676908493 79.87523428815672 130.60611355744837)"
                  paint-order="markers fill stroke"
                  :fill="colorMain"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
                <rect
                  id="ew8o2su1br9h9"
                  width="0.333333"
                  height="2.750000"
                  rx="0"
                  ry="0"
                  transform="matrix(0.70710676908493 -0.70710676908493 0.70710676908493 0.70710676908493 77.91676066944764 128.66156994289591)"
                  paint-order="markers fill stroke"
                  :fill="colorMain"
                  stroke="rgb(0,0,0)"
                  stroke-width="0"
                  stroke-linejoin="round"
                />
              </g>
            </g>
          </g>
          <text
            id="ew8o2su1br9h10"
            dx="0"
            dy="0"
            font-family="Roboto"
            font-size="15.630000"
            font-weight="bold"
            transform="matrix(1 0 0 1 67.28374793472653 112.53141674690430)"
            fill="rgb(46,64,82)"
            stroke="none"
            stroke-width="0.465970"
          >
            Scroll
          </text>
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
  props: ["logged"],
  mounted() {
    let mDiv = document.getElementById("testDiv");
    let navHeight = document.getElementById("smallNav").clientHeight;
    mDiv.style.top =
      (mDiv.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) +
      navHeight +
      "px";
    window.onresize = function() {
      let mDiv = document.getElementById("testDiv");
      let navHeight = document.getElementById("smallNav").clientHeight;
      mDiv.style.top =
        (mDiv.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) +
        navHeight +
        "px";
    };
  },
};
</script>
<style scoped>
.page-title {
  text-align: center;
  font-weight: 800;
  color: #2e4052;
  font-size: 3em;
}
.page-desc {
  text-align: center;
  font-weight: 400;
  color: #2e4052;
  font-size: 3em;
  margin-top: 3rem;
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
</style>
