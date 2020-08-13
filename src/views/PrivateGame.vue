<template>
  <GameBase
    :colorMain="colorMain"
    :colorSecond="colorSecond"
    :logged="logged"
    :username="username"
  ></GameBase>
</template>
<script>
let socket;
let timerInterval;
import GameBase from "@/components/GameBase";
import io from "socket.io-client";
import router from "../router";
export default {
  name: "CasualGame",
  components: { GameBase },
  props: ["logged", "username", "colorMain", "colorSecond"],
  data() {
    return {
      guestNames: [
        "Mango Wondervale",
        "Flamo Cedarspeck",
        "Sneezy Dapplebees",
        "Petal Hazelberry",
        "Aed Crystalwax",
        "Novus Quickriver",
        "Astro Pumpkinsparkle",
        "Indi Candlestorm",
        "Lapis Tumbleswirls",
        "Ridge Stardew",
        "Flare Applemuse",
        "Cadmi Airriver",
        "Fauna Brambledove",
        "Calic Beechweather",
        "Erissa Applesplash",
        "Wispa Rainbowshine",
        "Vinca Grayswamp",
        "Amethyst Shinytwirls",
        "Lulu Treebottom",
        "Rosa Tulipshine",
        "Nimbus Blueroot",
        "Sunset Blackpuff",
        "Pyro Magichorn",
        "Tarragon Wildwhirl",
        "Snowflake Greyflower",
        "Albedo Mountainbees",
        "Basil Twistyclover",
        "Starfish Brambletwinkle",
        "Tangy Bitterlace",
        "Thicket Rumplespirit",
      ],
    };
  },
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

    let guestNames = this.guestNames;

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
    socket = io("/p/game");

    // Global room token
    let roomID;
    let queryString = new URLSearchParams(window.location.search);
    let typeOfGame = queryString.get("type");
    roomID = queryString.get("roomID");

    document.getElementById("timeOne").innerHTML =
      typeOfGame === "5min" ? "5:00" : typeOfGame === "10min" ? "10:00" : "∞";
    document.getElementById("timeSecond").innerHTML =
      typeOfGame === "5min" ? "5:00" : typeOfGame === "10min" ? "10:00" : "∞";

    socket.emit("gameJoined", roomID, this.username);

    if (this.logged) {
      socket.emit("loggedUser", this.username);
    }

    socket.on("roomMissing", function() {
      router.push("/404");
    });
    socket.on("gameBegun", function(startingPlayer, nicks) {
      // setting nicknames
      delete nicks[socket.id];
      if (nicks[Object.keys(nicks)[0]] === "") {
        // Player is a guest
        let randNameIndex = Math.round(Math.random() * (guestNames.length - 1));
        console.log(randNameIndex);
        console.log(guestNames);
        document.getElementById("playerSecond").innerHTML =
          guestNames[randNameIndex];
      } else {
        // Player is logged in
        document.getElementById("playerSecond").innerHTML =
          nicks[Object.keys(nicks)[0]];
      }

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
        document.getElementById("winText").innerHTML = "You've won!";
      } else {
        let enemyName = document.getElementById("playerSecond").innerHTML;
        document.getElementById("winText").innerHTML = `${enemyName} has won!`;
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
