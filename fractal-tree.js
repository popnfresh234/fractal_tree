const canvas = document.getElementById('fractal_canvas');
const ctx = canvas.getContext('2d');

const SIZE = 400;

ctx.canvas.width = SIZE;
ctx.canvas.height = SIZE;

ctx.fillStyle = '#777777';
ctx.fillRect(0, 0, SIZE, SIZE);

function draw() {
  ctx.beginPath();
  ctx.moveTo(origin.x, origin.y);
  origin.length *= (2 / 3);

  if (origin.angle === Math.PI) {
    origin.y = origin.length;
  } else {
    origin.x += Math.cos(origin.angle % Math.PI) * origin.length;
    origin.y -= Math.sin(origin.angle % Math.PI) * origin.length;
  }

  ctx.lineTo(origin.x, origin.y);
  console.log(origin.x, origin.y);
  ctx.strokeStyle = 'white';
  ctx.stroke();
  ctx.closePath();
}

const origin = {
  x: SIZE / 2,
  y: SIZE,
  length: 400 * (2 / 3),
  angle: Math.PI,
};

draw();

