"use strict"

function init() {
  let GLOBAL_INTERVAL;
  let GLOBAL_TIMEOUT;
  let GLOBAL_ANIM_STOP;
  const canvas = document.getElementById('gameAnimation');
  const ctx = canvas.getContext('2d');

  const sectionDimensions = document.getElementById("home-section").getBoundingClientRect();
  const navbarHeight = document.getElementById("navbar").offsetHeight;
  canvas.width = sectionDimensions.width;
  canvas.height = (sectionDimensions.height - navbarHeight);

  const primarColor = hexToRgbA(document.getElementById("colorMain").innerHTML);
  const secondaryColor = hexToRgbA(document.getElementById("colorSecond").innerHTML);

  // Setting number of  based on resolution
  const size = (sectionDimensions.width < 1400) ? 40 : 50;
  const gridLineWidth = (sectionDimensions.width < 1400) ? 5 : 10;
  const circleLineWidth = (sectionDimensions.width < 1400) ? 4 : 6;
  // Darkmode
  const darkmode_on = false;
  const colors = {
    primary: mixColors([255, 255, 255, 1], primarColor),
    secondary: mixColors([255, 255, 255, 1], secondaryColor),
    primaryDark: mixColors([255, 255, 255, 1], primarColor),
    secondaryDark: mixColors([255, 255, 255, 1], secondaryColor)
  }
  // const magicOffset = (sectionDimensions.width < 1400) ? 2.5 : 0;


  ctx.strokeStyle = 'rgba(227, 227, 227, 0.5)';
  if (darkmode_on) ctx.strokeStyle = 'red';

  ctx.lineWidth = gridLineWidth;



  let nX = Math.floor(canvas.width / size) - 0;
  let nY = Math.floor(canvas.height / size) - 0;
  let pX = canvas.width - nX * size;
  let pY = canvas.height - nY * size;
  let pL = Math.ceil(pX / 2) - 0.5;
  let pT = Math.ceil(pY / 2) - 0.5;
  let pR = canvas.width - nX * size - pL;
  let pB = canvas.height - nY * size - pT;

  ctx.beginPath();
  for (var x = pL; x <= canvas.width - pR; x += size) {
    ctx.moveTo(x, pT);
    ctx.lineTo(x, canvas.height - pB);
  }
  for (var y = pT; y <= canvas.height - pB; y += size) {
    ctx.moveTo(pL - gridLineWidth / 2, y);
    ctx.lineTo(canvas.width - pR + gridLineWidth / 2, y)
  }
  ctx.stroke();
  ctx.translate(-0.5, -0.5);

  const gameAnim1 = [[5, 1], [6, 2], [7, 3], [5, 3], [7, 1], [4, 4], [6, 4], [3, 5], [2, 6],
  [3, 3], [4, 2], [5, 5], [2, 2], [6, 6], [7, 7], [4, 5], [6, 5], [2, 5], [1, 5], [4, 6], [4, 7], [5, 6], [7, 6], [5, 4], [5, 7], [5, 2]];
  const gameAnim2 = [[4, 4], [4, 5], [5, 4], [6, 4], [5, 5], [5, 6], [3, 3], [6, 6], [2, 2], [1, 1], [4, 3], [6, 7], [6, 5], [7, 8], [8, 9], [3, 4]];
  const gameAnim3 = [[3, 3], [4, 4], [5, 3], [4, 2], [4, 3], [2, 3], [6, 3], [7, 3], [5, 2], [7, 4], [5, 4], [5, 5], [3, 2], [2, 1], [3, 4], [3, 1], [2, 5], [1, 6], [6, 1]];
  // const gameAnimSet = [[[7, 6], [...gameAnim1]], [[8, 9], [...gameAnim2]], [[10, 10], [...gameAnim3]]];

  const gameSet = [{
    gameArr: [...gameAnim1],
    winStroke: [[5, 2], [5, 6]],
    width: 6,
    height: 7
  },
  {
    gameArr: [...gameAnim2],
    winStroke: [[3, 4], [7, 8]],
    width: 8,
    height: 9
  }, {
    gameArr: [...gameAnim3],
    winStroke: [[2, 5], [6, 1]],
    width: 7,
    height: 6
  }]



  let turn = 0;
  const gamePlan = {
    indexesOfPlayed: [],
    playedPos: [[Math.floor(nY / 2), Math.floor(nX / 2), 1, 1]],
    position: [0, 0],
    state: "done",
    indexOfCurr: 0
  };

  GLOBAL_INTERVAL = setInterval(() => {

    if (gamePlan.state === "done") {
      gamePlan.indexOfCurr = pickGamePlan(gameSet.length, gamePlan.indexesOfPlayed);
      if (gamePlan.indexOfCurr === -1) {
        resetCanvas();
      } else {
        const position = generetePosition(gameSet[gamePlan.indexOfCurr], gamePlan.playedPos);
        if (position === -1) {
          resetCanvas();
        } else {
          gamePlan.playedPos.push([position[0], position[1], gameSet[gamePlan.indexOfCurr].width, gameSet[gamePlan.indexOfCurr].height]);
          gamePlan.state = "running";
          gamePlan.position = position;
          gamePlan.winStroke = gameSet[gamePlan.indexOfCurr].winStroke;
        }
      }

    } else if (gamePlan.state === "running" && !GLOBAL_ANIM_STOP) {
      if (document.hasFocus()) {
        makeTurn(gameSet[gamePlan.indexOfCurr].gameArr);
      }
    }
  }, 300);

  function hexToRgbA(hex) {
    var c;
    if (/^#([A-Fa-f0-9]{3}){1,2}$/.test(hex)) {
      c = hex.substring(1).split('');
      if (c.length == 3) {
        c = [c[0], c[0], c[1], c[1], c[2], c[2]];
      }
      c = '0x' + c.join('');
      return [(c >> 16) & 255, (c >> 8) & 255, c & 255, 0.35];
    }
    throw new Error('Bad Hex');
  }

  function mixColors(bgColor, fwColor) {
    let [r1, g1, b1, o1] = bgColor;
    let [r2, g2, b2, o2] = fwColor;

    const r3 = r1 * (1 - o2) + r2 * o2;
    const g3 = g1 * (1 - o2) + g2 * o2;
    const b3 = b1 * (1 - o2) + b2 * o2;
    return `rgba(${r3},${g3},${b3},1)`
  }

  function pickGamePlan(nPlans, usedPlans) {
    while (true) {
      let tempIx = Math.floor(Math.random() * nPlans);
      if (!usedPlans.includes(tempIx)) {
        gamePlan.indexesOfPlayed.push(tempIx);
        return tempIx;
      } else if (nPlans === usedPlans.length) {
        return -1;
      }
    }
  }

  function generetePosition(gameObj, oldPos) {
    for (let x = 0; x < 100; x++) {
      let xRand = Math.abs(Math.round(Math.random() * (nX - gameObj.width)));
      let yRand = Math.abs(Math.round(Math.random() * (nY - gameObj.height)));
      // if (xRand < 0 || yRand < 0) return -1;
      if (checkIfPosAvailable(xRand, yRand, oldPos, gameObj)) return [xRand, yRand];
    }
    return -1;
  }

  function checkIfPosAvailable(posX, posY, oldPos, gameObj) {
    for (let x = 0; x < oldPos.length; x++) {
      if (!((((posX + gameObj.width) < oldPos[x][0]) || (posX > (oldPos[x][0] + oldPos[x][2]))) ||
        (((posY + gameObj.height) < oldPos[x][1]) || (posY > (oldPos[x][1] + oldPos[x][3]))))) {

        return false;
      }
    }
    return true;
  }

  function resetCanvas() {
    gamePlan.state = "resetted";
    clearInterval(GLOBAL_INTERVAL);
    clearTimeout(GLOBAL_TIMEOUT);

    GLOBAL_TIMEOUT = setTimeout(() => {
      const canvas = document.getElementById('gameAnimation');
      const ctx = canvas.getContext('2d');
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      init()
    }, 4000);
  }

  function makeTurn(game) {
    GLOBAL_ANIM_STOP = true;
    const [xOff, yOff] = gamePlan.position;
    if (document.hasFocus()) {
      if (turn < game.length) {

        if (turn % 2 === 0) {
          placeCircle(game[turn][0] + xOff, game[turn][1] + yOff);
        } else {
          placeCross(game[turn][0] + xOff, game[turn][1] + yOff);
        }
        turn++
      } else {
        placeLine();
        turn = 0;
        gamePlan.position = [0, 0];
      }
    }
  }

  function calcPosition(gridX, gridY) {
    return {
      x: (gridX * size) - (Math.floor(size / 2)) + pL,
      y: (gridY * size) - (Math.floor(size / 2)) + pT,
      radius: Math.floor(size / 2) - gridLineWidth
    };
  }

  function placeLine() {
    if (turn % 2 === 1) {
      ctx.strokeStyle = colors.primaryDark;
    } else {
      ctx.strokeStyle = colors.secondaryDark;
    }

    const [fromXGrid, fromYGrid] = gamePlan.winStroke[0];
    const [toXGrid, toYGrid] = gamePlan.winStroke[1];
    const { x: fromX, y: fromY, radius } = calcPosition(fromXGrid + gamePlan.position[0], fromYGrid + gamePlan.position[1]);
    const { x: toX, y: toY } = calcPosition(toXGrid + gamePlan.position[0], toYGrid + gamePlan.position[1]);

    const offCenter = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) - ctx.lineWidth / 2 - (20 / gridLineWidth);

    const difX = (toX - fromX);
    const difY = (toY - fromY);

    let xPositive, yPositive;
    if (difX !== 0 && difY !== 0) {
      if (difY < 0) {
        yPositive = [offCenter, -offCenter];
        xPositive = [-offCenter, offCenter];
      } else if (difY > 0) {
        yPositive = [-offCenter, offCenter];
        xPositive = [-offCenter, offCenter];
      }
    } else if (difY === 0) {
      yPositive = [0, 0];
      xPositive = [offCenter, offCenter];
    } else if (difX === 0) {
      yPositive = [-offCenter, offCenter];
      xPositive = [0, 0];
    }

    let step = 0;
    animateLine(fromX + xPositive[0], fromY + yPositive[0], toX + xPositive[1], toY + yPositive[1], step, difX, difY);
  }

  function animateLine(fX, fY, toX, toY, step, difX, difY) {
    ctx.beginPath();
    ctx.moveTo(fX, fY);
    ctx.lineTo(fX + (difX * (0.02)), fY + (difY * (0.02)));
    ctx.stroke();
    step += 0.01;
    if (step < 1.15) {
      requestAnimationFrame(function () {
        animateLine(fX + (difX * (0.01)), fY + (difY * (0.01)), toX, toY, step, difX, difY);
      });
    } else {
      GLOBAL_ANIM_STOP = false;
      gamePlan.state = "done";
    }
  }

  function placeCircle(gX, gY) {
    let curPerc = 0
    const { x, y, radius } = calcPosition(gX, gY);
    ctx.lineWidth = circleLineWidth;
    ctx.strokeStyle = colors.primary
    const offCenter = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) - ctx.lineWidth / 2 - (20 / gridLineWidth);
    const clearSize = size - gridLineWidth;

    animateCircle(x, y, radius, curPerc, offCenter, clearSize);
  }

  function animateCircle(x, y, radius, curPerc, offCenter, clearSize) {
    ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, ((Math.PI * 2) * curPerc));
    ctx.stroke();
    curPerc += 0.015;
    if (curPerc <= 1.02) {
      requestAnimationFrame(function () {
        animateCircle(x, y, radius, curPerc, offCenter, clearSize)
      });
    } else {
      GLOBAL_ANIM_STOP = false;
    }
  }


  function placeCross(gX, gY) {
    const { x, y, radius } = calcPosition(gX, gY);

    const offCenter = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) - ctx.lineWidth / 2 - (20 / gridLineWidth);
    const clearSize = size - gridLineWidth;
    ctx.strokeStyle = colors.secondary;


    animateCross(x, y, radius, -1, offCenter, clearSize);
    // animateCrossR(x, y, radius, -1, offCenter, clearSize);
  }

  function animateCross(x, y, radius, curPerc, offCenter, clearSize) {
    animateCrossL(x, y, radius, curPerc, offCenter, clearSize);
    setTimeout(() => {
      animateCrossR(x, y, radius, curPerc, offCenter, clearSize);
    }, 500);

  }

  function animateCrossL(x, y, radius, curPerc, offCenter, clearSize) {
    ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
    ctx.beginPath();
    ctx.moveTo(x - offCenter, y - offCenter);
    ctx.lineTo(x + (offCenter * curPerc), y + (offCenter * curPerc));
    ctx.stroke();
    curPerc += 0.1;
    if (curPerc < 1) {
      requestAnimationFrame(function () {
        animateCrossL(x, y, radius, curPerc, offCenter, clearSize)
      });
    }
  };

  function animateCrossR(x, y, radius, curPerc, offCenter, clearSize) {
    ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
    ctx.beginPath();
    ctx.moveTo(x - offCenter, y - offCenter);
    ctx.lineTo(x + (offCenter), y + (offCenter));
    ctx.moveTo(x + offCenter, y - offCenter);
    ctx.lineTo(x - (offCenter * curPerc), y + (offCenter * curPerc));
    ctx.stroke();
    curPerc += 0.1;
    if (curPerc < 1) {
      requestAnimationFrame(function () {
        animateCrossR(x, y, radius, curPerc, offCenter, clearSize)
      });
    } else {
      GLOBAL_ANIM_STOP = false;
    }
  };
  window.onresize = function () {
    if (window.location.pathname == "/") {
      console.log(window.location.pathname);
      clearInterval(GLOBAL_INTERVAL);
      clearTimeout(GLOBAL_TIMEOUT);
      // GLOBAL_ANIM_STOP = true;

      GLOBAL_TIMEOUT = setTimeout(() => {
        console.log("resized");
        for (let x = 0; x < 100; x++) {
          clearInterval(x);
        }
        const canvas = document.getElementById('gameAnimation');
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        init()
      }, 1500);
    }

  };


}

setTimeout(init, 100);

