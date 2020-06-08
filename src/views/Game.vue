<template>
  <div class="game_main" id="game_main" :style="cssVars">
    <div class="game_sub" id="game_sub_coin">
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
        <div id="winCenterDiv">
          <h1 id="winText">Hello</h1>
          <router-link to="/search" id="winButton">Find new game</router-link>
        </div>
      </div>
    </div>
    <div class="game_sub" id="timer_game_sub">
      <div id="timer_game_sub_sub1">
        <p id="playerOne">You</p>
        <p id="timeOne">5:00</p>
      </div>
      <div id="timer_game_sub_sub2">
        <p id="playerSecond">An utterly bad bot</p>
        <p id="timeSecond">5:00</p>
      </div>
      <router-link class="leave-button" to="/">
        Surrender
      </router-link>
    </div>
  </div>
</template>
<script>
let socket;
let timerInterval;
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
    // Globals
    let canvas, ctx, sett, mlTime, timer;

    canvas = document.getElementById("gameCanvas");
    ctx = canvas.getContext("2d");
    sett = (() => {
      let dpi = window.devicePixelRatio;
      let sectionDimensions = document.getElementById("gameContainer");
      let navbarHeight = document.getElementById("navbar").offsetHeight;
      let smallerDimension =
        sectionDimensions.clientWidth > sectionDimensions.clientHeight
          ? sectionDimensions.clientHeight
          : sectionDimensions.clientWidth;

      return {
        dpi: dpi,
        canvasWidth:
          document.body.clientWidth < 1400
            ? smallerDimension
            : smallerDimension - navbarHeight,
        canvasHeight:
          document.body.clientWidth < 1400
            ? smallerDimension
            : smallerDimension - navbarHeight,
        gridLineWidth: document.body.clientWidth < 1400 ? 5 : 10,
        colors: {
          primary: this.colorMain,
          secondary: this.colorSecond,
          stroke: "rgba(227, 227, 227, 1)",
          primaryDark: mixColors([255, 255, 255, 1], [58, 134, 255, 0.45]),
          secondaryDark: mixColors([255, 255, 255, 1], [255, 0, 110, 0.45]),
        },
        gridColumns: 15,
        gridRows: 15,
        cellSize: 0,
      };
    })();

    document.getElementById("gridOverlay").style.width =
      sett.canvasWidth - sett.gridLineWidth + "px";
    document.getElementById("gridOverlay").style.height =
      sett.canvasHeight - sett.gridLineWidth + "px";
    document.getElementById("gameCanvas").style.width = sett.canvasWidth + "px";
    document.getElementById("gameCanvas").style.height =
      sett.canvasHeight + "px";
    // Styles
    document.getElementById("winOverlay").style.width = sett.canvasWidth + "px";
    document.getElementById("winOverlay").style.height =
      sett.canvasHeight + "px";

    const overlay = document.getElementById("gridOverlay");
    overlay.style.rowGap = `${sett.gridLineWidth}px`;
    overlay.style.columnGap = `${sett.gridLineWidth}px`;

    drawGameboard();
    generateGridOverlay();

    document.getElementsByClassName("overlayCell").forEach((el) => {
      el.addEventListener("click", () => {
        gameClick(el);
      });
    });

    // Saving global socket instance
    socket = io("/quick");

    // Global room token
    let roomID;
    let queryString = new URLSearchParams(window.location.search);
    roomID = queryString.get("roomID");

    socket.emit("gameJoined", roomID);

    socket.on("roomMissing", function() {
      router.push("/404");
    });
    socket.on("gameBegun", function(startingPlayer) {
      // Spinning coin
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

    socket.on("click success", function(
      socketID,
      round,
      x,
      y,
      times,
      playersArr
    ) {
      // Removing old side from flip coin
      const coin = document.getElementById("coin");
      coin.classList.forEach((element) => {
        coin.classList.remove(element);
      });

      clearInterval(timerInterval);

      // Syncing local time with time from server
      updateTimers(round, times, socket.id, playersArr);

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

      // Adding border to last draw (style is in index.html)
      let oldDraws = document.getElementsByClassName("lastDraw");

      Array.from(oldDraws).forEach((el) => {
        el.classList.remove("lastDraw");
      });
      document.getElementById(`${x * 15 + y}`).classList.add("lastDraw");
    });

    socket.on("win", function(socketID) {
      clearInterval(timerInterval);
      document.getElementById("winOverlay").style.display = "block";
      if (socket.id === socketID) {
        document.getElementById("winText").innerHTML = "You've won";
      } else {
        document.getElementById("winText").innerHTML = "You've lost";
      }
    });

    socket.on("playerLeft", function() {
      clearInterval(timerInterval);
      document.getElementById("winOverlay").style.display = "block";
      document.getElementById("winText").innerHTML = "You've won";
    });

    function gameClick(el) {
      const row = Math.floor(el.id / 15);
      const column = el.id % 15;
      socket.emit("game click", roomID, row, column);
    }

    function updateTimers(round, times, socketID, playersArr) {
      let myTime = times[playersArr.indexOf(socketID)][0];
      document.getElementById("timeOne").innerHTML = `${Math.floor(
        myTime / 60
      )}:${Math.round(myTime % 60) < 10 ? "0" : ""}${Math.round(myTime % 60)}`;

      let enemyTime = times[Math.abs(playersArr.indexOf(socketID) - 1)][0];
      document.getElementById("timeSecond").innerHTML = `${Math.floor(
        enemyTime / 60
      )}:${Math.floor(enemyTime % 60) < 10 ? "0" : ""}${Math.floor(
        enemyTime % 60
      )}`;
    }

    function changeTimer(timerID) {
      timer = document.getElementById(timerID);
      let splitTime = timer.innerHTML.split(":");
      let min = Number(splitTime[0]);
      let sec = Number(splitTime[1]);
      mlTime = (min * 60 + sec) * 1000;
      timerInterval = setInterval(timeChange, 1000);
    }

    function timeChange() {
      if (mlTime > 0) {
        mlTime = mlTime - 1000;
        //conversion for displaying the time
        let minutes = Math.floor((mlTime % (1000 * 60 * 60)) / (1000 * 60));
        let seconds = Math.floor((mlTime % (1000 * 60)) / 1000);
        timer.innerHTML = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
      } else {
        clearInterval(timerInterval);
        timer.innerHTML = "0:0";
      }
    }
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
        x: gridX * sett.cellSize - sett.cellSize / 2,
        y: gridY * sett.cellSize - sett.cellSize / 2,
        radius: sett.cellSize / 2 - sett.gridLineWidth,
      };
    }

    function placeCircle(gX, gY, color) {
      const { x, y, radius } = calcPosition(gX, gY);

      ctx.lineWidth = sett.gridLineWidth / 2;
      ctx.strokeStyle = color;

      let noBorderCellSize = Number(
        document.getElementById("0").style.width.slice(0, -2)
      );
      const clearSize = noBorderCellSize / 2;
      const curPerc = 0;

      animateCircle(x, y, radius, curPerc, clearSize);
    }

    function animateCircle(x, y, radius, curPerc, clearSize) {
      ctx.clearRect(x, y, -clearSize, -clearSize);
      ctx.clearRect(x, y, clearSize, -clearSize);
      ctx.clearRect(x, y, -clearSize, clearSize);
      ctx.clearRect(x, y, clearSize, clearSize);
      ctx.beginPath();
      ctx.arc(x, y, radius, 0, Math.PI * 2 * curPerc);
      ctx.stroke();
      curPerc += 0.045;
      if (curPerc <= 1.12) {
        requestAnimationFrame(function() {
          animateCircle(x, y, radius, curPerc, clearSize);
        });
      }
    }

    function placeCross(gX, gY, color) {
      const { x, y, radius } = calcPosition(gX, gY);

      ctx.lineWidth = sett.gridLineWidth / 2;
      ctx.strokeStyle = color;

      let noBorderCellSize = Number(
        document.getElementById("0").style.width.slice(0, -2)
      );
      const offCenter =
        Math.hypot(noBorderCellSize / 2, noBorderCellSize / 2) -
        sett.gridLineWidth;
      const clearSize = noBorderCellSize / 2;

      animateCrossL(x, y, radius, -1, offCenter, clearSize);
    }

    function animateCrossL(x, y, radius, curPerc, offCenter, clearSize) {
      ctx.clearRect(x, y, -clearSize, -clearSize);
      ctx.clearRect(x, y, clearSize, -clearSize);
      ctx.clearRect(x, y, -clearSize, clearSize);
      ctx.clearRect(x, y, clearSize, clearSize);
      ctx.beginPath();
      ctx.moveTo(x - radius, y - radius);
      ctx.lineTo(x + radius * curPerc, y + radius * curPerc);
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
      ctx.clearRect(x, y, -clearSize, -clearSize);
      ctx.clearRect(x, y, clearSize, -clearSize);
      ctx.clearRect(x, y, -clearSize, clearSize);
      ctx.clearRect(x, y, clearSize, clearSize);
      ctx.beginPath();
      ctx.moveTo(x - radius, y - radius);
      ctx.lineTo(x + radius, y + radius);
      ctx.moveTo(x + radius, y - radius);
      ctx.lineTo(x - radius * curPerc, y + radius * curPerc);
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
    function generateGridOverlay() {
      const fragment = document.createDocumentFragment();
      const grid = document.getElementById("gridOverlay");
      for (let x = 0; x < sett.gridColumns * sett.gridRows; x++) {
        const gridCell = document.createElement("div");
        gridCell.style.width =
          sett.cellSize / sett.dpi - sett.gridLineWidth + "px";
        gridCell.style.height =
          sett.cellSize / sett.dpi - sett.gridLineWidth + "px";
        // gridCell.style.backgroundColor = "#e70064";
        gridCell.style.cursor = "pointer";
        gridCell.id = String(x);
        gridCell.classList.add("overlayCell");
        fragment.appendChild(gridCell);
      }
      grid.appendChild(fragment);
    }
    function drawGameboard() {
      canvas.width = sett.canvasWidth * sett.dpi;
      canvas.height = sett.canvasHeight * sett.dpi;

      ctx.strokeStyle = sett.colors.stroke;

      ctx.lineWidth = sett.gridLineWidth;

      let nX = sett.gridColumns;
      let size = canvas.width / nX;
      sett.cellSize = size;

      ctx.beginPath();
      for (let x = 0; x <= canvas.width + 10; x += size) {
        ctx.moveTo(x, 0);
        ctx.lineTo(x, canvas.height);
      }
      for (let y = 0; y <= canvas.height + 10; y += size) {
        ctx.moveTo(0, y);
        ctx.lineTo(canvas.width, y);
      }
      ctx.stroke();
    }
  },
  beforeDestroy() {
    clearInterval(timerInterval);
    socket.close();
  },
};
</script>
<style scoped>
.leave-button {
  position: relative;
  display: block;
  padding: 0.5rem 0rem;
  color: #fff;
  margin-left: auto;
  margin-right: 3rem;
  margin-top: 1rem;
  background: #2e4052;
  font-size: 1.5rem;
  font-weight: 500;
  text-align: center;
  font-style: normal;
  width: 50%;
  border-width: 1px 1px 3px;
  border-radius: 0.25em;
  cursor: pointer;
}
.leave-button:hover {
  background-color: #8b8b8b;
}
#winButton {
  margin: 0 auto;
  display: block;
  padding: 1rem;
  background-color: var(--main);
  color: white;
  opacity: 1;
  border-radius: 10px;
  font-size: 1.5rem;
  font-weight: 600;
  margin-top: 0;
  transition: all 0.2s ease-in-out;
}
#winButton:hover {
  -webkit-transform: scale(1.05);
  transform: scale(1.05);
}

