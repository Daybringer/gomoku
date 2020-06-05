<template>
  <div class="game_main" id="game_main" :style="cssVars">
    <div class="game_sub">
      <div id="coin">
        <div class="side-a"></div>
        <div class="side-b"></div>
      </div>
    </div>
    <div class="game_sub" id="gameContainer">
      <canvas id="gameCanvas" width="100" height="100">
        Your browser doesn't support Canvas. To see the animation please update
        to modern browser like Firefox. Tic-Tac-Toe | Five in a row | Gomoku
        game
      </canvas>
      <div id="gridOverlay"></div>
      <div id="winOverlay">
        <h1 id="winText">Hello</h1>
        <router-link to="/search" id="winButton">Find new game</router-link>
      </div>
    </div>
    <div class="game_sub">
      <div>
        <p id="playerOne">You</p>
        <p id="timeOne">5:00</p>
      </div>
      <div>
        <p id="playerSecond">An utterly bad bot</p>
        <p id="timeSecond">5:00</p>
      </div>
    </div>
  </div>
</template>
<script>
let socket;
let timerInterval;
let mlTime, timer;
import io from "socket.io-client";
import router from "../router";
export default {
  name: "Game",
  components: {},
  props: ["logged", "username", "colorMain", "colorSecond", "port"],
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond,
      };
    },
  },
  mounted() {
    let gameMockScript = document.createElement("script");
    gameMockScript.setAttribute("src", "./scripts/gameMock.js");
    document.getElementById("game_main").append(gameMockScript);

    //gap between overlayGrid must be calculated
    const overlay = document.getElementById("gridOverlay");
    overlay.style.rowGap = `${document.body.clientWidth < 1400 ? 5 : 10}px`;
    overlay.style.columnGap = `${document.body.clientWidth < 1400 ? 5 : 10}px`;

    let roomID;

    socket = io("/quick");
    let queryString = new URLSearchParams(window.location.search);
    roomID = queryString.get("roomID");

    socket.emit("gameJoined", roomID);

    setTimeout(() => {
      document.getElementsByClassName("overlayCell").forEach((el) => {
        el.addEventListener("click", () => {
          gameClick(el);
        });
      });
    }, 200);

    function gameClick(el) {
      const row = Math.floor(el.id / 15);
      const column = el.id % 15;
      socket.emit("game click", roomID, row, column);
    }
    socket.on("roomMissing", function() {
      router.push("/404");
    });
    socket.on("gameBegun", function(startingPlayer) {
      const coin = document.getElementById("coin");
      coin.classList.forEach((element) => {
        coin.classList.remove(element);
      });

      if (socket.id === startingPlayer) {
        coin.classList.add("heads");
        setTimeout(() => {
          changeTimer("timeOne");
        }, 2500);
      } else {
        coin.classList.add("tails");
        setTimeout(() => {
          changeTimer("timeSecond");
        }, 2500);
      }
    });

    socket.on("click success", function(socketID, round, x, y) {
      const coin = document.getElementById("coin");
      coin.classList.forEach((element) => {
        coin.classList.remove(element);
      });
      if (socketID == socket.id) {
        if (round % 2 === 0) {
          placeCircle(y + 1, x + 1, sett.colors.primary);
        } else {
          placeCross(y + 1, x + 1, sett.colors.primary);
        }
        changeTimer("timeSecond");
        coin.classList.add("oneHeads");
      } else {
        if (round % 2 === 0) {
          placeCircle(y + 1, x + 1, sett.colors.secondary);
        } else {
          placeCross(y + 1, x + 1, sett.colors.secondary);
        }
        changeTimer("timeOne");
      }
      coin.classList.add("oneTails");
    });

    socket.on("win", function(socketID) {
      document.getElementById("winOverlay").style.display = "block";
      if (socket.id === socketID) {
        document.getElementById("winText").innerHTML = "You've won";
      } else {
        document.getElementById("winText").innerHTML = "You've lost";
      }
    });

    socket.on("timeOut", function(socketID, didTimedOut) {
      document.getElementById("winOverlay").style.display = "block";
      if (socketID === socket.id && didTimedOut) {
        document.getElementById("winText").innerHTML =
          "Time is out\nYou've lost";
      } else if (socketID !== socket.id && !didTimedOut) {
        document.getElementById("winText").innerHTML =
          "Time is out\nYou've lost";
      } else {
        document.getElementById("winText").innerHTML =
          "Time is out\nYou've won";
      }
    });

    socket.on("playerLeft", function() {
      document.getElementById("winOverlay").style.display = "block";
      document.getElementById("winText").innerHTML = "You've won";
    });

    let canvas, ctx, sett;
    setTimeout(() => {
      canvas = document.getElementById("gameCanvas");
      ctx = canvas.getContext("2d");
      sett = updateSettings();
      let size = Math.round(canvas.width / 15);
      sett.cellSize = size;
      // mainColor = this.mainColor;
      // secondaryColor = this.colorSecond;
      document.getElementById("winOverlay").style.width = canvas.width + "px";
      document.getElementById("winOverlay").style.height = canvas.width + "px";
      console.log(canvas);
      console.log(document.getElementById("winOverlay"));
    }, 500);

    function changeTimer(timerID) {
      clearInterval(timerInterval);
      timer = document.getElementById(timerID);
      let splitTime = timer.innerHTML.split(":");
      let min = Number(splitTime[0]);
      let sec = Number(splitTime[1]);
      mlTime = (min * 60 + sec) * 1000;
      timerInterval = setInterval(timeChange, 1000);
    }
    // NAIVE IMPLEMENTATION
    function timeChange() {
      if (mlTime > 0) {
        mlTime = mlTime - 1000;
        //conversion for displaying the time
        let minutes = Math.floor((mlTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((mlTime % (1000 * 60)) / 1000);
        timer.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      } else {
        socket.emit("timeOut", timer.id, roomID);
        clearInterval(timerInterval);
        timer.innerHTML = "0:0";
      }
    }
    let updateSettings = () => {
      let sectionDimensions = document.getElementById("gameContainer");
      let navbarHeight = document.getElementById("navbar").offsetHeight;
      let smallerDimension =
        sectionDimensions.clientWidth > sectionDimensions.clientHeight
          ? sectionDimensions.clientHeight
          : sectionDimensions.clientWidth;

      return {
        canvasWidth: smallerDimension - navbarHeight,
        canvasHeight: smallerDimension - navbarHeight,
        gridLineWidth: document.body.clientWidth < 1400 ? 5 : 10,
        circleLineWidth: document.body.clientWidth < 1400 ? 4 : 6,
        darkmode: false,
        colors: {
          primary: this.colorMain,
          secondary: this.colorSecond,
          stroke: "rgba(227, 227, 227, 1)",
          primaryDark: mixColors([255, 255, 255, 1], [58, 134, 255, 0.45]),
          secondaryDark: mixColors([255, 255, 255, 1], [255, 0, 110, 0.45]),
          strokeDark: "",
        },
        gridColumns: 15,
        gridRows: 15,
        cellSize: 0,
        pL: 0,
        pR: 0,
        pB: 0,
        pT: 0,
        pX: 0,
        pY: 0,
      };
    };
    function mixColors(bgColor, fwColor) {
      let [r1, g1, b1] = bgColor;
      let [r2, g2, b2, o2] = fwColor;

      const r3 = r1 * (1 - o2) + r2 * o2;
      const g3 = g1 * (1 - o2) + g2 * o2;
      const b3 = b1 * (1 - o2) + b2 * o2;
      return `rgba(${r3},${g3},${b3},1)`;
    }

    function calcPosition(gridX, gridY) {
      return {
        x: gridX * sett.cellSize - Math.floor(sett.cellSize / 2) + sett.pL,
        y: gridY * sett.cellSize - Math.floor(sett.cellSize / 2) + sett.pT,
        radius: Math.floor(sett.cellSize / 2) - sett.gridLineWidth,
      };
    }

    function placeCircle(gX, gY, color) {
      const { x, y, radius } = calcPosition(gX, gY);
      ctx.lineWidth = Math.floor(sett.gridLineWidth / 2);
      ctx.strokeStyle = color;
      const offCenter =
        Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) -
        ctx.lineWidth / 2 -
        20 / sett.gridLineWidth;
      const clearSize = sett.cellSize - sett.gridLineWidth;

      const curPerc = 0;
      animateCircle(x, y, radius, curPerc, offCenter, clearSize);
    }

    function animateCircle(x, y, radius, curPerc, offCenter, clearSize) {
      ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2 * curPerc);
      ctx.stroke();
      curPerc += 0.045;
      if (curPerc <= 1.12) {
        requestAnimationFrame(function() {
          animateCircle(x, y, radius, curPerc, offCenter, clearSize);
        });
      }
    }

    function placeCross(gX, gY, color) {
      const { x, y, radius } = calcPosition(gX, gY);

      const offCenter =
        Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) -
        ctx.lineWidth / 2 -
        20 / sett.gridLineWidth;
      const clearSize = sett.cellSize - sett.gridLineWidth;
      ctx.strokeStyle = color;
      ctx.lineWidth = Math.floor(sett.gridLineWidth / 2);

      animateCrossL(x, y, radius, -1, offCenter, clearSize);
      // animateCrossR(x, y, radius, -1, offCenter, clearSize);
    }

    function animateCrossL(x, y, radius, curPerc, offCenter, clearSize) {
      ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
      ctx.beginPath();
      ctx.moveTo(x - offCenter, y - offCenter);
      ctx.lineTo(x + offCenter * curPerc, y + offCenter * curPerc);
      ctx.stroke();
      curPerc += 0.2;
      if (curPerc < 1.1) {
        requestAnimationFrame(function() {
          animateCrossL(x, y, radius, curPerc, offCenter, clearSize);
        });
      } else {
        animateCrossR(x, y, radius, -1, offCenter, clearSize);
      }
    }

    function animateCrossR(x, y, radius, curPerc, offCenter, clearSize) {
      ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
      ctx.beginPath();
      ctx.moveTo(x - offCenter, y - offCenter);
      ctx.lineTo(x + offCenter, y + offCenter);
      ctx.moveTo(x + offCenter, y - offCenter);
      ctx.lineTo(x - offCenter * curPerc, y + offCenter * curPerc);
      ctx.stroke();
      curPerc += 0.2;
      if (curPerc < 1.1) {
        requestAnimationFrame(function() {
          animateCrossR(x, y, radius, curPerc, offCenter, clearSize);
        });
      }
    }
    // function placeLine(color, positions) {
    //   ctx.strokeStyle = color;

    //   const { x: fromX, y: fromY, radius } = calcPosition(
    //     positions.fromX,
    //     positions.fromY
    //   );
    //   const { x: toX, y: toY } = calcPosition(positions.toX, positions.toY);

    //   const offCenter =
    //     Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) -
    //     ctx.lineWidth / 2 -
    //     20 / sett.gridLineWidth;

    //   const difX = toX - fromX;
    //   const difY = toY - fromY;

    //   let xPositive, yPositive;
    //   if (difX !== 0 && difY !== 0) {
    //     if (difY < 0) {
    //       yPositive = [offCenter, -offCenter];
    //       xPositive = [-offCenter, offCenter];
    //     } else if (difY > 0) {
    //       yPositive = [-offCenter, offCenter];
    //       xPositive = [-offCenter, offCenter];
    //     }
    //   } else if (difY === 0) {
    //     yPositive = [0, 0];
    //     xPositive = [offCenter, offCenter];
    //   } else if (difX === 0) {
    //     yPositive = [-offCenter, offCenter];
    //     xPositive = [0, 0];
    //   }

    //   let step = 0;
    //   animateLine(
    //     fromX + xPositive[0],
    //     fromY + yPositive[0],
    //     toX + xPositive[1],
    //     toY + yPositive[1],
    //     step,
    //     difX,
    //     difY
    //   );
    // }

    // function animateLine(fX, fY, toX, toY, step, difX, difY) {
    //   ctx.beginPath();
    //   ctx.moveTo(fX, fY);
    //   ctx.lineTo(fX + difX * 0.02, fY + difY * 0.02);
    //   ctx.stroke();
    //   step += 0.01;
    //   if (step < 1.15) {
    //     requestAnimationFrame(function() {
    //       animateLine(
    //         fX + difX * 0.01,
    //         fY + difY * 0.01,
    //         toX,
    //         toY,
    //         step,
    //         difX,
    //         difY
    //       );
    //     });
    //   }
    // }
  },
  beforeDestroy() {
    clearInterval(timerInterval);
    socket.close();
  },
};
</script>
<style scoped>
#winButton {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  padding: 1rem;
  background-color: var(--main);
  color: white;
  opacity: 1;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: 600;
}

