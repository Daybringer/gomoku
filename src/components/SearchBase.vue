<template>
  <div class="grid-overlay" id="searchScript">
    <div class="container-half">
      <div class="swing-animation">
        <svg
          id="ephaw8h2jvi1"
          xmlns="http://www.w3.org/2000/svg"
          xmlns:xlink="http://www.w3.org/1999/xlink"
          viewBox="0 0 50.850000 48"
          shape-rendering="geometricPrecision"
          text-rendering="geometricPrecision"
        >
          <g
            id="ephaw8h2jvi2"
            transform="matrix(1 0 0 1 -17.78199958801270 287.35101318359375)"
            paint-order="markers fill stroke"
          >
            <ellipse
              id="ephaw8h2jvi3"
              rx="9.955000"
              ry="1.939000"
              transform="matrix(1.73724997043610 0 0 1.48821997642517 43.66908628194534 -243.21498425683708)"
              opacity="0.596"
              paint-order="markers fill stroke"
              fill="rgb(227,227,227)"
              stroke="none"
              stroke-width="1"
            />
            <g
              id="ephaw8h2jvi4_to"
              transform="translate(61.480000,-264.730000)"
            >
              <g id="ephaw8h2jvi4_tr" transform="rotate(-132.010000)">
                <g
                  id="ephaw8h2jvi4"
                  transform="scale(1,1) translate(-60.200674,252.153023)"
                  paint-order="markers fill stroke"
                >
                  <rect
                    id="ephaw8h2jvi5"
                    width="1.483330"
                    height="9.283330"
                    rx="0"
                    ry="0"
                    transform="matrix(-0.92294168472290 0.38493973016739 -0.38493973016739 -0.92294168472290 62.67649119827323 -248.15453797579238)"
                    paint-order="markers fill stroke"
                    :fill="colorMain"
                    stroke="none"
                    stroke-width="1"
                  />
                  <rect
                    id="ephaw8h2jvi6"
                    width="1.483330"
                    height="9.283330"
                    rx="0"
                    ry="0"
                    transform="matrix(-0.38493973016739 -0.92294168472290 0.92294168472290 -0.38493973016739 56.20218457582762 -249.68310904485418)"
                    paint-order="markers fill stroke"
                    :fill="colorMain"
                    stroke="none"
                    stroke-width="1"
                  />
                </g>
              </g>
            </g>
            <g
              id="ephaw8h2jvi7_to"
              transform="translate(22.947501,-250.796000)"
            >
              <g id="ephaw8h2jvi7_tr" transform="rotate(47.097829)">
                <g
                  id="ephaw8h2jvi7"
                  transform="scale(1,1) translate(-60.200674,252.153023)"
                  paint-order="markers fill stroke"
                >
                  <rect
                    id="ephaw8h2jvi8"
                    width="1.483330"
                    height="9.283330"
                    rx="0"
                    ry="0"
                    transform="matrix(-0.92294168472290 0.38493973016739 -0.38493973016739 -0.92294168472290 62.67649119827323 -248.15453797579238)"
                    paint-order="markers fill stroke"
                    :fill="colorMain"
                    stroke="none"
                    stroke-width="1"
                  />
                  <rect
                    id="ephaw8h2jvi9"
                    width="1.483330"
                    height="9.283330"
                    rx="0"
                    ry="0"
                    transform="matrix(-0.38493973016739 -0.92294168472290 0.92294168472290 -0.38493973016739 56.20218457582762 -249.68310904485418)"
                    paint-order="markers fill stroke"
                    :fill="colorMain"
                    stroke="none"
                    stroke-width="1"
                  />
                </g>
              </g>
            </g>
            <ellipse
              id="ephaw8h2jvi10"
              rx="3.781000"
              ry="3.942000"
              transform="matrix(1 0 0 1 43.20699958500003 -248.00867347500011)"
              paint-order="markers fill stroke"
              fill="none"
              :stroke="colorSecond"
              stroke-width="1.124000"
              stroke-linejoin="round"
            />
            <g
              id="ephaw8h2jvi11_tr"
              transform="translate(43.204595,-253.340913) rotate(70)"
            >
              <rect
                id="ephaw8h2jvi11"
                width="1.483330"
                height="37.400000"
                rx="0"
                ry="0"
                transform="scale(1,1.319440) translate(-0.733469,-18.702983)"
                paint-order="markers fill stroke"
                fill="rgb(46,64,82)"
                stroke="none"
                stroke-width="1"
              />
            </g>
          </g>
        </svg>
        <router-link to="casual" id="dumbLink"></router-link>
      </div>
    </div>

    <div class="container-half container-loading-text">
      <span id="loading-text">
        Searching
        <span id="wait"></span>
      </span>
    </div>
  </div>