#winText {
  margin: 0 auto;
  opacity: 1;
  color: var(--main);
  font-size: 3rem;
  padding: 0.5rem;
  border-radius: 10px;
  font-weight: 600;
  background-color: #2e4052;
  margin-bottom: 1.5rem;
}
#winCenterDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -100%);
  text-align: center;
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
  border: 10px solid #2e4052;
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

@media only screen and (max-width: 600px) {
  .game_main {
    display: block;
    height: calc(100vh - 4em);
    position: absolute;
    bottom: 0;
    width: 100%;
  }
  #gridOverlay {
    display: grid;
    top: calc(5rem + 5px);
    left: 0;
    transform: translate(2.5px, 2.5px);
    position: absolute;
    grid-template-columns: repeat(15, 1fr);
    row-gap: 5px;
    column-gap: 5px;
    opacity: 0.3;
  }

  #gameCanvas {
    top: 0;
    left: 0;
    transform: translate(0, 0);
    position: relative;
    width: 100%;
    margin: 0 auto;
    margin-top: 5rem;
    border: 0;
    border-top: 5px solid #2e4052;
    border-bottom: 5px solid #2e4052;
    border-radius: 0;
  }

  .game_sub {
    width: auto;
    height: auto;
  }

  #timer_game_sub {
    position: absolute;
    top: 0;
    right: 0;
    margin: 0;
    padding: 0;
    display: grid;
    column-gap: 0;
    width: 90%;
    height: 4.8rem;
  }
  #winButton {
    padding: 1rem;
    background-color: var(--main);
    color: white;
    opacity: 1;
    border-radius: 10px;
    font-size: 1.5rem;
    font-weight: 600;
    white-space: nowrap;
  }
  #winButton:hover {
    -webkit-transform: none;
    transform: none;
  }
  #winText {
    opacity: 1;
    color: var(--main);
    font-size: 1.5rem;
    padding: 0.5rem;
    border-radius: 10px;
    font-weight: 600;
    background-color: #2e4052;
    white-space: nowrap;
  }

  #winCenterDiv {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    text-align: center;
  }

  #winOverlay {
    z-index: 101;
    background-color: rgba(70, 71, 71, 0.6);
    top: 0;
    left: 0;
    transform: translate(0, 0);
    position: absolute;
    margin: 0 auto;
    margin-top: calc(5rem + 5px);
    border: none;
    border-radius: 0;
  }
  .leave-button {
    position: relative;
    display: block;
    color: #2e4052;
    margin: 0 auto;
    background: #fff;
    font-size: 1rem;
    padding: 0;
    padding-right: 0.5rem;

    font-weight: 500;
    text-align: center;
    font-style: normal;
    border: none;
    border-radius: 0;
    cursor: pointer;
    grid-column: 3;
    grid-row: 2;
    width: 100%;
  }
  .leave-button:hover {
    background-color: #fff;
  }
  #playerOne {
    text-shadow: 3px 3px 0px rgba(70, 71, 71, 0.2);
    font-size: 1rem;
    text-align: right;
    padding: 0;
    color: #2e4052;
    margin: 0;
  }
  #timer_game_sub_sub1 {
    grid-column: 2;
    grid-row: 1;
  }
  #timer_game_sub_sub2 {
    grid-column: 3;
    grid-row: 1;
  }
  #timeOne {
    font-size: 1rem;
    margin: 0;
    text-align: right;
    padding-right: 0;
    color: var(--main);
  }
  #timeSecond {
    font-size: 1rem;
    margin: 0;
    text-align: right;
    padding-right: 0;
    color: var(--second);
  }
  #playerSecond {
    text-shadow: 3px 3px 0px rgba(70, 71, 71, 0.2);
    font-size: 1rem;
    text-align: right;
    padding: 0;
    color: #2e4052;
    margin: 0;
  }

  #coin {
    top: 0;
    left: 1rem;
    margin: 0;
    padding: 0;
    position: absolute;
    width: 50px;
    height: 50px;
    cursor: default;
  }
}

@media only screen and (min-width: 600) and (max-width: 768) {
}
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) and (max-width: 1200px) {
}

/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}

/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
</style>