#winText {
  top: 30%;
  left: 50%;
  transform: translate(-50%, -50%);
  position: absolute;
  opacity: 1;
  color: var(--main);
  font-size: 3rem;
  padding: 0.5rem;
  border-radius: 10px;
  font-weight: 600;
  background-color: #2e4052;
}

#winOverlay {
  position: absolute;
  z-index: 101;
  background-color: rgba(70, 71, 71, 0.6);
  display: none;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  border: 15px solid #2e4052;
  border-radius: 2rem;
}

#playerOne {
  text-shadow: 3px 3px 0px rgba(70, 71, 71, 0.2);
  font-size: 3vw;
  text-align: right;
  padding-right: 3rem;
  padding-top: 8rem;
  color: #2e4052;
  margin: 0;
}

#timeOne {
  font-size: 4vw;
  margin: 0;
  text-align: right;
  padding-right: 3rem;
  color: var(--main);
}
#timeSecond {
  font-size: 4vw;
  margin: 0;
  text-align: right;
  padding-right: 3rem;
  color: var(--second);
}
#playerSecond {
  text-shadow: 3px 3px 0px rgba(70, 71, 71, 0.2);
  font-size: 2vw;
  text-align: right;
  padding-right: 3rem;
  color: #2e4052;
  margin: 0;
}

