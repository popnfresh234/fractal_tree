const WIDTH = window.innerWidth;
const HEIGHT = window.innerHeight;

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

const MAX_TREES = 2;
const MAX_DEPTH = 10;
const FRAME_RATE = 5;


let branchesFinished = 0;
let treesCompleted = 0;
let leaves = [];

ctx.fillStyle = '#777777';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

function randomFactor(min, max) {
  return min + (max - min) * Math.random();
}

function randomInt(max) {
  Math.floor(Math.random() * max);
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
    // Pick a random leaf and remove from array
    const leaf = leaves.splice(randomInt(leaves.length), 1)[0];
    // Move the leaf down and left/right
    const stickyTest = randomFactor(0, 100);
    if (stickyTest < leaf.stickyThreshold) {
      leaf.dropped = true;
    }

    if (leaf.dropped) {
      leaf.y += randomFactor(0, 1);
      if (leaf.y > HEIGHT) {
        leaf.y = HEIGHT;
      } else {
        leaf.x += randomFactor(-2, 2.5);
      }
    }
    // add leaf to used leaves
    usedLeaves.push(leaf);
    // draw Leaf
    leafCtx.beginPath();
    leafCtx.arc(leaf.x, leaf.y, 1, 0, 2 * Math.PI);
    leafCtx.strokeStyle = '#d822a5';
    leafCtx.lineWidth = 1;
    leafCtx.stroke();
  }
  // Reset arrays
  leaves = usedLeaves;
  usedLeaves = [];

  if (leaves.filter(leaf => leaf.y < HEIGHT)) {
    requestAnimationFrame(dropLeaves);
  }

  // leaves.sort((a, b) => {
  //   if (a.y > b.y) {
  //     return 1;
  //   } return -1;
  // });
  // leafCtx.clearRect(0, 0, WIDTH, HEIGHT);
  // for (let i = 0; i < leaves.length; i++) {
  //   leaves[i].y += randomFactor(0, 1);
  //   if (leaves[i].y > HEIGHT) {
  //     leaves[i].y = HEIGHT;
  //   } else {
  //     leaves[i].x += randomFactor(-2, 2.5);
  //   }
  //   leafCtx.beginPath();
  //   leafCtx.arc(leaves[i].x, leaves[i].y, 1, 0, 2 * Math.PI);
  //   leafCtx.strokeStyle = '#d822a5';
  //   leafCtx.lineWidth = 1;
  //   leafCtx.stroke();
  // }
  // if (leaves[0].y < HEIGHT) {
  //   requestAnimationFrame(dropLeaves);
  // }
}

function drawBranch(x, y, a, l, strokeWidth, count) {
  let frameCount = 1;
  let waypoints = [];

  function drawLine(callback) {
    function animateLine() {
      ctx.beginPath();
      ctx.moveTo(waypoints[frameCount - 1].x, waypoints[frameCount - 1].y);
      ctx.lineTo(waypoints[frameCount].x, waypoints[frameCount].y);
      ctx.strokeStyle = 'white';
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
      );
      drawBranch(
        newX, newY,
        a + origin.angleIncrement * randomFactor(1, origin.randomAngleMax),
        l * randomFactor(0.5, 0.9),
        strokeWidth * 0.7,
        newCount,
      );
    });
  } else {
    branchesFinished++;
    leafCtx.beginPath();
    leaves.push({
      x, y, stickyThreshold: randomFactor(0, 1), dropped: false,
    });
    leafCtx.arc(x, y, 1, 0, 2 * Math.PI);
    leafCtx.strokeStyle = '#d822a5';
    leafCtx.lineWidth = 1;
    leafCtx.stroke();

    // Check and see if all branches have been drawn, if so draw next tree
    if (branchesFinished === 2 ** (MAX_DEPTH + 1)) {
      branchesFinished = 0;
      treesCompleted++;
      if (treesCompleted < MAX_TREES) {
        drawBranch(
          randomFactor(400, WIDTH - 400),
          origin.y, origin.angle, HEIGHT * randomFactor(0.09, 0.2),
          randomFactor(1, 10), 0,
        );
      } else {
        dropLeaves();
      }
    }
  }
}


drawBranch(
  randomFactor(400, WIDTH - 400),
  origin.y, origin.angle, HEIGHT * randomFactor(0.09, 0.2),
  randomFactor(1, 10), 0,
);

