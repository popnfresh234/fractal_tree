const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;
const COLORS = [
  'rgb(228,48,48)',
  'rgb(222,127,40)',
  'rgb(232,230,23)',
  'rgb(189,227,228)',
  'rgb(142, 183, 134)',
];

const floor = [];

const canvas = document.getElementById('fractal_canvas');
const leafCanvas = document.getElementById('leaf_canvas');

const leafCtx = leafCanvas.getContext('2d');
leafCanvas.width = window.innerWidth;
leafCanvas.height = window.innerHeight;
leafCtx.canvas.width = WIDTH;
leafCtx.canvas.height = HEIGHT;

const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

const MAX_TREES = 10;
const MAX_DEPTH = 8;
const FRAME_RATE = 5;
const BASE_COLOR = 'rgb(255, 255, 255)';
const BROWN = 'rgb(119, 81, 59)';
const GREEN = 'rgb(80, 127, 62)';

let branchesFinished = 0;
let treesCompleted = 0;
let leaves = [];

ctx.fillStyle = '#777777';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

function randomFactor(min, max) {
  return min + (max - min) * Math.random();
}


function randomInt(max) {
  return Math.floor(Math.random() * max);
}

const origin = {
  x: WIDTH / 2,
  y: HEIGHT,
  length: HEIGHT * randomFactor(0.1, 0.2),
  angle: -Math.PI / 2,
  angleIncrement: Math.PI / 8,
  randomAngleMax: 1.5,
  lineWidth: 10,
};

function interpolateColor(startColor, endColor, factor) {
  let stepFactor = factor;
  if (arguments.length < 3) {
    stepFactor = 0.5;
  }
  const result = startColor.slice();
  for (let i = 0; i < 3; i++) {
    result[i] = Math.round(result[i] + stepFactor * (endColor[i] - startColor[i]));
  }
  const colorObj = {
    r: result[0],
    g: result[1],
    b: result[2],
  };
  return colorObj;
}

function interpolateColors(color1, color2, steps) {
  const stepFactor = 1 / (steps - 1);
  const interpolatedColorArray = [];
  const startColor = color1.match(/\d+/g).map(Number);
  const endColor = color2.match(/\d+/g).map(Number);
  for (let i = 0; i < steps; i++) {
    interpolatedColorArray.push(interpolateColor(startColor, endColor, stepFactor * i));
  }
  return interpolatedColorArray.map(colorObj => (`rgb(${colorObj.r}, ${colorObj.g}, ${colorObj.b})`));
}

function buildWaypoints(startX, startY, endX, endY) {
  const waypoints = [];
  const dx = endX - startX;
  const dy = endY - startY;
  for (let i = 0; i < FRAME_RATE + 2; i++) {
    const x = startX + dx * i / FRAME_RATE;
    const y = startY + dy * i / FRAME_RATE;
    waypoints.push({ x, y });
  }
  return waypoints;
}

function dropLeaves() {
  let usedLeaves = [];
  leafCtx.clearRect(0, 0, WIDTH, HEIGHT);
  while (leaves.length) {
    const leaf = leaves.splice(randomInt(leaves.length), 1)[0];
    const stickyTest = randomFactor(0, 100);
    if (stickyTest < leaf.stickyThreshold) {
      leaf.dropped = true;
    }

    if (leaf.dropped && !leaf.isDown) {
      leaf.y += randomFactor(0, 1);
      leaf.x += randomFactor(-2, 2.5);
    }
    // add leaf to used leaves
    if (leaf.y < HEIGHT) {
      usedLeaves.push(leaf);
    } else {
      leaf.x = Math.floor(leaf.x);
      leaf.y = HEIGHT - 2;
      if (leaf.x % 2) {
        leaf.x += 1;
      }
      leaf.isDown = true;
      if (!floor[leaf.x]) {
        floor[leaf.x] = leaf.x;
        usedLeaves.push(leaf);
      }
    }
    // draw Leaf
    leafCtx.beginPath();
    leafCtx.fillStyle = leaf.color;
    leafCtx.moveTo(leaf.x, leaf.y);
    leafCtx.fillRect(Math.floor(leaf.x), Math.floor(leaf.y), 2, 2);
    leafCtx.lineWidth = 1;
    leafCtx.stroke();
  }
  // Reset arrays
  leaves = usedLeaves;
  usedLeaves = [];

  if (leaves.filter(leaf => leaf.y < HEIGHT - 2)) {
    requestAnimationFrame(dropLeaves);
  }
}

function drawBranch(x, y, a, l, strokeWidth, count, color, trunkColors) {
  let frameCount = 1;
  let waypoints = [];

  function drawLine(callback) {
    function animateLine() {
      ctx.beginPath();
      ctx.moveTo(waypoints[frameCount - 1].x, waypoints[frameCount - 1].y);
      ctx.lineTo(waypoints[frameCount].x, waypoints[frameCount].y);
      ctx.strokeStyle = trunkColors[count];
      ctx.lineWidth = strokeWidth;
      ctx.stroke();
      ctx.closePath();
      frameCount++;
      if (frameCount < waypoints.length - 1) {
        requestAnimationFrame(animateLine);
      } else {
        callback();
      }
    }
    animateLine();
  }

  if (count <= MAX_DEPTH) {
    const newCount = count + 1;
    const newX = x + Math.cos(a) * l;
    const newY = y + Math.sin(a) * l;

    waypoints = buildWaypoints(x, y, newX, newY);
    drawLine(() => {
      drawBranch(
        newX, newY,
        a - origin.angleIncrement * randomFactor(1, origin.randomAngleMax),
        l * randomFactor(0.5, 0.9),
        strokeWidth * 0.7,
        newCount,
        color,
        trunkColors,
      );
      drawBranch(
        newX, newY,
        a + origin.angleIncrement * randomFactor(1, origin.randomAngleMax),
        l * randomFactor(0.5, 0.9),
        strokeWidth * 0.7,
        newCount,
        color,
        trunkColors,
      );
    });
    if (count === MAX_DEPTH) {
      leafCtx.beginPath();
      leaves.push({
        x: newX,
        y: newY,
        color,
        stickyThreshold: randomFactor(0, 1),
        dropped: false,
      });
      leafCtx.fillStyle = color;
      leafCtx.fillRect(newX, newY, 2, 2);
      leafCtx.lineWidth = 1;
      leafCtx.stroke();
    }
  } else {
    branchesFinished++;


    // Check and see if all branches have been drawn, if so draw next tree
    if (branchesFinished === 2 ** (MAX_DEPTH + 1)) {
      branchesFinished = 0;
      treesCompleted++;
      if (treesCompleted < MAX_TREES) {
        const treeColor = COLORS[randomInt(COLORS.length)];
        const trunkColors = interpolateColors(BASE_COLOR, treeColor, MAX_DEPTH);
        drawBranch(
          randomFactor(100, WIDTH - 100),
          origin.y, origin.angle, HEIGHT * randomFactor(0.09, 0.2),
          randomFactor(1, 10),
          0,
          treeColor,
          trunkColors,
        );
      } else {
        dropLeaves();
      }
    }
  }
}

const treeColor = COLORS[randomInt(COLORS.length)];
const trunkColors = interpolateColors(BASE_COLOR, treeColor, MAX_DEPTH);

drawBranch(
  randomFactor(100, WIDTH - 100),
  origin.y, origin.angle, HEIGHT * randomFactor(0.09, 0.2),
  randomFactor(1, 10),
  0,
  treeColor,
  trunkColors,
);

