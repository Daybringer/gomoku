<template>
  <div>
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
          <g id="ephaw8h2jvi4_to" transform="translate(61.480000,-264.730000)">
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
          <g id="ephaw8h2jvi7_to" transform="translate(22.947501,-250.796000)">
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
    </div>
    <div class="textGroup">
      <span id="loading-text">Room code<br /></span>
      <span id="room-code-text">
        <span id="room-code-text-innerHTMl">{{ roomCodeQuery }}</span>
        <textarea
          id="dummyURLHolder"
          value=""
          style="display: none;"
        ></textarea>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 82.27 82.27"
          id="copySVG"
          @click="copyRoomURL"
        >
          <g transform="matrix(25.67749 0 0 25.67749 -8005.21 -2274.6)">
            <circle
              cx="313.36"
              cy="90.19"
              r="1.6"
              opacity=".6"
              fill="#464747"
              fill-opacity="0.18"
              paint-order="markers fill stroke"
            />
            <path
              d="M313.83 89.71c.06.06.06.15 0 .2l-.74.75a.14.14 0 01-.2-.2l.75-.75a.14.14 0 01.2 0zm-.85 1.26a.28.28 0 01-.4-.4l.53-.53a.54.54 0 00-.51.15l-.2.2a.54.54 0 00.76.76l.2-.2a.54.54 0 00.14-.51zm.58-1.75l-.2.2a.54.54 0 00-.14.51l.53-.53a.28.28 0 01.4.4l-.53.53c.17.04.37 0 .5-.14l.2-.2a.54.54 0 00-.76-.77z"
              :fill="colorMain"
            />
          </g>
        </svg>
        <span id="copy-success"><br />Copied to clipboard</span>
      </span>
    </div>
  </div>
</template>
<script>
import io from "socket.io-client";
import router from "../router";
let socket;
export default {
  name: "WaitingRoom",
  components: {},
  methods: {
    copyRoomURL() {
      console.log(this.roomCodeQuery);
      let queryString = new URLSearchParams(window.location.search);
      let typeOfGame = queryString.get("type");
      const el = document.createElement("textarea");
      if (this.roomCodeQuery !== "Loading...") {
        el.value =
          window.location.origin +
          `/waiting?type=${typeOfGame}&roomCode=${this.roomCodeQuery}`;
      } else {
        el.value = "";
      }
      el.setAttribute("readonly", "");
      el.style.position = "absolute";
      el.style.left = "-9999px";
      document.body.appendChild(el);
      el.select();
      document.execCommand("copy");
      document.body.removeChild(el);
      document.getElementById("copy-success").style.display = "inline";
    },
  },
  props: ["logged"],
  computed: {},
  data() {
    return {
      colorMain: "#ff2079",
      colorSecond: "#00b3fe",
      roomCodeQuery: "Processing...",
    };
  },
  mounted() {
    let queryString = new URLSearchParams(window.location.search);
    let typeOfGame = queryString.get("type");
    let roomCodeQuery = queryString.get("roomCode");
    if (
      typeOfGame !== "no_limit" &&
      typeOfGame !== "5min" &&
      typeOfGame !== "10min"
    )
      router.push("/404");

    socket = io("/waiting");

    if (roomCodeQuery === null) {
      socket.emit(
        "createRoom",
        typeOfGame === "5min" ? 5 : typeOfGame === "10min" ? 10 : null
      );
    } else {
      this.roomCodeQuery = roomCodeQuery;
      document.getElementById("room-code-text").style.display = "block";
      socket.emit("roomJoined", roomCodeQuery);
    }

    socket.on("roomGenerated", (roomCode) => {
      console.log(roomCode, this.roomCodeQuery);
      this.roomCodeQuery = roomCode;
      document.getElementById("room-code-text").style.display = "block";
    });
    socket.on("gameBegun", (roomCode) => {
      router.push({
        path: "p/game",
        query: { roomID: roomCode, type: typeOfGame },
      });
    });
    socket.on("room invalid", function() {
      router.push("/404");
    });
  },
  destroyed() {
    socket.close();
  },
};
</script>
<style scoped>
#copySVG {
  height: 2rem;
  cursor: pointer;
  padding-left: 1rem;
}
#copy-success {
  font-size: 1rem;
  text-shadow: none;
  color: #2e4052;
  display: none;
  transition: all 1s ease-in;
}

#room-code-text-innerHTMl {
  text-shadow: 3px 3px 0px rgba(70, 71, 71, 0.3);
  font-size: 3rem;
  color: #ff2079;
}
#loading-text {
  font-size: 3rem;
  font-weight: 700;
  color: #363636;
  white-space: nowrap;
}
.textGroup {
  position: absolute;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
  text-align: center;
}
.swing-animation {
  width: 40vh;
  position: absolute;
  left: 50%;
  transform: translate(-50%, 0);
  bottom: 3rem;
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
</style>
