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
  props: ["logged"],
  data() {
    return {};
  },
  computed: {},
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
        gridLineWidth: 5,
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

    function generateGridOverlay() {
      const fragment = document.createDocumentFragment();
      const grid = document.getElementById("gridOverlay");
      for (let x = 0; x < sett.gridColumns * sett.gridRows; x++) {
        const gridCell = document.createElement("div");
        gridCell.style.width =
          sett.cellSize / sett.dpi - sett.gridLineWidth + "px";
        gridCell.style.height =
          sett.cellSize / sett.dpi - sett.gridLineWidth + "px";
        gridCell.style.backgroundColor = "#e70064";
        gridCell.style.cursor = "pointer";
        gridCell.id = String(x);
        gridCell.classList.add("overlayCell");
        fragment.appendChild(gridCell);
      }
      grid.appendChild(fragment);
    }
  },
};
</script>
