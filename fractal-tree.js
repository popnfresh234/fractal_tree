const canvas = document.getElementById('fractal_canvas');
const ctx = canvas.getContext('2d');

const HEIGHT = 800;
const WIDTH = 1200;
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
  length: HEIGHT * randomFactor(0.1, 0.3),
  angle: -Math.PI / 2,
  angleIncrement: Math.PI / 8,
  randomAngleMax: 1.5,
};


function drawBranch(x, y, a, l, count) {
  if (count < 10) {
    const newCount = count + 1;
    const newX = x + Math.cos(a) * l;
    const newY = y + Math.sin(a) * l;

    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(newX, newY);
    ctx.strokeStyle = 'white';
    ctx.stroke();
    ctx.closePath();

    drawBranch(
      newX, newY,
      a - origin.angleIncrement * randomFactor(1, origin.randomAngleMax),
      l * randomFactor(0.5, 0.8),
      newCount,
    );
    drawBranch(
      newX, newY,
      a + origin.angleIncrement * randomFactor(1, origin.randomAngleMax),
      l * randomFactor(0.5, 0.8),
      newCount,
    );
  }
}

drawBranch(origin.x, origin.y, origin.angle, origin.length, 0);