</template>
<script>
export default {
  name: "SearchBase",
  components: {},
  props: ["logged", "username", "colorMain", "colorSecond"],
};
</script>
<style scoped>
.grid-overlay {
  display: grid;
  grid-template-columns: repeat(2, 1fr);
}

.container-half {
  width: 50vw;
}

.container-loading-text {
  padding-top: 10rem;
}

#loading-text {
  padding-left: 10rem;
  font-size: 5vw;
  color: #2e4052;
}

.swing-animation {
  width: 60%;
  margin-left: auto;
  margin-right: 0;
  margin-top: 15%;
}
#ephaw8h2jvi4_to {
  animation: ephaw8h2jvi4_to__to 2000ms linear infinite normal forwards;
}

@keyframes ephaw8h2jvi4_to__to {
  0% {
    transform: translate(61.48px, -264.73px);
    animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
  }

  25% {
    transform: translate(63.809572px, -250.688966px);
  }

  50% {
    transform: translate(63.809572px, -250.687812px);
    animation-timing-function: cubic-bezier(0, 0, 0.58, 1);
  }

  75% {
    transform: translate(63.809572px, -282.189923px);
    animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
  }

  100% {
    transform: translate(61.477577px, -264.733524px);
  }
}

#ephaw8h2jvi4_tr {
  animation: ephaw8h2jvi4_tr__tr 2000ms linear infinite normal forwards;
}

@keyframes ephaw8h2jvi4_tr__tr {
  0% {
    transform: rotate(-132.01deg);
  }

  25% {
    transform: rotate(-93.209284deg);
  }

  50% {
    transform: rotate(-93.21deg);
  }

  75% {
    transform: rotate(-157.938314deg);
  }

  100% {
    transform: rotate(-222.907401deg);
  }
}

#ephaw8h2jvi7_to {
  animation: ephaw8h2jvi7_to__to 2000ms linear infinite normal forwards;
}

@keyframes ephaw8h2jvi7_to__to {
  0% {
    transform: translate(22.947501px, -250.796px);
    animation-timing-function: cubic-bezier(0, 0, 0.58, 1);
  }

  25% {
    transform: translate(24.120218px, -282.331154px);
    animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
  }

  50% {
    transform: translate(24.918807px, -264.861087px);
    animation-timing-function: cubic-bezier(0.47, 0, 0.745, 0.715);
  }

  75% {
    transform: translate(22.955667px, -250.791797px);
    animation-timing-function: cubic-bezier(0.42, 0, 1, 1);
  }

  100% {
    transform: translate(22.986167px, -250.791797px);
  }
}

#ephaw8h2jvi7_tr {
  animation: ephaw8h2jvi7_tr__tr 2000ms linear infinite normal forwards;
}

@keyframes ephaw8h2jvi7_tr__tr {
  0% {
    transform: rotate(47.097829deg);
  }

  25% {
    transform: rotate(110.206762deg);
  }

  50% {
    transform: rotate(178.210936deg);
  }

  75% {
    transform: rotate(136.051333deg);
  }

  100% {
    transform: rotate(136.05deg);
  }
}

#ephaw8h2jvi11_tr {
  animation: ephaw8h2jvi11_tr__tr 2000ms linear infinite normal forwards;
}

@keyframes ephaw8h2jvi11_tr__tr {
  0% {
    transform: translate(43.204595px, -253.340913px) rotate(70deg);
  }

  25% {
    transform: translate(43.204595px, -253.340913px) rotate(110deg);
  }

  50% {
    transform: translate(43.204595px, -253.340913px) rotate(110deg);
  }

  75% {
    transform: translate(43.204595px, -253.340913px) rotate(70deg);
  }

  100% {
    transform: translate(43.204595px, -253.340913px) rotate(70deg);
  }
}

@media only screen and (max-width: 600px) {
  .grid-overlay {
    display: grid;
    grid-template-columns: repeat(1, 1fr);
  }

  .container-half {
    width: 100%;
  }

  .container-loading-text {
    padding-top: 3rem;
  }

  #loading-text {
    font-size: 3rem;
    color: #2e4052;
    padding: 0;
    margin: 0;
    left: 50%;
    position: fixed;
    transform: translate(-50%, 0);
  }

  .swing-animation {
    width: 80%;
    margin-left: auto;
    margin-right: auto;
  }
}
</style>
