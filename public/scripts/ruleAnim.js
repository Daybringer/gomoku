"use strict"
var GLOBAL_INTERVAR;
var GLOBAL_ANIM_STOP_R;
var TEMP_TIME;
var CAROUSEL_POS = 0;
var sett = setGameSett();

document.getElementById("arrow_left").addEventListener("click", function () {
  if (CAROUSEL_POS === 0) {
    CAROUSEL_POS = 1;
  } else {
    CAROUSEL_POS -= 1;
  }
  clearTimeout(TEMP_TIME);
  clearInterval(GLOBAL_INTERVAR);
  TEMP_TIME = setTimeout(() => { setView() }, 100);
});

document.getElementById("arrow_right").addEventListener("click", function () {
  if (CAROUSEL_POS === 1) {
    CAROUSEL_POS = 0;
  } else {
    CAROUSEL_POS += 1;
  }
  clearTimeout(TEMP_TIME);
  clearInterval(GLOBAL_INTERVAR);
  TEMP_TIME = setTimeout(() => { setView() }, 100);
});

function setGameSett() {
  const canvas = document.getElementById('rulesAnimation');
  const ctx = canvas.getContext('2d');

  const sectionDimensions = document.getElementById("home-section").getBoundingClientRect();
  const navbarHeight = document.getElementById("navbar").offsetHeight;
  const c_width = sectionDimensions.width / 2;
  const c_height = (sectionDimensions.height - navbarHeight) / 2;

  // Setting number of  based on resolution
  const size = (sectionDimensions.width < 1400) ? 40 : 50;
  const gridLineWidth = (sectionDimensions.width < 1400) ? 5 : 10;
  const circleLineWidth = (sectionDimensions.width < 1400) ? 4 : 6;
  // Darkmode
  const darkmode_on = false;
  const colors = {
    primary: mixColors([255, 255, 255, 1], [58, 134, 255, 1]),
    secondary: mixColors([255, 255, 255, 1], [255, 0, 110, 1]),
    primaryDark: mixColors([255, 255, 255, 1], [58, 134, 255, 0.45]),
    secondaryDark: mixColors([255, 255, 255, 1], [255, 0, 110, 0.45]),
  }

  return {
    colors,
    darkmode_on,
    circleLineWidth,
    gridLineWidth,
    size,
    c_width,
    c_height,
    canvas,
    ctx
  }
}

function drawGameboard() {

  const { c_height, c_width, darkmode_on, gridLineWidth, canvas, ctx, size } = sett;

  canvas.height = c_height;
  canvas.width = c_width;

  ctx.strokeStyle = 'rgba(227, 227, 227, 0.8)';
  if (darkmode_on) ctx.strokeStyle = 'red';

  ctx.lineWidth = gridLineWidth;



  let nX = Math.floor(c_width / size) - 0;
  sett.nX = nX;
  let nY = Math.floor(c_height / size) - 0;
  sett.nY = nY;
  let pX = c_width - nX * size;
  sett.pX = pX;
  let pY = c_height - nY * size;
  sett.pY = pY;
  let pL = Math.ceil(pX / 2) - 0.5;
  sett.pL = pL;
  let pT = Math.ceil(pY / 2) - 0.5;
  sett.pT = pT;
  let pR = c_width - nX * size - pL;
  sett.pR = pR;
  let pB = c_height - nY * size - pT;
  sett.pB = pB;

  ctx.beginPath();
  for (var x = pL; x <= c_width - pR; x += size) {
    ctx.moveTo(x, pT);
    ctx.lineTo(x, c_height - pB);
  }
  for (var y = pT; y <= c_height - pB; y += size) {
    ctx.moveTo(pL - gridLineWidth / 2, y);
    ctx.lineTo(c_width - pR + gridLineWidth / 2, y)
  }
  ctx.stroke();
  ctx.translate(-0.5, -0.5);
  return canvas;
}

function setView() {
  const { canvas } = sett;
  clearCanvas(canvas);
  clearInterval(GLOBAL_INTERVAR);
  switch (CAROUSEL_POS) {
    case 0:
      alternateRule();
      break;

    case 1:
      winnerRule();
      break;
  }
}



