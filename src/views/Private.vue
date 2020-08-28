<template>
  <div style="width:100%;height:100vh;background-color:#363636;">
    <div
      style="position:absolute;top:0;height:75%;width:100%;"
      id="skewedContainer"
    >
      <div
        style="background-color:#01ffc3;"
        @click="changeClass"
        class="skewMatchBox"
        :class="AnimTransClass"
        id="firstCont"
      >
        <div v-if="activeState === 'base'" class="centered-div">
          <span class="match-text">CREATE</span>
        </div>
        <router-link :to="{ path: 'waiting', query: { type: '5min' } }">
          <div v-if="activeState === 'create'" class="overlaySubOption">
            <div class="centered-div1">
              <span class="match-text">5 Min</span>
            </div>
          </div>
        </router-link>
        <router-link :to="{ path: 'waiting', query: { type: '10min' } }">
          <div
            v-if="activeState === 'create'"
            style="border-top: solid #363636 10px;"
            class="overlaySubOption"
          >
            <div class="centered-div2">
              <span class="match-text">10 Min</span>
            </div>
          </div>
        </router-link>
        <router-link :to="{ path: 'waiting', query: { type: 'no_limit' } }">
          <div
            v-if="activeState === 'create'"
            style="border-top: solid #363636 10px;"
            class="overlaySubOption"
          >
            <div class="centered-div3">
              <span class="match-text">No Limit</span>
            </div>
          </div>
        </router-link>
        <div
          v-if="activeState === 'create'"
          style="border-top: solid #363636 10px;"
          class="overlayLeave"
        >
          <i
            @click="createToBase"
            class="fa fa-chevron-left fa-3x backIcon"
            aria-hidden="true"
          ></i>
        </div>
      </div>
      <div
        style="background-color:#defe47;border-top: solid #363636 10px;top:50%;"
        @click="changeClass2"
        class="skewMatchBox"
        :class="AnimTransClass2"
        id="secondCont"
      >
        <div v-if="activeState === 'base'" class="centered-div">
          <span class="match-text">JOIN</span>
        </div>
        <div class="codeInputGr" v-if="activeState === 'join'">
          <label for="roomCode" id="roomCodeLabel">Room Code</label>
          <input
            name="roomCode"
            id="roomCode"
            type="text"
            maxlength="4"
            @input="checkRoomCode"
          />
          <span id="codeInvalidText" v-if="wrongCode"
            >Room code is invalid</span
          >
        </div>
        <i
          v-if="activeState === 'join'"
          @click="joinToBase"
          class="fa fa-chevron-left fa-3x backIconJoin"
          aria-hidden="true"
        ></i>
      </div>
    </div>
  </div>
