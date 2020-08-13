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
          <h1 id="winText"></h1>
          <router-link to="/q/search" id="winButton">Find new game</router-link>
        </div>
      </div>
    </div>
    <div class="game_sub" id="timer_game_sub">
      <div id="timer_game_sub_sub1">
        <p id="playerOne">You</p>
        <p id="timeOne">5:00</p>
      </div>
      <div id="timer_game_sub_sub2">
        <p id="playerSecond"></p>
        <p id="timeSecond">5:00</p>
      </div>
      <router-link class="leave-button" to="/">
        Surrender
      </router-link>
    </div>
  </div>
</template>
<script>
export default {
  name: "GameBase",
  components: {},
  props: ["logged", "username", "colorMain", "colorSecond"],
  computed: {
    cssVars() {
      return {
        "--main": this.colorMain,
        "--second": this.colorSecond,
      };
    },
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
  transform: translate(-50%, -50%);
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
