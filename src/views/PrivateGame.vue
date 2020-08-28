<template>
  <GameBase
    :colorMain="colorMain"
    :colorSecond="colorSecond"
    :logged="logged"
    :username="username"
    :enemyName="enemyName"
    :myTime="myTime"
    :enTime="enTime"
    :gameState="gameState"
    :coinSide="coinSide"
    :typeOfGame="typeOfGame"
  ></GameBase>
</template>
<script>
let socket;
import GameBase from "@/components/GameBase";
import io from "socket.io-client";
import router from "../router";
export default {
  name: "PrivateGame",
  components: { GameBase },
  props: ["logged", "username", "colorMain", "colorSecond"],
  data() {
    return {
      guestNames: ["Neon", "Amidala"],
      gameState: "base",
      enTime: "0:00",
      myTime: "0:00",
      timerInterval: null,
      mlTime: 0,
      enemyName: "Opponent",
      lastPosition: 0,
      coinSide: null,
      typeOfGame: "private",
      baseGameTime: (() => {
        let queryString = new URLSearchParams(window.location.search);
        return queryString.get("type");
      })(),
    };
  },
  computed: {
    roomID() {
      let queryString = new URLSearchParams(window.location.search);
      return queryString.get("roomID");
    },
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond,
      };
    },
  },
  methods: {
    timeChange(timerOn) {
      if (timerOn === "mine") {
        if (this.mlTime > 0) {
          this.mlTime = this.mlTime - 1000;
          //conversion for displaying the time
          let minutes = Math.floor(
            (this.mlTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          let seconds = Math.floor((this.mlTime % (1000 * 60)) / 1000);
          this.myTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        } else {
          clearInterval(this.timerInterval);
          this.myTime = "0:0";
        }
      } else {
        if (this.mlTime > 0) {
          this.mlTime = this.mlTime - 1000;
          //conversion for displaying the time
          let minutes = Math.floor(
            (this.mlTime % (1000 * 60 * 60)) / (1000 * 60)
          );
          let seconds = Math.floor((this.mlTime % (1000 * 60)) / 1000);
          this.enTime = `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
        } else {
          clearInterval(this.timerInterval);
          this.enTime = "0:0";
        }
      }
    },
    changeTimer(timerOn) {
      let activeTime = timerOn === "mine" ? this.myTime : this.enTime;
      let splitTime = activeTime.split(":");
      let min = Number(splitTime[0]);
      let sec = Number(splitTime[1]);
      this.mlTime = (min * 60 + sec) * 1000;
      this.timerInterval = setInterval(() => {
        this.timeChange(timerOn);
      }, 1000);
    },
    updateTimers(round, times, socketID, playersArr) {
      let myTime = times[playersArr.indexOf(socketID)][0];
      this.myTime = `${Math.floor(myTime / 60)}:${
        Math.round(myTime % 60) < 10 ? "0" : ""
      }${Math.round(myTime % 60)}`;

      let enemyTime = times[Math.abs(playersArr.indexOf(socketID) - 1)][0];
      this.enTime = `${Math.floor(enemyTime / 60)}:${
        Math.floor(enemyTime % 60) < 10 ? "0" : ""
      }${Math.floor(enemyTime % 60)}`;
    },
    gameClick(el) {
      const row = Math.floor(el.id / 15);
      const column = el.id % 15;
      socket.emit("game click", this.roomID, row, column);
    },
  },
  mounted() {
    // I can't VUE :) => fixin' that I can't relate from data() prop to data() prop
    this.myTime =
      this.baseGameTime === "5min"
        ? "5:00"
        : this.baseGameTime === "10min"
        ? "10:00"
        : "∞";
    this.enTime =
      this.baseGameTime === "5min"
        ? "5:00"
        : this.baseGameTime === "10min"
        ? "10:00"
        : "∞";

    document.getElementsByClassName("overlayCell").forEach((el) => {
      el.addEventListener("click", () => {
        this.gameClick(el);
      });
    });

    // Saving global socket instance
    socket = io("/p/game");

    socket.emit("gameJoined", this.roomID, this.username);

    if (this.logged) {
      socket.emit("loggedUser", this.username);
    }
    socket.on("roomMissing", function() {
      router.push("/404");
    });
    socket.on("gameBegun", (startingPlayer, nicks) => {
      this.gameState = "preBase";

      // setting nicknames
      delete nicks[socket.id];
      if (nicks[Object.keys(nicks)[0]] === "") {
        // Player is a guest
        let randNameIndex = Math.round(
          Math.random() * (this.guestNames.length - 1)
        );
        this.enemyName = this.guestNames[randNameIndex];
      } else {
        // Player is logged in
        this.enemyName = nicks[Object.keys(nicks)[0]];
      }

      // Spinning coin

      if (socket.id === startingPlayer) {
        this.coinSide = "heads";
        setTimeout(() => {
          if (this.baseGameTime !== "no_limit") this.changeTimer("mine");
          document.getElementById("myStroke").style.strokeOpacity = "0.362404";
          this.gameState = "base";
        }, 3500);
      } else {
        this.coinSide = "tails";
        setTimeout(() => {
          if (this.baseGameTime !== "no_limit") this.changeTimer("enemy");
          document.getElementById("enStroke").style.strokeOpacity = "0.362404";
          this.gameState = "base";
        }, 3500);
      }
    });

    socket.on("click success", (socketID, round, x, y, times, playersArr) => {
      clearInterval(this.timerInterval);

      // Syncing local time with time from server
      if (this.baseGameTime !== "no_limit")
        this.updateTimers(round, times, socket.id, playersArr);
      let targetDiv = document.getElementById(y + x * 15);
      if (socketID == socket.id) {
        if (round % 2 === 0) {
          let circleCp = document
            .getElementById("svgCircleOrigin")
            .cloneNode(true);

          circleCp.id = `circle${targetDiv.id}`;
          circleCp.classList.add("svgCC");
          targetDiv.appendChild(circleCp);
        } else {
          let crossCp = document
            .getElementById("svgCrossOrigin")
            .cloneNode(true);

          crossCp.id = `cross${targetDiv.id}`;
          crossCp.classList.add("svgCC");
          targetDiv.appendChild(crossCp);
        }
        document.getElementById("enStroke").style.strokeOpacity = "0.762404";
        document.getElementById("myStroke").style.strokeOpacity = "0.362404";
        if (this.baseGameTime !== "no_limit") this.changeTimer("enemy");
      } else {
        if (round % 2 === 0) {
          // add secondary colors
          let circleCp = document
            .getElementById("svgCircleOrigin")
            .cloneNode(true);

          circleCp.id = `circle${targetDiv.id}`;
          circleCp.classList.add("svgCC");
          targetDiv.appendChild(circleCp);
        } else {
          let crossCp = document
            .getElementById("svgCrossOrigin")
            .cloneNode(true);

          crossCp.id = `cross${targetDiv.id}`;
          crossCp.classList.add("svgCC");
          targetDiv.appendChild(crossCp);
        }
        document.getElementById("myStroke").style.strokeOpacity = "0.762404";
        document.getElementById("enStroke").style.strokeOpacity = "0.362404";
        if (this.baseGameTime !== "no_limit") this.changeTimer("mine");
      }

      // Adding border to last draw
      document.getElementById(this.lastPosition).style.outline = "none";
      document.getElementById(targetDiv.id).style.outline = "3px solid #363636";
      this.lastPosition = targetDiv.id;
    });

    socket.on("win", (socketID) => {
      clearInterval(this.timerInterval);
      if (socket.id === socketID) {
        this.gameState = "won";
      } else {
        this.gameState = "lost";
      }
    });

    socket.on("playerLeft", () => {
      clearInterval(this.timerInterval);
      this.gameState = "left";
    });
  },
  beforeDestroy() {
    clearInterval(this.timerInterval);
    socket.close();
  },
};
</script>
