(function() {
  let tempRound = 0;

  const canvas = document.getElementById("gameCanvas");
  const ctx = canvas.getContext("2d");

  const sett = updateSettings();

  drawGameboard();
  generateGridOverlay();

  function generateGridOverlay() {
    const fragment = document.createDocumentFragment();
    const grid = document.getElementById("gridOverlay");
    for (let x = 0; x < sett.gridColumns * sett.gridRows; x++) {
      const gridCell = document.createElement("div");
      gridCell.style.width = sett.cellSize - sett.gridLineWidth + "px";
      gridCell.style.height = sett.cellSize - sett.gridLineWidth + "px";
      // gridCell.style.backgroundColor = "#e70064";
      gridCell.style.cursor = "pointer";
      gridCell.id = String(x);
      gridCell.classList.add("overlayCell");
      fragment.appendChild(gridCell);
    }
    grid.appendChild(fragment);
  }

  function updateSettings() {
    let dpi = window.devicePixelRatio;
    let sectionDimensions = document.getElementById("gameContainer");
    let navbarHeight = document.getElementById("navbar").offsetHeight;
    let smallerDimension =
      sectionDimensions.clientWidth > sectionDimensions.clientHeight
        ? sectionDimensions.clientHeight
        : sectionDimensions.clientWidth;

    return {
      dpi: dpi,
      canvasWidth: smallerDimension - navbarHeight,
      canvasHeight: smallerDimension - navbarHeight,
      gridLineWidth: document.body.clientWidth < 1400 ? 5 : 10,
      circleLineWidth: document.body.clientWidth < 1400 ? 4 : 6,
      darkmode: false,
      colors: {
        primary: mixColors([255, 255, 255, 1], [58, 134, 255, 1]),
        secondary: mixColors([255, 255, 255, 1], [255, 0, 110, 1]),
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
  }

  function drawGameboard() {
    canvas.width = sett.canvasWidth * sett.dpi;
    canvas.height = sett.canvasHeight * sett.dpi;

    ctx.strokeStyle = sett.colors.stroke;

    ctx.lineWidth = sett.gridLineWidth;

    let nX = sett.gridColumns;
    let nY = sett.gridRows;
    let size = canvas.width / nX;
    sett.cellSize = size;
    let pX = 0;
    let pY = 0;
    let pL = 0;
    let pT = 0;
    let pR = 0;
    let pB = 0;

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

  function mixColors(bgColor, fwColor) {
    let [r1, g1, b1, o1] = bgColor;
    let [r2, g2, b2, o2] = fwColor;

    const r3 = r1 * (1 - o2) + r2 * o2;
    const g3 = g1 * (1 - o2) + g2 * o2;
    const b3 = b1 * (1 - o2) + b2 * o2;
    return `rgba(${r3},${g3},${b3},1)`;
  }
})();