#coin {
  position: relative;
  margin: 0 auto;
  margin-top: 8rem;
  width: 100px;
  height: 100px;
  cursor: pointer;
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
  background-color: var(--main);
}
.side-b {
  background-color: var(--second);
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
  -webkit-transform: rotateY(-180deg);
}

#coin.heads {
  -webkit-animation: flipHeads 3s ease-out forwards;
  -moz-animation: flipHeads 3s ease-out forwards;
  -o-animation: flipHeads 3s ease-out forwards;
  animation: flipHeads 3s ease-out forwards;
}
#coin.tails {
  -webkit-animation: flipTails 3s ease-out forwards;
  -moz-animation: flipTails 3s ease-out forwards;
  -o-animation: flipTails 3s ease-out forwards;
  animation: flipTails 3s ease-out forwards;
}

#coin.oneTails {
  -webkit-animation: flipOneTail 1s ease-out forwards;
  -moz-animation: flipOneTail 1s ease-out forwards;
  -o-animation: flipOneTail 1s ease-out forwards;
  animation: flipOneTail 1s ease-out forwards;
}
#coin.oneHeads {
  -webkit-animation: flipOneHeads 1s ease-out forwards;
  -moz-animation: flipOneHeads 1s ease-out forwards;
  -o-animation: flipOneHeads 1s ease-out forwards;
  animation: flipOneHeads 1s ease-out forwards;
}
@-webkit-keyframes flipOneHeads {
  from {
    -webkit-transform: rotateY(0);
    -moz-transform: rotateY(0);
    transform: rotateY(0);
  }
  to {
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
    transform: rotateY(180deg);
  }
}

@-webkit-keyframes flipOneTail {
  from {
    -webkit-transform: rotateY(180deg);
    -moz-transform: rotateY(180deg);
    transform: rotateY(180deg);
  }
  to {
    -webkit-transform: rotateY(0deg);
    -moz-transform: rotateY(0deg);
    transform: rotateY(0deg);
  }
}

@-webkit-keyframes flipHeads {
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
@-webkit-keyframes flipTails {
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

#gridOverlay {
  display: grid;
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  grid-template-columns: repeat(15, 1fr);
  row-gap: 5px;
  column-gap: 5px;
  opacity: 0.3;
}

#gameCanvas {
  position: absolute;
  bottom: 50%;
  left: 50%;
  transform: translate(-50%, 50%);
  border: 15px solid #2e4052;
  border-radius: 2rem;
}

#gameContainer {
  grid-column: span 2;
}

.game_sub {
  width: 100%;
  height: 100%;
}

.game_main {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  height: calc(100vh - 4em);
  position: absolute;
  bottom: 0;
  width: 100%;
}
</style>