</template>
<script>
import io from "socket.io-client";
import router from "../router";
let socket;
export default {
  name: "Private",
  components: {},
  props: ["logged"],
  data() {
    return {
      AnimTransClass: null,
      AnimTransClass2: null,
      activeState: "base",
      testVar: null,
      wrongCode: false,
    };
  },
  methods: {
    createToBase() {
      this.testVar = true;
      setTimeout(() => {
        this.AnimTransClass = "shrink-up";
        this.activeState = "base";
      }, 1);
      setTimeout(() => {
        this.testVar = false;
      }, 250);
    },
    joinToBase() {
      // this.testVar = true;
      setTimeout(() => {
        this.AnimTransClass2 = "shrink-down";
        this.activeState = "base";
      }, 1);
      setTimeout(() => {
        // this.testVar = false;
      }, 250);
    },
    changeClass() {
      if (!this.testVar) {
        this.AnimTransClass = "expand-down";
        this.activeState = "create";
      }
    },
    changeClass2() {
      this.AnimTransClass2 = "expand-up";
      this.activeState = "join";
    },
    resizeSkew() {
      let firstCont = document.getElementById("firstCont");
      let skewedOberCont = document.getElementById("skewedContainer");
      let navHeight = document.getElementById("smallNav").clientHeight;
      let fromTop =
        (firstCont.offsetWidth / 2) * Math.tan((7.5 * Math.PI) / 180) +
        navHeight +
        "px";
      skewedOberCont.style.top = fromTop;
    },
    checkRoomCode(e) {
      let targetElement = e.target;
      if (targetElement.value.length === 4) {
        socket.emit("roomJoined", targetElement.value.toUpperCase());
      }
    },
  },
  mounted() {
    this.resizeSkew();
    window.onresize = () => this.resizeSkew();

    socket = io("/waiting");

    socket.on("gameBegun", function(roomCode, gameBaseTime) {
      router.push({
        path: "p/game",
        query: {
          roomID: roomCode,
          type:
            gameBaseTime / 60 === 10
              ? "10min"
              : gameBaseTime / 60 === 5
              ? "5min"
              : "no_limit",
        },
      });
    });
    socket.on("room invalid", () => {
      this.wrongCode = true;
    });
  },
  destroyed() {
    socket.close();
  },
};
</script>
<style scoped>
#firstCont {
  top: 0;
}
#secondCont {
  top: 50%;
}
.body {
  background-color: #363636;
}
.centered-div {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
}
.centered-div1 {
  position: absolute;
  left: 50%;
  top: 12.5%;
  transform: translate(-50%, -50%);
}
.centered-div2 {
  position: absolute;
  left: 50%;
  top: calc(37.5% + 10px);
  transform: translate(-50%, -50%);
}
.centered-div3 {
  position: absolute;
  left: 50%;
  top: calc(62.5% + 20px);
  transform: translate(-50%, -50%);
}
.match-text {
  font-style: italic;
  font-weight: 700;
  font-size: 2.5rem;
  color: #363636;
  user-select: none;
}
.skewMatchBox {
  width: 100%;
  height: 50%;
  transform: skewY(-7.5deg);
  text-align: center;
  position: absolute;
}
.overlayLeave {
  height: 25%;
  background-color: #363636;
  text-align: center;
}

.backIcon {
  background-color: none;
  color: #01ffc3;
  padding: 1rem;
  transform: skewY(7.5deg);
}
.backIconJoin {
  background-color: none;
  color: #363636;
  padding: 1rem;
  transform: skewY(7.5deg);
  position: absolute;
  bottom: 0;
  left: 50%;
  transform: translate(-50%, 0);
}
.overlaySubOption {
  width: 100%;
  height: 25%;
  text-align: center;
  cursor: pointer;
  opacity: 0;
  animation: opacityAnim 0.5s ease-in forwards;
  transition: 0.5s all;
}
@keyframes opacityAnim {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
.expand-down {
  transition: 0.25s all linear 0s;
  z-index: 1;
  height: calc(100% + 10px);
}
.shrink-up {
  transition: 0.25s all linear 0s;
  animation: zindexFinal 0.25 forwards;
  height: calc(50%);
}
@keyframes zindexFinal {
  0% {
    z-index: 1;
  }
  99% {
    z-index: 1;
  }
  100% {
    z-index: 0;
  }
}
.shrink-down {
  transition: 0.25s all linear 0s;
  z-index: 0;
  top: 50%;
  height: calc(50%);
}
.expand-up {
  transition: 0.25s all linear 0s;
  z-index: 1;
  top: -1px !important;
  height: calc(100% + 1px) !important;
}
.codeInputGr {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}
#roomCode {
  border: 3px #363636 solid;
  line-height: 2rem;
  font-size: 2rem;
  width: 50vw;
  display: block;
  left: 50%;
  position: absolute;
  transform: translateX(-50%);
  margin-top: 0.5rem;
  text-align: center;
}
#roomCodeLabel {
  color: #363636;
  font-size: 2rem;
  font-weight: 400;
}
#codeInvalidText {
  color: red;
  display: block;
  position: absolute;
  top: 20vh;
  left: 50%;
  transform: translateX(-50%);
  white-space: nowrap;
  font-size: 1.25rem;
  font-weight: 700;
}
</style>
