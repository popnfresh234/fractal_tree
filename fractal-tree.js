const canvas = document.getElementById('fractal_canvas');
const ctx = canvas.getContext('2d');

const HEIGHT = 800;
const WIDTH = 1200;
ctx.canvas.width = WIDTH;
ctx.canvas.height = HEIGHT;

ctx.fillStyle = '#777777';
ctx.fillRect(0, 0, WIDTH, HEIGHT);

const origin = {
  x: WIDTH / 2,
  y: HEIGHT,
  length: HEIGHT * (1 / 3),
  angle: -Math.PI / 2,
};


function drawBranch(x, y, a, l) {
  const newX = x + Math.cos(a) * l;
  const newY = y + Math.sin(a) * l;

  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.lineTo(newX, newY);
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.closePath();
  if (l > 4) {
    drawBranch(newX, newY, a - (Math.PI / 8), l * (2 / 3));
    drawBranch(newX, newY, a + (Math.PI / 8), l * (2 / 3));
  }
}

drawBranch(origin.x, origin.y, origin.angle, origin.length);

