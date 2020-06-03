(function () {
  let tempRound = 0;

  const canvas = document.getElementById('gameCanvas');
  const ctx = canvas.getContext('2d');

  const sett = updateSettings();

  drawGameboard();
  generateGridOverlay();

  function gameClicked(gridCell) {
    const row = Math.floor(gridCell.id / 15) + 1;
    const column = (gridCell.id % 15) + 1;
    gridCell.style.cursor = "default";
    if (tempRound % 2 === 1) {
      placeCross(column, row);
      tempRound = 0;
    } else {
      placeCircle(column, row);
      tempRound = 1;
    }
  }

  function generateGridOverlay() {
    const fragment = document.createDocumentFragment();
    const grid = document.getElementById("gridOverlay");
    for (let x = 0; x < (sett.gridColumns * sett.gridRows); x++) {
      const gridCell = document.createElement("div");
      gridCell.style.width = (sett.cellSize - sett.gridLineWidth) + "px";
      gridCell.style.height = (sett.cellSize - sett.gridLineWidth) + "px";
      // gridCell.style.backgroundColor = "#e70064";
      gridCell.style.cursor = "pointer";
      gridCell.id = String(x);
      gridCell.classList.add("overlayCell");
      // gridCell.addEventListener("click", () => {
      //   gameClicked(gridCell);
      // });
      fragment.appendChild(gridCell);
    }
    grid.appendChild(fragment);
  }

  function updateSettings() {
    let sectionDimensions = document.getElementById("gameContainer");
    let navbarHeight = document.getElementById("navbar").offsetHeight;
    let smallerDimension = (sectionDimensions.clientWidth > sectionDimensions.clientHeight) ? sectionDimensions.clientHeight : sectionDimensions.clientWidth;

    return {
      canvasWidth: smallerDimension - navbarHeight,
      canvasHeight: smallerDimension - navbarHeight,
      gridLineWidth: (document.body.clientWidth < 1400) ? 5 : 10,
      circleLineWidth: (document.body.clientWidth < 1400) ? 4 : 6,
      darkmode: false,
      colors: {
        primary: mixColors([255, 255, 255, 1], [58, 134, 255, 1]),
        secondary: mixColors([255, 255, 255, 1], [255, 0, 110, 1]),
        stroke: 'rgba(227, 227, 227, 1)',
        primaryDark: mixColors([255, 255, 255, 1], [58, 134, 255, 0.45]),
        secondaryDark: mixColors([255, 255, 255, 1], [255, 0, 110, 0.45]),
        strokeDark: ""
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
    }
  }

  function drawGameboard() {

    canvas.width = sett.canvasWidth;
    canvas.height = sett.canvasHeight;

    ctx.strokeStyle = sett.colors.stroke;

    ctx.lineWidth = sett.gridLineWidth;

    let nX = sett.gridColumns;
    let nY = sett.gridRows;
    let size = Math.round(canvas.width / nX);
    sett.cellSize = size;
    let pX = 0
    let pY = 0
    let pL = 0
    let pT = 0
    let pR = 0
    let pB = 0

    ctx.beginPath();
    for (let x = 0; x <= canvas.width; x += size) {
      ctx.moveTo(x, pT);
      ctx.lineTo(x, canvas.height);
    }
    for (let y = 0; y <= canvas.height; y += size) {
      ctx.moveTo(0 - sett.gridLineWidth / 2, y);
      ctx.lineTo(canvas.width + sett.gridLineWidth / 2, y)
    }
    ctx.stroke();
    ctx.translate(-0.5, -0.5);
  }


  function mixColors(bgColor, fwColor) {
    let [r1, g1, b1, o1] = bgColor;
    let [r2, g2, b2, o2] = fwColor;

    const r3 = r1 * (1 - o2) + r2 * o2;
    const g3 = g1 * (1 - o2) + g2 * o2;
    const b3 = b1 * (1 - o2) + b2 * o2;
    return `rgba(${r3},${g3},${b3},1)`
  }

  function calcPosition(gridX, gridY) {
    return {
      x: (gridX * sett.cellSize) - (Math.floor(sett.cellSize / 2)) + sett.pL,
      y: (gridY * sett.cellSize) - (Math.floor(sett.cellSize / 2)) + sett.pT,
      radius: Math.floor(sett.cellSize / 2) - sett.gridLineWidth
    };
  }

  function placeCircle(gX, gY) {
    const { x, y, radius } = calcPosition(gX, gY);
    ctx.lineWidth = Math.floor(sett.gridLineWidth / 2);
    ctx.strokeStyle = sett.colors.primary
    const offCenter = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) - ctx.lineWidth / 2 - (20 / sett.gridLineWidth);
    const clearSize = sett.cellSize - sett.gridLineWidth;

    const curPerc = 0
    animateCircle(x, y, radius, curPerc, offCenter, clearSize);
  }

  function animateCircle(x, y, radius, curPerc, offCenter, clearSize) {
    ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
    ctx.beginPath();
    ctx.arc(x, y, radius, 0, ((Math.PI * 2) * curPerc));
    ctx.stroke();
    curPerc += 0.045;
    if (curPerc <= 1.12) {
      requestAnimationFrame(function () {
        animateCircle(x, y, radius, curPerc, offCenter, clearSize)
      });
    } else {
    }
  }


  function placeCross(gX, gY) {
    const { x, y, radius } = calcPosition(gX, gY);

    const offCenter = Math.sqrt(Math.pow(radius, 2) + Math.pow(radius, 2)) - ctx.lineWidth / 2 - (20 / sett.gridLineWidth);
    const clearSize = sett.cellSize - sett.gridLineWidth;
    ctx.strokeStyle = sett.colors.secondary;
    ctx.lineWidth = Math.floor(sett.gridLineWidth / 2)

    animateCrossL(x, y, radius, -1, offCenter, clearSize);
    // animateCrossR(x, y, radius, -1, offCenter, clearSize);
  }

  function animateCrossL(x, y, radius, curPerc, offCenter, clearSize) {
    ctx.clearRect(x - offCenter - 2, y - offCenter - 2, clearSize, clearSize);
    ctx.beginPath();
    ctx.moveTo(x - offCenter, y - offCenter);
    ctx.lineTo(x + (offCenter * curPerc), y + (offCenter * curPerc));
    ctx.stroke();
    curPerc += 0.2;
    if (curPerc < 1.1) {
      requestAnimationFrame(function () {
        animateCrossL(x, y, radius, curPerc, offCenter, clearSize)
      });
    } else {
      animateCrossR(x, y, radius, -1, offCenter, clearSize);
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
    curPerc += 0.2;
    if (curPerc < 1.1) {
      requestAnimationFrame(function () {
        animateCrossR(x, y, radius, curPerc, offCenter, clearSize)
      });
    }
  };
}());