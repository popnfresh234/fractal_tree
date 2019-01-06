const canvas = document.getElementById('fractal_canvas');
const ctx = canvas.getContext('2d');

const SIZE = 400;

ctx.canvas.width = SIZE;
ctx.canvas.height = SIZE;

ctx.fillStyle = '#777777';
ctx.fillRect(0, 0, SIZE, SIZE);

const origin = {
  x: SIZE / 2,
  y: SIZE,
  length: 400 * (2 / 3),
};

ctx.beginPath();
ctx.moveTo(origin.x, origin.y);
origin.y *= (2 / 3);
origin.length *= (2 / 3);
ctx.lineTo(origin.x, origin.y);
ctx.strokeStyle = 'white';
ctx.stroke();
ctx.closePath();

ctx.beginPath();
ctx.moveTo(origin.x, origin.y);
origin.length *= (2 / 3);

origin.x += Math.cos(Math.PI / 4) * origin.length;
origin.y -= Math.sin(Math.PI / 4) * origin.length;

ctx.lineTo(origin.x, origin.y);
ctx.strokeStyle = 'white';
ctx.stroke();
ctx.closePath();
