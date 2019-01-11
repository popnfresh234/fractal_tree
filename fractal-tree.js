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


function drawBranch(x, y, a, l, strokeWidth, count) {
  if (count <= 10) {
    const newCount = count + 1;
    const newX = x + Math.cos(a) * l;
    const newY = y + Math.sin(a) * l;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = 'white';
    ctx.lineWidth = strokeWidth;
    ctx.stroke();
    ctx.closePath();

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
  } else {
    ctx.beginPath();
    ctx.arc(x, y, 1, 0, 2 * Math.PI);
    ctx.strokeStyle = '#d822a5';
    ctx.stroke();
  }
}

for (let i = 0; i < 5; i++) {
  drawBranch(randomFactor(400, WIDTH - 400), origin.y, origin.angle, HEIGHT * randomFactor(0.09, 0.2), randomFactor(1, 10), 0);
}

