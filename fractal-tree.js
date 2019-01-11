const canvas = document.getElementById('fractal_canvas');
const ctx = canvas.getContext('2d');
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const HEIGHT = window.innerHeight;
const WIDTH = window.innerWidth;
ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

ctx.fillStyle = '#777777';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

function randomFactor(min, max) {
  return min + (max - min) * Math.random();
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
  const frameRate = 60;
  const waypoints = [];
  const dx = endX - startX;
  const dy = endY - startY;
  for (let i = 0; i < frameRate + 2; i++) {
    const x = startX + dx * i / frameRate;
    const y = startY + dy * i / frameRate;
    waypoints.push({ x, y });
  }
  return waypoints;
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

  if (count <= 10) {
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
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d822a5';
    ctx.stroke();
  }
}

for (let i = 0; i < 10; i++) {
  drawBranch(randomFactor(400, WIDTH - 400), origin.y, origin.angle, HEIGHT * randomFactor(0.09, 0.2), randomFactor(1, 10), 0);
}