function winnerRule() {
  document.getElementById("rule-text").innerText = "Player wins by having 5 or more symbols in a row.";
  const { nX, nY } = sett;
  const hX = Math.floor(nX / 2);
  const hY = Math.floor(nY / 2);
  const posArr = [[0, 0], [1, 1], [1, 0], [0, 1], [2, 0], [1, 2], [3, 0], [-1, 0], [4, 0]];
  let x = 0
  GLOBAL_INTERVAR = setInterval(() => {
    if (!GLOBAL_ANIM_STOP_R) {
      GLOBAL_ANIM_STOP_R = true;
      if (x % 2 === 0) {
        placeCircle(hX + posArr[x][0], hY + posArr[x][1]);
      } else {
        placeCross(hX + posArr[x][0], hY + posArr[x][1]);
      }
      x++
      if (!(x < posArr.length)) clearInterval(GLOBAL_INTERVAR);
    }
  }, 1500)
}

function alternateRule() {
  document.getElementById("rule-text").innerText = "Players alternate turns placing their symbols.";
  const { nX, nY } = sett;
  const hX = Math.floor(nX / 2);
  const hY = Math.floor(nY / 2);
  const posArr = [[0, 0], [1, 1], [1, 0]];
  let x = 0
  let GLOBAL_INTERVAR = setInterval(() => {
    if (x % 2 === 0) {
      placeCircle(hX + posArr[x][0], hY + posArr[x][1]);
    } else {
      placeCross(hX + posArr[x][0], hY + posArr[x][1]);
    }
    x++
    if (!(x < posArr.length)) clearInterval(GLOBAL_INTERVAR
    );
  }, 1500)
}

function mixColors(bgColor, fwColor) {
  let [r1, g1, b1, o1] = bgColor;
  let [r2, g2, b2, o2] = fwColor;

  const r3 = r1 * (1 - o2) + r2 * o2;
  const g3 = g1 * (1 - o2) + g2 * o2;
  const b3 = b1 * (1 - o2) + b2 * o2;
  return `rgba(${r3},${g3},${b3},1)`
}

function clearCanvas(canvas) {
  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawGameboard();
}

function calcPosition(gridX, gridY) {
  const { size, gridLineWidth, pL, pT } = sett;
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
    GLOBAL_ANIM_STOP_R = false;
  }
}

function placeCircle(gX, gY) {
  const { ctx, colors, circleLineWidth, gridLineWidth, size } = sett;
  let curPerc = 0
  const { x, y, radius } = calcPosition(gX, gY);
  ctx.lineWidth = circleLineWidth;
  ctx.strokeStyle = colors.primary
  const offCenter = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) - ctx.lineWidth / 2 - (20 / gridLineWidth);
  const clearSize = size - gridLineWidth;

  animateCircle(x, y, radius, curPerc, offCenter, clearSize);
}

function animateCircle(x, y, radius, curPerc, offCenter, clearSize) {
  const { ctx } = sett;
  ctx.clearRect(x - offCenter - 3, y - offCenter - 3, clearSize, clearSize);
  ctx.beginPath();
  ctx.arc(x, y, radius, 0, ((Math.PI * 2) * curPerc));
  ctx.stroke();
  curPerc += 0.015;
  if (curPerc <= 1.02) {
    requestAnimationFrame(function () {
      animateCircle(x, y, radius, curPerc, offCenter, clearSize)
    });
  } else {
    GLOBAL_ANIM_STOP_R = false;
  }
}


function placeCross(gX, gY) {
  const { ctx, colors, gridLineWidth, size } = sett;
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
  const { ctx } = sett;
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
  const { ctx } = sett;
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
    GLOBAL_ANIM_STOP_R = false;
  }
};

drawGameboard();
if (window.location.hash === "#rules") setView();
window.onhashchange = () => {
  if (window.location.hash === "#rules") {
    setView();
  }
}

// window.addEventListener('resize', () => {
//   clearInterval(GLOBAL_INTERVAR);
//   clearTimeout(GLOBAL_TIMEOUT);
//   GLOBAL_ANIM_STOP_R = false;

//   GLOBAL_TIMEOUT = setTimeout(() => {
//     const canvas = document.getElementById('rulesAnimation');
//     const ctx = canvas.getContext('2d');
//     ctx.clearRect(0, 0, canvas.width, canvas.height);
//     init()
//   }, 4000);
// });